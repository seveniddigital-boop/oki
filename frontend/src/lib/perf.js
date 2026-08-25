// Lightweight capability detection so heavy visuals adapt to the device
// instead of degrading everywhere.

export function prefersReducedMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

export function isCoarsePointer() {
  try {
    return window.matchMedia("(pointer: coarse)").matches;
  } catch {
    return false;
  }
}

export function getPerfTier() {
  try {
    const mem = navigator.deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    if (mem <= 2 || cores <= 2) return "low";
    if (isCoarsePointer() || mem <= 4) return "mid";
    return "high";
  } catch {
    return "mid";
  }
}

export function perfEnabled() {
  try {
    return (
      new URLSearchParams(window.location.search).get("perf") === "1" ||
      localStorage.getItem("oki-perf") === "1"
    );
  } catch {
    return false;
  }
}
