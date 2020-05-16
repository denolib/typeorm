(window as any)['global'] = window;

// * `window.location` was removed in Deno@v1.0.0-rc1.
// * Mocha depends on `window.location`.
if ((window as any).location == null) {
  (window as any).location = {};
}
