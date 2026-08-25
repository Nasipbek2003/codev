/**
 * Простой in-memory rate limiter на скользящем окне.
 *
 * ОГРАНИЧЕНИЕ: счётчики живут в памяти процесса. На одном сервере или VPS
 * работает как надо. В serverless (Vercel) у каждого инстанса своя память,
 * поэтому фактический лимит умножается на число живых инстансов.
 * Для строгой защиты нужен внешний стор (Upstash Redis и подобное).
 * Даже в таком виде это отсекает примитивный флуд в цикле.
 */

interface Entry {
  /** Метки времени запросов внутри окна */
  hits: number[]
}

const buckets = new Map<string, Entry>()

/** Реже, чем раз в минуту, чистить смысла нет */
const CLEANUP_INTERVAL_MS = 60_000
let lastCleanup = Date.now()

function cleanup(windowMs: number) {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return
  lastCleanup = now

  for (const [key, entry] of buckets) {
    const fresh = entry.hits.filter((t) => now - t < windowMs)
    if (fresh.length === 0) buckets.delete(key)
    else entry.hits = fresh
  }
}

export interface RateLimitResult {
  allowed: boolean
  /** Сколько запросов ещё доступно в текущем окне */
  remaining: number
  /** Через сколько секунд можно повторить (для заголовка Retry-After) */
  retryAfterSeconds: number
}

/**
 * @param key       идентификатор клиента (обычно IP + имя роута)
 * @param limit     сколько запросов разрешено в окне
 * @param windowMs  длина окна в миллисекундах
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  cleanup(windowMs)

  const now = Date.now()
  const entry = buckets.get(key) ?? { hits: [] }

  // Оставляем только попадания внутри окна
  entry.hits = entry.hits.filter((t) => now - t < windowMs)

  if (entry.hits.length >= limit) {
    const oldest = entry.hits[0]
    const retryAfterSeconds = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000))
    buckets.set(key, entry)
    return { allowed: false, remaining: 0, retryAfterSeconds }
  }

  entry.hits.push(now)
  buckets.set(key, entry)

  return {
    allowed: true,
    remaining: limit - entry.hits.length,
    retryAfterSeconds: 0
  }
}

/**
 * IP клиента. За прокси/CDN настоящий адрес приходит в x-forwarded-for,
 * берём первый элемент списка.
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown'
}
