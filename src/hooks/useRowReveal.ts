'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/** Смещение карточки до появления, px (мягкое, без масштаба и блюра) */
export const REVEAL_OFFSET = 40;

/** Запас, чтобы карточка не мерцала ровно на линии триггера */
const HYSTERESIS = 8;

/** Общий transition для карточек, раскрывающихся построчно */
export const REVEAL_TRANSITION =
  'opacity 600ms ease-out, transform 600ms ease-out, border-color 300ms ease-out, background-color 300ms ease-out';

/** Направление выезда: крайние карточки — с боков, центральные — снизу */
export function getEdgeRevealTransform(
  indexInRow: number,
  rowLength: number,
  rowIndex: number
): string {
  // Одна колонка (мобильный): чередуем стороны - слева, справа, слева…
  if (rowLength === 1) {
    return rowIndex % 2 === 0
      ? `translate3d(-${REVEAL_OFFSET}px, 0, 0)`
      : `translate3d(${REVEAL_OFFSET}px, 0, 0)`;
  }

  if (indexInRow === 0) return `translate3d(-${REVEAL_OFFSET}px, 0, 0)`;
  if (indexInRow === rowLength - 1) return `translate3d(${REVEAL_OFFSET}px, 0, 0)`;
  return `translate3d(0, ${REVEAL_OFFSET}px, 0)`;
}

/** Направление выезда: строго с боков - слева и справа, без движения снизу */
export function getSideRevealTransform(
  indexInRow: number,
  rowLength: number,
  rowIndex: number
): string {
  // Одна колонка (мобильный): чередуем стороны по строкам
  const fromLeft =
    rowLength === 1 ? rowIndex % 2 === 0 : indexInRow % 2 === 0;

  return fromLeft
    ? `translate3d(-${REVEAL_OFFSET}px, 0, 0)`
    : `translate3d(${REVEAL_OFFSET}px, 0, 0)`;
}

interface ColumnBreakpoints {
  /** ширина < 640px */
  base: number;
  /** ширина >= 640px */
  sm: number;
  /** ширина >= 1024px */
  lg: number;
}

interface UseRowRevealOptions {
  columns?: Partial<ColumnBreakpoints>;
}

/**
 * Разбивает список на строки по текущему числу колонок и отмечает строку
 * активной, когда её верх поднялся выше центра экрана. Обратное условие даёт
 * симметричное скрытие при скролле вверх.
 */
export default function useRowReveal<T>(
  items: readonly T[],
  options: UseRowRevealOptions = {}
) {
  const { base = 1, sm = 2, lg = 3 } = options.columns ?? {};

  // Стартуем с десктопного значения - совпадает с серверным рендером,
  // уточняем после гидрации.
  const [columns, setColumns] = useState(lg);
  const [activeRows, setActiveRows] = useState<Set<number>>(new Set());
  const [reducedMotion, setReducedMotion] = useState(false);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  const rows = useMemo(() => {
    const chunks: T[][] = [];
    for (let i = 0; i < items.length; i += columns) {
      chunks.push(items.slice(i, i + columns) as T[]);
    }
    return chunks;
  }, [items, columns]);

  const setRowRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      rowRefs.current[index] = el;
    },
    []
  );

  // Отслеживаем брейкпоинты и prefers-reduced-motion
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setReducedMotion(motionQuery.matches);
    syncMotion();
    motionQuery.addEventListener('change', syncMotion);

    const syncColumns = () => {
      const width = window.innerWidth;
      setColumns(width >= 1024 ? lg : width >= 640 ? sm : base);
    };
    syncColumns();
    window.addEventListener('resize', syncColumns);

    return () => {
      motionQuery.removeEventListener('change', syncMotion);
      window.removeEventListener('resize', syncColumns);
    };
  }, [base, sm, lg]);

  useEffect(() => {
    if (reducedMotion) {
      setActiveRows(new Set(rows.map((_, i) => i)));
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight / 2;

      setActiveRows((prev) => {
        const next = new Set(prev);
        let changed = false;

        rowRefs.current.forEach((row, index) => {
          if (!row) return;
          const { top } = row.getBoundingClientRect();
          const wasActive = prev.has(index);
          // Гистерезис: порог включения и выключения слегка разнесён
          const shouldBeActive = wasActive
            ? top <= line + HYSTERESIS
            : top <= line;

          if (shouldBeActive && !wasActive) {
            next.add(index);
            changed = true;
          } else if (!shouldBeActive && wasActive) {
            next.delete(index);
            changed = true;
          }
        });

        return changed ? next : prev;
      });
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [rows, reducedMotion]);

  return { columns, rows, activeRows, setRowRef };
}
