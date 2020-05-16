(window as any)['global'] = window;

// * `window.location` was removed in Deno@v1.0.0-rc1.
// * Mocha depends on `window.location`.
window.location = {};
