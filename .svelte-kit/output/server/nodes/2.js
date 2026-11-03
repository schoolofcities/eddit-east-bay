import * as universal from '../entries/pages/map/_layout.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/map/+layout.js";
export const imports = ["_app/immutable/nodes/2.vLFx5l5r.js","_app/immutable/chunks/D26OK1GW.js","_app/immutable/chunks/NZTpNUN0.js","_app/immutable/chunks/Io8RqZ5S.js"];
export const stylesheets = [];
export const fonts = [];
