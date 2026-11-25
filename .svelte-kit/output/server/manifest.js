export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "eddit-east-bay/_app",
	assets: new Set([".nojekyll","business_statistics/broad_sector_distribution.csv","business_statistics/employee_range_distribution.csv","business_statistics/own_or_lease_da_distribution.csv","business_statistics/sales_range_distribution.csv","examples/amroth-iso-bldg.png","examples/amroth-iso-lot.png","examples/buildings-2025.pmtiles","examples/map-asthma-360.svg","examples/map-heat-360.svg","examples/map-tree-360.svg","examples/map-tree-redline-360.svg","examples/map-tree-redline-720.svg","examples/wilson-iso-bldg.svg","examples/wilson-iso-lot.svg","favicon.svg"]),
	mimeTypes: {".csv":"text/csv",".png":"image/png",".svg":"image/svg+xml"},
	_: {
		client: {start:"_app/immutable/entry/start.Ci72mIC8.js",app:"_app/immutable/entry/app.DVg_qosP.js",imports:["_app/immutable/entry/start.Ci72mIC8.js","_app/immutable/chunks/DVdFOwWe.js","_app/immutable/chunks/ncTuHAue.js","_app/immutable/chunks/CoPL-fNc.js","_app/immutable/chunks/FuETYIb1.js","_app/immutable/entry/app.DVg_qosP.js","_app/immutable/chunks/D9Z9MdNV.js","_app/immutable/chunks/CoPL-fNc.js","_app/immutable/chunks/ncTuHAue.js","_app/immutable/chunks/NZTpNUN0.js","_app/immutable/chunks/Bew7WIJr.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		routes: [
			
		],
		prerendered_routes: new Set(["/eddit-east-bay/","/eddit-east-bay/map"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
