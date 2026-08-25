/**
 * Валидация входных данных и экранирование для внешних получателей.
 */

/** Ограничения длины полей, чтобы в PDF и БД не уезжали километровые строки */
export const FIELD_LIMITS = {
  name: 120,
  phone: 40,
  shortText: 200,
  longText: 4000
} as const

/**
 * Экранирует символы, значимые для Telegram parse_mode: 'HTML'.
 * Без этого имя вида <b>текст</b> становится разметкой в сообщении админу.
 * Telegram требует экранировать ровно эти три символа.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

/**
 * Приводит произвольное значение к безопасной строке:
 * убирает управляющие символы, сжимает пробелы, обрезает по лимиту.
 */
export function sanitizeString(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return ''

  return value
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength)
}

/** Строка непустая после нормализации */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

/**
 * Телефон: только цифры, плюс, пробелы и разделители, длина в разумных рамках.
 * Полную проверку делает libphonenumber-js на клиенте, здесь защита сервера.
 */
export function isPlausiblePhone(value: unknown): boolean {
  if (!isNonEmptyString(value)) return false
  const cleaned = value.replace(/[^\d+]/g, '')
  return cleaned.length >= 7 && cleaned.length <= 20
}

/** Безопасный фрагмент для имени файла: без слэшей, кавычек и точек-путей */
export function safeFileNamePart(value: string, maxLength = 60): string {
  return value
    .replace(/[^\p{L}\p{N}_-]+/gu, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, maxLength) || 'client'
}

export interface ContactInput {
  fullName: string
  whatsapp: string
}

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string }

/** Проверяет и нормализует контактные данные из тела запроса */
export function validateContact(raw: unknown): ValidationResult<ContactInput> {
  if (typeof raw !== 'object' || raw === null) {
    return { ok: false, error: 'Контактные данные отсутствуют' }
  }

  const source = raw as Record<string, unknown>
  const fullName = sanitizeString(source.fullName, FIELD_LIMITS.name)
  const whatsapp = sanitizeString(source.whatsapp, FIELD_LIMITS.phone)

  if (!fullName) {
    return { ok: false, error: 'Укажите ФИО' }
  }
  if (!isPlausiblePhone(whatsapp)) {
    return { ok: false, error: 'Некорректный номер телефона' }
  }

  return { ok: true, value: { fullName, whatsapp } }
}
