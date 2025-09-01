import { useCallback } from 'react';

/**
 * useScrollToTop Hook
 * 
 * Provides utility functions for manual scroll control.
 * Useful when you need to scroll to top from specific user actions
 * or when the automatic ScrollToTop component isn't sufficient.
 * 
 * @example
 * const { scrollToTop, scrollToElement, scrollToPosition } = useScrollToTop();
 * 
 * // Scroll to top
 * scrollToTop();
 * 
 * // Scroll to specific element
 * scrollToElement('#section-id');
 * 
 * // Scroll to specific position
 * scrollToPosition(500);
 */
export function useScrollToTop() {
  /**
   * Scrolls to the top of the page
   */
  const scrollToTop = useCallback((behavior: ScrollBehavior = 'smooth') => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior
    });
  }, []);

  /**
   * Scrolls to a specific element by selector
   */
  const scrollToElement = useCallback((selector: string, behavior: ScrollBehavior = 'smooth') => {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({
        behavior,
        block: 'start',
        inline: 'nearest'
      });
    }
  }, []);

  /**
   * Scrolls to a specific position
   */
  const scrollToPosition = useCallback((top: number, left: number = 0, behavior: ScrollBehavior = 'smooth') => {
    window.scrollTo({
      top,
      left,
      behavior
    });
  }, []);

  /**
   * Scrolls to top with instant behavior (no animation)
   */
  const scrollToTopInstant = useCallback(() => {
    scrollToTop('auto');
  }, [scrollToTop]);

  /**
   * Scrolls to an element with instant behavior
   */
  const scrollToElementInstant = useCallback((selector: string) => {
    scrollToElement(selector, 'auto');
  }, [scrollToElement]);

  return {
    scrollToTop,
    scrollToTopInstant,
    scrollToElement,
    scrollToElementInstant,
    scrollToPosition
  };
}
