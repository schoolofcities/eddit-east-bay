export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "eddit-east-bay/_app",
	assets: new Set([".DS_Store",".nojekyll","business_statistics/broad_sector_distribution.csv","business_statistics/employee_range_distribution.csv","business_statistics/own_or_lease_da_distribution.csv","business_statistics/sales_range_distribution.csv","examples/amroth-iso-bldg.png","examples/amroth-iso-lot.png","examples/buildings-2025.pmtiles","examples/map-asthma-360.svg","examples/map-heat-360.svg","examples/map-tree-360.svg","examples/map-tree-redline-360.svg","examples/map-tree-redline-720.svg","examples/wilson-iso-bldg.svg","examples/wilson-iso-lot.svg","favicon.svg"]),
	mimeTypes: {".csv":"text/csv",".png":"image/png",".svg":"image/svg+xml"},
	_: {
		client: {start:"_app/immutable/entry/start.Cs30PvXA.js",app:"_app/immutable/entry/app.DHds1E2O.js",imports:["_app/immutable/entry/start.Cs30PvXA.js","_app/immutable/chunks/CCQSesF0.js","_app/immutable/chunks/DRdZkEOX.js","_app/immutable/chunks/lKo_2PhX.js","_app/immutable/chunks/DoEPwliR.js","_app/immutable/entry/app.DHds1E2O.js","_app/immutable/chunks/lKo_2PhX.js","_app/immutable/chunks/DRdZkEOX.js","_app/immutable/chunks/NZTpNUN0.js","_app/immutable/chunks/BmOGrPHS.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/map",
				pattern: /^\/map\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 4 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
