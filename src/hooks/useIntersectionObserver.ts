'use client';

import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Низкие пороги-страховка. Для секции, которая выше экрана, заданный ratio
 * (например 0.1) физически недостижим, и без этих порогов observer просто
 * не получит ни одного вызова после начала пересечения.
 */
const FALLBACK_THRESHOLDS = [0, 0.005, 0.01, 0.02, 0.05];

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px',
    triggerOnce = true
  } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const targetRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const requested = Array.isArray(threshold) ? threshold : [threshold];
    const minThreshold = Math.min(...requested);
    const thresholds = Array.from(
      new Set([...FALLBACK_THRESHOLDS, ...requested])
    ).sort((a, b) => a - b);

    const observer = new IntersectionObserver(
      ([entry]) => {
        const rootHeight = entry.rootBounds?.height ?? window.innerHeight;

        // Секция выше вьюпорта: 10% её площади не поместятся в экран, поэтому
        // ratio-порог никогда не будет достигнут. В этом случае считаем секцию
        // видимой по самому факту пересечения - запас в пикселях уже задан
        // через rootMargin.
        const tallerThanViewport =
          entry.boundingClientRect.height > rootHeight;

        const isIntersecting =
          entry.isIntersecting &&
          (tallerThanViewport || entry.intersectionRatio >= minThreshold);

        if (isIntersecting && (!triggerOnce || !hasTriggered)) {
          setIsVisible(true);
          if (triggerOnce) {
            setHasTriggered(true);
          }
        } else if (!triggerOnce && !isIntersecting) {
          setIsVisible(false);
        }
      },
      {
        threshold: thresholds,
        rootMargin
      }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return { targetRef, isVisible };
}

export default useIntersectionObserver;
