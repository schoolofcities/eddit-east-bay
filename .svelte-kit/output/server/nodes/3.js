import * as universal from '../entries/pages/_page.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.js";
export const imports = ["_app/immutable/nodes/3.gS4kMJk0.js","_app/immutable/chunks/NZTpNUN0.js","_app/immutable/chunks/C7v5RP4o.js","_app/immutable/chunks/Cc97V9t3.js","_app/immutable/chunks/YyYSWFJU.js","_app/immutable/chunks/Bc8fxahD.js","_app/immutable/chunks/BBNV1STn.js","_app/immutable/chunks/CmhHv5qk.js"];
export const stylesheets = ["_app/immutable/assets/3.DZ3SCYJ0.css"];
export const fonts = ["_app/immutable/assets/Trade Gothic LT Bold.C7yXBsew.ttf","_app/immutable/assets/Trade Gothic LT Bold Oblique.DFLMmLyN.ttf","_app/immutable/assets/Trade Gothic LT Oblique.DFtrEs3A.ttf","_app/immutable/assets/Trade Gothic LT.Bh-QUB3E.ttf","_app/immutable/assets/Trade Gothic LT Light Oblique.bDXrON0t.ttf","_app/immutable/assets/Trade Gothic LT Light.yd_H8BMx.ttf","_app/immutable/assets/SourceSerifPro-Regular.BPwlsytF.otf","_app/immutable/assets/SourceSerifPro-It.CHDGt5XA.otf","_app/immutable/assets/SourceSerifPro-Bold.DcBB67M_.otf","_app/immutable/assets/SourceSerifPro-BoldIt.C7TQxocQ.otf","_app/immutable/assets/OpenSans-Regular.DxJTClRG.ttf","_app/immutable/assets/OpenSans-Italic.C_AuCsze.ttf","_app/immutable/assets/OpenSans-Bold.DGvYQtcs.ttf","_app/immutable/assets/OpenSans-BoldItalic.DDyywkPM.ttf"];
