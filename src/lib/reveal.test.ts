import { describe, expect, it, vi } from "vitest";
import { observeReveal, releaseReveal, unobserveReveal } from "./reveal";

interface FakeElement {
  attributes: Record<string, string>;
  setAttribute(name: string, value: string): void;
  getAttribute(name: string): string | null;
}

/**
 * Minimal Element stand-in: just the attribute surface the module touches.
 *
 * @returns A fresh fake element.
 */
function fakeElement(): FakeElement {
  const attributes: Record<string, string> = {};
  return {
    attributes,
    setAttribute(name, value) {
      attributes[name] = value;
    },
    getAttribute(name) {
      return attributes[name] ?? null;
    },
  };
}

class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];

  readonly callback: (entries: IntersectionObserverEntry[]) => void;
  readonly rootMargin: string | undefined;
  readonly targets = new Set<FakeElement>();

  constructor(
    callback: (entries: IntersectionObserverEntry[]) => void,
    options?: IntersectionObserverInit,
  ) {
    this.callback = callback;
    this.rootMargin = options?.rootMargin;
    FakeIntersectionObserver.instances.push(this);
  }

  observe(target: FakeElement): void {
    this.targets.add(target);
  }

  unobserve(target: FakeElement): void {
    this.targets.delete(target);
  }

  disconnect(): void {
    this.targets.clear();
  }

  /**
   * Delivers an entry the way the browser would.
   *
   * @param target - Element the entry belongs to.
   * @param isIntersecting - Whether the element is inside the viewport.
   * @returns Nothing.
   */
  intersect(target: FakeElement, isIntersecting: boolean): void {
    this.callback([{ target, isIntersecting } as unknown as IntersectionObserverEntry]);
  }
}

const rootElement = {
  setAttribute: vi.fn(),
  removeAttribute: vi.fn(),
};

const reveal = (element: FakeElement) => observeReveal(element as unknown as Element);
const unreveal = (element: FakeElement) => unobserveReveal(element as unknown as Element);

/** Wipes the module-level observer between tests. */
function resetModule(): void {
  releaseReveal();
  FakeIntersectionObserver.instances = [];
  rootElement.setAttribute.mockClear();
  rootElement.removeAttribute.mockClear();
}

vi.stubGlobal("document", { documentElement: rootElement });

describe("observeReveal observer sharing", () => {
  it("creates a single observer for every revealed element", () => {
    resetModule();
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);

    reveal(fakeElement());
    reveal(fakeElement());
    reveal(fakeElement());

    expect(FakeIntersectionObserver.instances).toHaveLength(1);
    expect(FakeIntersectionObserver.instances[0].targets.size).toBe(3);
  });

  it("reuses the existing observer instead of allocating a new one", () => {
    resetModule();
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);

    reveal(fakeElement());
    const first = FakeIntersectionObserver.instances[0];
    reveal(fakeElement());

    expect(FakeIntersectionObserver.instances).toHaveLength(1);
    expect(first.targets.size).toBe(2);
  });

  it("keeps the viewport shrink margin used by the old whileInView setup", () => {
    resetModule();
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);

    reveal(fakeElement());

    expect(FakeIntersectionObserver.instances[0].rootMargin).toBe("0px 0px -48px 0px");
  });
});

describe("observeReveal reveal state", () => {
  it("marks intersecting elements as revealed and stops observing them", () => {
    resetModule();
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);

    const element = fakeElement();
    reveal(element);
    FakeIntersectionObserver.instances[0].intersect(element, true);

    expect(element.getAttribute("data-revealed")).toBe("true");
    expect(FakeIntersectionObserver.instances[0].targets.has(element)).toBe(false);
  });

  it("leaves elements that have not entered the viewport untouched", () => {
    resetModule();
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);

    const element = fakeElement();
    reveal(element);
    FakeIntersectionObserver.instances[0].intersect(element, false);

    expect(element.getAttribute("data-revealed")).toBeNull();
    expect(FakeIntersectionObserver.instances[0].targets.has(element)).toBe(true);
  });

  it("reveals only the intersecting elements of a batch", () => {
    resetModule();
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);

    const above = fakeElement();
    const below = fakeElement();
    reveal(above);
    reveal(below);
    FakeIntersectionObserver.instances[0].intersect(above, true);
    FakeIntersectionObserver.instances[0].intersect(below, false);

    expect(above.getAttribute("data-revealed")).toBe("true");
    expect(below.getAttribute("data-revealed")).toBeNull();
  });
});

describe("unobserveReveal", () => {
  it("removes an element that unmounts before being revealed", () => {
    resetModule();
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);

    const element = fakeElement();
    const other = fakeElement();
    reveal(element);
    reveal(other);
    unreveal(element);

    expect(FakeIntersectionObserver.instances[0].targets.has(element)).toBe(false);
    expect(FakeIntersectionObserver.instances[0].targets.has(other)).toBe(true);
  });

  it("is a no-op before the observer exists", () => {
    resetModule();
    expect(() => unreveal(fakeElement())).not.toThrow();
  });
});

describe("document opt-in", () => {
  it("flags the document so CSS may hide not-yet-revealed elements", () => {
    resetModule();
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);

    expect(rootElement.setAttribute).not.toHaveBeenCalled();
    reveal(fakeElement());

    expect(rootElement.setAttribute).toHaveBeenCalledWith("data-reveal-ready", "");
  });

  it("clears the opt-in and disconnects the observer on release", () => {
    resetModule();
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);

    reveal(fakeElement());
    releaseReveal();

    expect(rootElement.removeAttribute).toHaveBeenCalledWith("data-reveal-ready");
    expect(FakeIntersectionObserver.instances[0].targets.size).toBe(0);
  });

  it("starts a fresh observer after a release", () => {
    resetModule();
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);

    reveal(fakeElement());
    releaseReveal();
    reveal(fakeElement());

    expect(FakeIntersectionObserver.instances).toHaveLength(2);
  });
});

describe("graceful degradation", () => {
  it("keeps content visible when IntersectionObserver is unavailable", () => {
    resetModule();
    vi.stubGlobal("IntersectionObserver", undefined);

    const element = fakeElement();
    expect(() => reveal(element)).not.toThrow();
    expect(FakeIntersectionObserver.instances).toHaveLength(0);
    expect(element.getAttribute("data-revealed")).toBeNull();
    expect(rootElement.setAttribute).not.toHaveBeenCalled();
  });
});
