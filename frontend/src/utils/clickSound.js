let ctx = null;

function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export function playClick() {
  try {
    const c = getCtx();
    if (!c) return;
    const t = c.currentTime;

    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(90, t + 0.08);
    gain.gain.setValueAtTime(0.07, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    osc.connect(gain).connect(c.destination);
    osc.start(t);
    osc.stop(t + 0.13);

    const tick = c.createOscillator();
    const tickGain = c.createGain();
    tick.type = "triangle";
    tick.frequency.setValueAtTime(2400, t);
    tickGain.gain.setValueAtTime(0.018, t);
    tickGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
    tick.connect(tickGain).connect(c.destination);
    tick.start(t);
    tick.stop(t + 0.04);
  } catch {
    /* audio unavailable */
  }
}
