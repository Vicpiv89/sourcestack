// Microsoft Clarity: free analytics + session replay, no-ops until VITE_CLARITY_ID is set
// (set it in Render's env vars for prod, .env.local for local dev).

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}

export function initClarity() {
  const id = import.meta.env.VITE_CLARITY_ID;
  if (!id) return;

  /* eslint-disable */
  (function (c: any, l: Document, a: string, r: string, i: string) {
    c[a] =
      c[a] ||
      function () {
        (c[a].q = c[a].q || []).push(arguments);
      };
    const t = l.createElement(r) as HTMLScriptElement;
    t.async = true;
    t.src = "https://www.clarity.ms/tag/" + i;
    const y = l.getElementsByTagName(r)[0];
    y.parentNode!.insertBefore(t, y);
  })(window, document, "clarity", "script", id);
  /* eslint-enable */
}

export function clarityEvent(name: string) {
  window.clarity?.("event", name);
}

export function claritySet(key: string, value: string) {
  window.clarity?.("set", key, value);
}
