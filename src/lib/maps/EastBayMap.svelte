<script>
	import { onMount } from "svelte";
	import maplibregl from "maplibre-gl";
	import "maplibre-gl/dist/maplibre-gl.css";
	import { LAYER_GROUPS, CORRIDOR_BOUNDARIES } from "./LayerConfig.js";
	import bartLines from "../../data/BART-lines.geo.json";
	import bartStops from "../../data/BART-stops.geo.json";
	import boundaryMask from "../../data/OAK_boundary_mask.geo.json";
	import neighbourhoodLabels from "../../data/OAK_neighborhood_labels.geo.json";
	import councilDistricts from "../../data/OAK_council_districts.geo.json";
	import districtMask from "../../data/OAK_district_mask.geo.json";

	import districtLabels from "../../data/OAK_district_labels.geo.json";
	import oaklandCensus from "../../data/OAK_BG.geo.json";

	import basemapLayers from "$lib/maps/neutral-grey.json";

	const OAK_GREEN = "#2C683D";
	const OAK_ACCENT = "#EAC555";

	let {
		map = $bindable(null),
		selectedCorridorId = $bindable(null),
		layerState = {},
	} = $props();

	const MAP_STYLE = {
		version: 8,
		glyphs: "https://schoolofcities.github.io/fonts/fonts/{fontstack}/{range}.pbf",
		sources: {
			openmaptiles: {
				type: "vector",
				url: "https://tiles.openfreemap.org/planet",
			},
		},
		layers: basemapLayers,
	};

	const MAP_CENTER = [-122.28579885398307, 37.80632466850597];
	const MAP_ZOOM = 11;
	const MAP_MIN_ZOOM = 10;
	const MAP_MAX_ZOOM = 16;
	const MAP_MAX_BOUNDS = [
		[-122.42344545726321, 37.68937245249528],
		[-122.01839762270654, 37.95815075668805],
	];

	let mapContainer;
	let mapLoaded = $state(false);

	onMount(() => {
		map = new maplibregl.Map({
			container: mapContainer,
			style: MAP_STYLE,
			center: MAP_CENTER,
			zoom: MAP_ZOOM,
			minZoom: MAP_MIN_ZOOM,
			maxZoom: MAP_MAX_ZOOM,
			maxBounds: MAP_MAX_BOUNDS,
			pitch: 0,
			maxPitch: 0,
			attributionControl: false,
		});

		map.addControl(
			new maplibregl.NavigationControl({ showCompass: true }),
			"top-right",
		);
		map.addControl(
			new maplibregl.ScaleControl({ unit: "metric", maxWidth: 100 }),
			"bottom-right",
		);
		map.addControl(
			new maplibregl.AttributionControl({ compact: true }),
			"bottom-left",
		);
		map.dragRotate.disable();
		map.touchZoomRotate.disableRotation();

		map.on("load", () => {
			mapLoaded = true;
			addBoundaryMask();
			addDemographyLayers();
			// addActivityLayers();
			addNeighbourhoods();
			addCouncilDistricts();
			// addBids();
			addBartLayers();
			addCorridorBoundaries();
			// map.getStyle()
			// 	.layers.filter((layer) => layer.id.includes("name"))
			// 	.forEach((layer) => map.moveLayer(layer.id));
			syncLayers();
		});

		const resizeObserver = new ResizeObserver(() => map?.resize());
		resizeObserver.observe(mapContainer);

		return () => {
			resizeObserver.disconnect();
			map?.remove();
		};
	});

	function addBoundaryMask() {
		if (!map) return;

		map.addSource("oak-boundary-mask", {
			type: "geojson",
			data: boundaryMask,
		});

		map.addLayer({
			id: "oak-boundary-mask-fill",
			type: "fill",
			source: "oak-boundary-mask",
			filter: ["==", ["get", "layer"], "Difference"],
			paint: {
				"fill-color": "#ffffff",
				"fill-opacity": 0,
			},
		});

		map.addLayer({
			id: "oak-boundary-outline",
			type: "line",
			source: "oak-boundary-mask",
			filter: ["==", ["get", "layer"], "OAK_Boundary"],
			paint: {
				"line-color": "grey",
				"line-width": 0,
			},
		});
	}

	function addCorridorBoundaries() {
		if (!map) return;

		map.addSource("corridors", {
			type: "geojson",
			data: CORRIDOR_BOUNDARIES,
		});

		map.addLayer({
			id: "corridor-fill",
			type: "fill",
			source: "corridors",
			paint: {
				"fill-color": OAK_GREEN,
				"fill-opacity": 0.08,
			},
		});

		map.addLayer({
			id: "corridor-outline",
			type: "line",
			source: "corridors",
			paint: {
				"line-color": OAK_GREEN,
				"line-width": 1.5,
				"line-opacity": 0.7,
			},
		});

		// ── Click to select ───────────────────────────────────────────────
		map.on("click", "corridor-fill", (e) => {
			const feature = e.features?.[0];
			if (feature) selectedCorridorId = feature.properties.BID;
		});

		// ── Hover popup (desktop / fine-pointer only) ─────────────────────
		const supportsHover = window.matchMedia(
			"(hover: hover) and (pointer: fine)",
		).matches;

		if (supportsHover) {
			const hoverPopup = new maplibregl.Popup({
				closeButton: false,
				closeOnClick: false,
				offset: 12,
				className: "corridor-hover-popup",
			});

			map.on("mousemove", "corridor-fill", (e) => {
				map.getCanvas().style.cursor = "pointer";
				const f = e.features[0];
				hoverPopup
					.setLngLat(e.lngLat)
					.setHTML(`<span>${f.properties.BID}</span>`)
					.addTo(map);
			});
			map.on("mouseleave", "corridor-fill", () => {
				map.getCanvas().style.cursor = "";
				hoverPopup.remove();
			});
		} else {
			map.on("mouseenter", "corridor-fill", () => {
				map.getCanvas().style.cursor = "pointer";
			});
			map.on("mouseleave", "corridor-fill", () => {
				map.getCanvas().style.cursor = "";
			});
		}
	}

	function getCorridorCenter(feature) {
		let minX = Infinity;
		let minY = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;

		const visit = (coords) => {
			if (typeof coords[0] === "number") {
				const [x, y] = coords;
				if (x < minX) minX = x;
				if (x > maxX) maxX = x;
				if (y < minY) minY = y;
				if (y > maxY) maxY = y;
				return;
			}
			for (const c of coords) visit(c);
		};
		visit(feature.geometry.coordinates);

		return [(minX + maxX) / 2, (minY + maxY) / 2];
	}

	function addBartLayers() {
		if (!map) return;

		map.addSource("bart-lines", {
			type: "geojson",
			data: bartLines,
		});

		map.addLayer({
			id: "transit-rail",
			type: "line",
			source: "bart-lines",
			paint: {
				"line-color": OAK_GREEN,
				"line-width": 1.5,
				"line-opacity": 0.8,
				"line-dasharray": [2, 2],
			},
			layout: {
				visibility: "none",
			},
		});

		map.addSource("bart-stops", {
			type: "geojson",
			data: bartStops,
		});

		map.addLayer({
			id: "transit-rail-stops",
			type: "circle",
			source: "bart-stops",
			paint: {
				"circle-radius": 3,
				"circle-color": "#fff",
				"circle-stroke-width": 1,
				"circle-stroke-color": OAK_GREEN,
			},
			layout: {
				visibility: "none",
			},
		});
	}

	const FILL_OPACITY = 0.7;

	function addDemographyLayers() {
		if (!map) return;

		map.addSource("oakland-census", {
			type: "geojson",
			data: oaklandCensus,
			// Lets setFeatureState/removeFeatureState target block groups by id —
			// used by the Activity layers below to attach per-corridor data
			// without re-uploading the geometry. GEOID matches the field actually
			// present on OAK_BG.geo.json.
			promoteId: "GEOID",
		});

		const demographyGroup = LAYER_GROUPS.find((g) => g.id === "demography");

		for (const item of demographyGroup.items) {
			const fillColor = [
				"step",
				["get", item.key],
				item.colors[0],
				...item.breaks.flatMap((b, i) => [b, item.colors[i + 1]]),
			];

			map.addLayer({
				id: item.id,
				type: "fill",
				source: "oakland-census",
				paint: {
					"fill-color": [
						"case",
						["!=", ["get", item.key], null],
						fillColor,
						"#cbcbcb",
					],
					"fill-opacity": FILL_OPACITY,
				},
				layout: {
					visibility: "none",
				},
			});
		}

		// Thin block-group boundary, shown alongside whichever demography
		// fill layer is currently active.
		map.addLayer({
			id: "census-outline",
			type: "line",
			source: "oakland-census",
			paint: {
				"line-color": "darkgrey",
				"line-width": 0,
			},
			layout: {
				visibility: "none",
			},
		});
	}

	/* Commented out — this block depends on per-corridor activity data, which
	   isn't wired in yet. Re-enable once that data source exists.

	// Activity layers share the same census polygons as demography, but the
	// data behind them is per-corridor and fetched at runtime (see
	// applyActivityFeatureState), so it's attached via feature-state keyed by
	// block group id rather than baked into the GeoJSON's properties like
	// demography.
	function activityFillColor(item) {
		const stepColor = [
			"step",
			["feature-state", item.key],
			item.colors[0],
			...item.breaks.flatMap((b, i) => [b, item.colors[i + 1]]),
		];

		// No fetched value yet, or a genuine 0% share, both render as the
		// same neutral "no visitors from here" gray demography uses for
		// missing data.
		return [
			"case",
			[
				"any",
				["==", ["feature-state", item.key], null],
				["==", ["feature-state", item.key], 0],
			],
			"#cbcbcb",
			stepColor,
		];
	}

	function addActivityLayers() {
		if (!map) return;

		const activityGroup = LAYER_GROUPS.find((g) => g.id === "activity");
		for (const item of activityGroup.items) {
			map.addLayer({
				id: item.id,
				type: "fill",
				source: "oakland-census",
				paint: {
					"fill-color": activityFillColor(item),
					"fill-opacity": FILL_OPACITY,
				},
				layout: { visibility: "none" },
			});
		}
	}

	// Per-corridor home-origin activity, fetched lazily and cached by
	// corridor id. Files are pretty-printed JSON under
	// static/corridor_home_origin/ — small enough that there's no need to
	// prefetch every corridor up front.
	const activityDataCache = new Map();

	// The five feature-state keys used by the Activity group in
	// LayerConfig.js — kept in sync manually since the placeholder generator
	// below needs to know them ahead of any real per-corridor file existing.
	const ACTIVITY_KEYS = [
		"all",
		"evening",
		"nine-five",
		"weekdays",
		"weekends",
	];

	// Small string hash → deterministic 0-1 float. Not cryptographic, just
	// needs to be stable across reloads so a given corridor+block-group pair
	// always renders the same placeholder value instead of flickering.
	function seededRandom(seed) {
		let h = 0;
		for (let i = 0; i < seed.length; i++) {
			h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
		}
		h = Math.imul(h ^ (h >>> 15), h | 1);
		h ^= h + Math.imul(h ^ (h >>> 7), h | 61);
		return ((h ^ (h >>> 14)) >>> 0) / 4294967296;
	}

	// PLACEHOLDER DATA — remove once real corridor_home_origin/*.json files
	// are wired in. Generates a plausible-looking, corridor-specific spread
	// of activity values (skewed toward low percentages with a long tail,
	// roughly matching the shape the real quintile breaks in LayerConfig.js
	// assume) for every block group already loaded in oaklandCensus, so the
	// Activity layers render something meaningful in dev/demo without real
	// visitation data.
	function generatePlaceholderActivityData(corridorId) {
		const data = {};
		for (const feature of oaklandCensus.features) {
			const bgId =
				feature.properties?.GEOID ?? feature.id ?? feature.properties?.fid;
			if (bgId == null) continue;

			const values = {};
			for (const key of ACTIVITY_KEYS) {
				const r = seededRandom(`${corridorId}:${bgId}:${key}`);
				// ~15% chance of "no estimated visitors" (renders as gray),
				// otherwise an exponential-ish skew toward small shares with
				// occasional higher values, roughly on the same scale as the
				// real breaks (0 – ~1.0).
				values[key] = r < 0.15 ? 0 : Number((-Math.log(1 - r) * 0.25).toFixed(4));
			}
			data[bgId] = values;
		}
		return data;
	}

	async function loadCorridorActivityData(corridorId) {
		if (activityDataCache.has(corridorId))
			return activityDataCache.get(corridorId);

		let data = null;
		try {
			const response = await fetch(
				`corridor_home_origin/corridor_${corridorId}.json`,
			);
			if (response.ok) data = await response.json();
		} catch {
			data = null;
		}

		// Fall back to generated placeholder data so the layers aren't just
		// blank while real per-corridor files are still being produced.
		if (!data) data = generatePlaceholderActivityData(corridorId);

		activityDataCache.set(corridorId, data);
		return data;
	}

	// Clears any previously-set activity feature-state, then (if a corridor is
	// selected) fetches its data and re-attaches it per block group. Runs on
	// every corridor change regardless of whether an activity layer is
	// currently visible, so the data's already in place by the time someone
	// toggles one on.
	async function applyActivityFeatureState(corridorId) {
		if (!map || !map.getSource("oakland-census")) return;

		map.removeFeatureState({ source: "oakland-census" });
		if (!corridorId) return;

		const data = await loadCorridorActivityData(corridorId);
		if (!data) return;

		for (const [bgId, values] of Object.entries(data)) {
			map.setFeatureState({ source: "oakland-census", id: bgId }, values);
		}
	}
	*/

	// Neighborhood labels (../../data/OAK_neighborhood_labels.geo.json). Always
	// on as a base reference layer — no outline, just faint name labels that
	// appear once you're zoomed in close enough to read them.
	function addNeighbourhoods() {
		if (!map) return;

		map.addSource("neighbourhoods-labels", {
			type: "geojson",
			data: neighbourhoodLabels,
		});

		map.addLayer({
			id: "ref-neighbourhoods-label",
			type: "symbol",
			source: "neighbourhoods-labels",
			minzoom: 12.5,
			layout: {
				"text-field": ["get", "name"],
				"text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
				"text-size": 10.5,
				"text-anchor": "center",
				"text-transform": "uppercase",
				"symbol-placement": "point",
				visibility: "visible",
			},
			paint: {
				"text-color": "black",
				"text-halo-color": "#ffffff",
				"text-halo-width": 1,
				"text-halo-blur": 0,
				"text-opacity": 0.55,
			},
		});
	}

	// City Council District boundaries (../../data/OAK_council_districts.geo.json),
	// bound to the "City Council Districts" reference toggle. Same treatment
	// as neighborhoods — thin black outline, no fill/labels yet.
	function addCouncilDistricts() {
		if (!map) return;

		map.addSource("district-mask", {
			type: "geojson",
			data: districtMask,
		});

		map.addLayer({
			id: "ref-council-districts-mask",
			type: "fill",
			source: "district-mask",
			paint: {
				"fill-color": "#ffffff",
				"fill-opacity": 0.6,
			},
			layout: { visibility: "none" },
		});

		map.addSource("council-districts", {
			type: "geojson",
			data: councilDistricts,
		});

		map.addLayer({
			id: "ref-council-districts",
			type: "line",
			source: "council-districts",
			paint: {
				"line-color": "darkgrey",
				"line-width": 1.5,
				"line-opacity": 1,
			},
			layout: { visibility: "none" },
		});

		map.addSource("council-districts-labels", {
			type: "geojson",
			data: districtLabels,
		});

		map.addLayer({
			id: "ref-council-districts-label",
			type: "symbol",
			source: "council-districts-labels",
			minzoom: 10,
			layout: {
				"text-field": ["get", "number"],
				"text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
				"text-size": 16,
				"text-anchor": "center",
				"text-transform": "uppercase",
				"symbol-placement": "point",
				visibility: "none",
			},
			paint: {
				"text-color": "#636363",
				"text-halo-color": "#ffffff",
				"text-halo-width": 1,
				"text-halo-blur": 0,
				"text-opacity": 1,
			},
		});
	}

	/* Commented out — depends on bids / bidsLabels, which aren't imported yet.
	function addBids() {
		if (!map) return;

		map.addSource("bids", {
			type: "geojson",
			data: bids,
		});

		map.addLayer({
			id: "ref-bids-fill",
			type: "fill",
			source: "bids",
			filter: [
				"in",
				["geometry-type"],
				["literal", ["Polygon", "MultiPolygon"]],
			],
			paint: {
				"fill-color": OAK_ACCENT,
				"fill-opacity": 0.06,
			},
			layout: { visibility: "none" },
		});

		map.addLayer({
			id: "ref-bids",
			type: "line",
			source: "bids",
			filter: [
				"in",
				["geometry-type"],
				["literal", ["Polygon", "MultiPolygon", "LineString", "MultiLineString"]],
			],
			paint: {
				"line-color": OAK_ACCENT,
				"line-width": 1,
				"line-opacity": 1,
			},
			layout: { visibility: "none" },
		});

		map.addSource("bids-labels", {
			type: "geojson",
			data: bidsLabels,
		});

		map.addLayer({
			id: "ref-bids-label",
			type: "symbol",
			source: "bids-labels",
			layout: {
				// Placeholder assumes a "bid_name" property.
				"text-field": ["get", "bid_name"],
				"text-font": ["Open Sans Regular", "Arial Unicode MS Regular"],
				"text-size": 10,
				"text-anchor": "center",
				"text-transform": "uppercase",
				"symbol-placement": "point",
				"text-allow-overlap": false,
				"text-ignore-placement": false,
				visibility: "none",
			},
			paint: {
				"text-color": "#7a5f14",
				"text-halo-color": "#ffffff",
				"text-halo-width": 1,
				"text-halo-blur": 0,
				"text-opacity": 1,
			},
		});
	}
	*/

	function syncLayers() {
		if (!map || !mapLoaded) return;

		for (const group of LAYER_GROUPS) {
			for (const item of group.items) {
				const isVisible = group.exclusive
					? layerState[group.id]?.activeId === item.id
					: (layerState[group.id]?.[item.id] ?? false);

				const visibility = isVisible ? "visible" : "none";

				switch (item.id) {
					// DEMOGRAPHY
					case "pop-count":
					case "pop-density-sqmi":
					case "total-households":
					case "avg-household-size":
					case "median-age":
					case "median-household-income":
					case "per-capita-income":
					case "purchasing-power-index":
					case "purchasing-power-density":
					case "low-income-share":
					case "median-home-value":
					case "median-gross-rent":
					case "renter-share":
					case "total-housing-units":
					case "median-year-built":
					case "drive-alone-share":
					case "active-transit-share":
						if (map.getLayer(item.id)) {
							map.setLayoutProperty(
								item.id,
								"visibility",
								visibility,
							);
						}
						break;

					// ACTIVITY
					case "activity-all":
					case "activity-evenings":
					case "activity-daytime":
					case "activity-weekdays":
					case "activity-weekends":
						if (map.getLayer(item.id)) {
							map.setLayoutProperty(
								item.id,
								"visibility",
								visibility,
							);
						}
						break;

					// MOBILITY
					case "transit-rail":
						if (map.getLayer("transit-rail")) {
							map.setLayoutProperty(
								"transit-rail",
								"visibility",
								visibility,
							);
						}
						if (map.getLayer("transit-rail-stops")) {
							map.setLayoutProperty(
								"transit-rail-stops",
								"visibility",
								visibility,
							);
						}
						break;

					case "transit-busses":
						if (map.getLayer("transit-busses")) {
							map.setLayoutProperty(
								"transit-busses",
								"visibility",
								visibility,
							);
						}
						break;

					// REFERENCE
					case "ref-council-districts":
						if (map.getLayer("ref-council-districts")) {
							map.setLayoutProperty(
								"ref-council-districts",
								"visibility",
								visibility,
							);
							map.setLayoutProperty(
								"ref-council-districts-mask",
								"visibility",
								visibility,
							);
							map.setLayoutProperty(
								"ref-council-districts-label",
								"visibility",
								visibility,
							);
						}
						break;

					case "ref-bids":
						if (map.getLayer("ref-bids")) {
							map.setLayoutProperty(
								"ref-bids",
								"visibility",
								visibility,
							);
							map.setLayoutProperty(
								"ref-bids-fill",
								"visibility",
								visibility,
							);
							map.setLayoutProperty(
								"ref-bids-label",
								"visibility",
								visibility,
							);
						}
						break;
				}
			}
		}

		// Outline follows the demography group as a whole, not any single item.
		if (map.getLayer("census-outline")) {
			map.setLayoutProperty(
				"census-outline",
				"visibility",
				layerState.demography?.activeId ? "visible" : "none",
			);
		}
	}

	// Ease the map to the selected corridor's center
	$effect(() => {
		if (!selectedCorridorId || !mapLoaded) return;
		const feature = CORRIDOR_BOUNDARIES.features.find(
			(f) => f.properties.BID === selectedCorridorId,
		);
		if (feature) {
			map?.easeTo({
				center: getCorridorCenter(feature),
				zoom: 14,
				duration: 800,
			});
		}
	});

	// Outline/highlight the selected corridor's boundary.
	$effect(() => {
		if (!mapLoaded) return;
		const selected = selectedCorridorId ?? "";
		const colorExpr = [
			"case",
			["==", ["get", "BID"], selected],
			"#DC4633",
			OAK_GREEN,
		];

		if (map?.getLayer("corridor-fill")) {
			map.setPaintProperty("corridor-fill", "fill-color", colorExpr);
			map.setPaintProperty("corridor-fill", "fill-opacity", [
				"case",
				["==", ["get", "BID"], selected],
				0.2,
				0.08,
			]);
		}
		if (map?.getLayer("corridor-outline")) {
			map.setPaintProperty("corridor-outline", "line-color", colorExpr);
			map.setPaintProperty("corridor-outline", "line-width", [
				"case",
				["==", ["get", "BID"], selected],
				2.5,
				1.5,
			]);
		}
	});

	// Refreshes the Activity layers' feature-state whenever the selected
	// corridor changes, whether or not an activity layer is currently
	// visible — so the data's already in place if/when one gets toggled on.
	/* Commented out — calls applyActivityFeatureState, which is commented
	   out above along with the rest of the activity/demography block.
	$effect(() => {
		if (!mapLoaded) return;
		applyActivityFeatureState(selectedCorridorId);
	});
	*/

	$effect(() => {
		for (const group of LAYER_GROUPS) {
			if (group.exclusive) {
				void layerState[group.id]?.activeId;
			} else {
				for (const item of group.items) {
					void layerState[group.id]?.[item.id];
				}
			}
		}
		syncLayers();
	});
</script>

<div bind:this={mapContainer} class="map-container"></div>

<style>
	.map-container {
		width: 100%;
		height: 100%;
	}

	/*
		Push the attribution badge up so it clears the scale bar.
		Scale bar sits at bottom-right; attribution at bottom-left is fine as-is.
	*/
	:global(.maplibregl-ctrl-bottom-right) {
		bottom: 0;
		right: 0;
	}

	/* Corridor hover popup */
	:global(.corridor-hover-popup .maplibregl-popup-content) {
		padding: 5px 10px;
		background: rgba(44, 104, 61, 0.92);
		color: #fff;
		border-radius: 4px;
		font-family: OpenSans, sans-serif;
		font-size: 0.75rem;
		line-height: 1.3;
		max-width: 220px;
		white-space: normal;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
	}
	:global(.corridor-hover-popup .maplibregl-popup-tip) {
		border-top-color: rgba(44, 104, 61, 0.92);
	}
</style>