let lockDepth = 0;

function measureVerticalScrollbarLayoutGapPx(): number {
  const html = document.documentElement;
  const previousOverflow = html.style.overflow;
  const before = window.innerWidth;
  html.style.overflow = "hidden";
  const after = window.innerWidth;
  html.style.overflow = previousOverflow;
  const delta = after - before;
  return delta > 0 ? delta : 0;
}

export function acquireDocumentScrollLock(): () => void {
  const html = document.documentElement;

  if (lockDepth === 0) {
    const gapPx = measureVerticalScrollbarLayoutGapPx();
    if (gapPx > 0) {
      html.style.setProperty("--layout-scrollbar-width", `${gapPx}px`);
    }
    html.setAttribute("data-scroll-locked", "");
  }

  lockDepth += 1;

  let released = false;

  return () => {
    if (released) return;
    released = true;
    lockDepth -= 1;
    if (lockDepth <= 0) {
      lockDepth = 0;
      html.removeAttribute("data-scroll-locked");
      html.style.removeProperty("--layout-scrollbar-width");
    }
  };
}
