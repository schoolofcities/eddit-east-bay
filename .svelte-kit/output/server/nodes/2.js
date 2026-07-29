import * as universal from '../entries/pages/map/_layout.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/map/+layout.js";
export const imports = ["_app/immutable/nodes/2.Cc3gclBg.js","_app/immutable/chunks/CvPZ3yPI.js","_app/immutable/chunks/NZTpNUN0.js","_app/immutable/chunks/lKo_2PhX.js"];
export const stylesheets = [];
export const fonts = [];
