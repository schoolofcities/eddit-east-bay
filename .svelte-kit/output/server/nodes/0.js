import * as universal from '../entries/pages/_layout.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.D4N3g9Pt.js","_app/immutable/chunks/Df7oKQoZ.js","_app/immutable/chunks/NZTpNUN0.js","_app/immutable/chunks/CriV0zfZ.js"];
export const stylesheets = [];
export const fonts = [];
