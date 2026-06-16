import * as universal from '../entries/pages/map/_layout.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/map/+layout.js";
export const imports = ["_app/immutable/nodes/2.CCinZlrZ.js","_app/immutable/chunks/C8TSKq2y.js","_app/immutable/chunks/NZTpNUN0.js","_app/immutable/chunks/Cc97V9t3.js","_app/immutable/chunks/Bc8fxahD.js"];
export const stylesheets = [];
export const fonts = [];
