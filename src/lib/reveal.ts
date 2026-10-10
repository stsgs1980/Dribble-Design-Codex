/**
 * Shared scroll-reveal infrastructure.
 *
 * Every paragraph, list, quote and table of a rendered document used to be its
 * own framer-motion `whileInView` instance: ~450 IntersectionObservers plus
 * ~450 animated components for a single page. Revealing now runs through one
 * document-wide observer that flips an attribute on each element, and the
 * animation itself is pure CSS (see the reveal rules in app/globals.css).
 */

/** Viewport shrink, matching the margin the old `whileInView` config used. */
const REVEAL_ROOT_MARGIN = "0px 0px -48px 0px";

/** Opt-in marker read by globals.css to hide not-yet-revealed elements. */
const READY_ATTRIBUTE = "data-reveal-ready";

/** Marked on an element once it has entered the viewport. */
const REVEALED_ATTRIBUTE = "data-revealed";

let sharedObserver: IntersectionObserver | null = null;

/**
 * Builds the shared observer and opts the document in.
 *
 * @returns The observer, or null when IntersectionObserver is unavailable.
 */
function createSharedObserver(): IntersectionObserver | null {
  // Absent on the server, on older browsers and under jsdom.
  if (typeof IntersectionObserver === "undefined") return null;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute(REVEALED_ATTRIBUTE, "true");
        // `once: true` parity: each element is revealed a single time, so the
        // observed set shrinks as the reader scrolls through the document.
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: REVEAL_ROOT_MARGIN },
  );

  // Only once the observer exists is it safe for CSS to hide unrevealed
  // elements: without scripting nothing ever sets this attribute, so the
  // whole document is served as plain, fully visible markup.
  globalThis.document?.documentElement?.setAttribute(READY_ATTRIBUTE, "");

  return observer;
}

/**
 * Registers an element with the shared reveal observer. Elements that are
 * never observed because the API is missing simply stay visible.
 *
 * @param element - DOM node to reveal once it enters the viewport.
 * @returns Nothing.
 */
export function observeReveal(element: Element): void {
  sharedObserver ??= createSharedObserver();
  sharedObserver?.observe(element);
}

/**
 * Drops an element from the shared reveal observer, used as the React ref
 * cleanup when a block unmounts before it was ever revealed.
 *
 * @param element - DOM node previously passed to observeReveal.
 * @returns Nothing.
 */
export function unobserveReveal(element: Element): void {
  sharedObserver?.unobserve(element);
}

/**
 * Disconnects the shared observer and clears the document opt-in. Intended for
 * tests; the observer lives for the lifetime of the page in the app.
 *
 * @returns Nothing.
 */
export function releaseReveal(): void {
  sharedObserver?.disconnect();
  sharedObserver = null;
  globalThis.document?.documentElement?.removeAttribute(READY_ATTRIBUTE);
}
