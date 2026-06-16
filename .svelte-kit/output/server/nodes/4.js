import * as universal from '../entries/pages/map/_page.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/map/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/map/+page.js";
export const imports = ["_app/immutable/nodes/4.B1qej-ef.js","_app/immutable/chunks/NZTpNUN0.js","_app/immutable/chunks/C7v5RP4o.js","_app/immutable/chunks/Cc97V9t3.js"];
export const stylesheets = [];
export const fonts = [];
