<script>
    import { onMount } from "svelte";
    import maplibregl from "maplibre-gl";
    import "maplibre-gl/dist/maplibre-gl.css";
    // import { LAYER_GROUPS } from "./LayerConfig.js";
    // import eastBayBoundary from "$data/east-bay-boundary.geo.json";
    // import corridorCentroids from "$data/corridor-centroids.geo.json";
    // import corridorPolygons from "$data/corridor-polygons.geo.json";
    // import eastBayCensus from "$data/east-bay-census.geo.json";

    // let {
    //     map = $bindable(null),
    //     selectedCorridorId = $bindable(null),
    //     layerState = {},
    // } = $props();

    let map;

    const MAP_STYLE = "https://tiles.openfreemap.org/styles/positron";

    const MAP_CENTER = [-122.28579885398307, 37.80632466850597];
    const MAP_ZOOM = 9;
    const MAP_MIN_ZOOM = 8.5;
    const MAP_MAX_ZOOM = 16;
    const MAP_MAX_BOUNDS = [
    [-122.75496584469279, 37.34531008841303],
    [-121.53979554723468, 38.25389877017857], 
    ];

    let mapContainer;
    // let mapLoaded = $state(false);

    onMount(() => {
        map = new maplibregl.Map({
            container: mapContainer,
            style: MAP_STYLE,
            center: MAP_CENTER,
            zoom: MAP_ZOOM,
            minZoom: MAP_MIN_ZOOM,
            maxZoom: MAP_MAX_ZOOM,
            maxBounds: MAP_MAX_BOUNDS,
            dragRotate: false,
            touchPitch: false,
            attributionControl: false,
        });

        map.addControl(
            new maplibregl.NavigationControl({ showCompass: false }),
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

        // map.on("load", () => {
        //     mapLoaded = true;
        //     addDemographyLayers();
        //     addEastBayBoundary();
        //     addCorridorMarkers();
        //     syncLayers();
        // });

        const resizeObserver = new ResizeObserver(() => map?.resize());
        resizeObserver.observe(mapContainer);

        return () => {
            resizeObserver.disconnect();
            map?.remove();
        };
    });

    // function addEastBayBoundary() {
    //     if (!map) return;

    //     map.addSource("east-bay-boundary", {
    //         type: "geojson",
    //         data: eastBayBoundary,
    //     });

    //     map.addLayer({
    //         id: "east-bay-border",
    //         type: "line",
    //         source: "east-bay-boundary",
    //         paint: {
    //             "line-color": "#1E3765",
    //             "line-width": 2.5,
    //             "line-opacity": 0.85,
    //         },
    //     });
    // }

    // function addCorridorMarkers() {
    //     if (!map) return;

    //     // ── Sources ────────────────────────────────────────────────────────
    //     map.addSource("corridor-centroids", {
    //         type: "geojson",
    //         data: corridorCentroids,
    //         promoteId: "fid",
    //     });

    //     map.addSource("corridor-boundaries", {
    //         type: "geojson",
    //         data: corridorPolygons,
    //         promoteId: "fid",
    //     });

    //     // ── Boundary layers (visible at zoom ≥ 15) ──────────────────────────
    //     map.addLayer({
    //         id: "corridor-fill",
    //         type: "fill",
    //         source: "corridor-boundaries",
    //         minzoom: 15,
    //         paint: {
    //             "fill-color": "#1E3765",
    //             "fill-opacity": 0.08,
    //         },
    //     });

    //     map.addLayer({
    //         id: "corridor-outline",
    //         type: "line",
    //         source: "corridor-boundaries",
    //         minzoom: 15,
    //         paint: {
    //             "line-color": "#1E3765",
    //             "line-width": 1.5,
    //             "line-opacity": 0.7,
    //         },
    //     });

    //     // ── Centroid dot layers (always visible) ──────────────────────────
    //     map.addLayer({
    //         id: "corridor-halo",
    //         type: "circle",
    //         source: "corridor-centroids",
    //         maxzoom: 15,
    //         paint: {
    //             "circle-radius": [
    //                 "interpolate",
    //                 ["linear"],
    //                 ["zoom"],
    //                 10,
    //                 8,
    //                 15,
    //                 14,
    //             ],
    //             "circle-color": "#ffffff",
    //             "circle-opacity": 0.9,
    //             "circle-stroke-width": 0,
    //         },
    //     });

    //     map.addLayer({
    //         id: "corridor-circle",
    //         type: "circle",
    //         source: "corridor-centroids",
    //         maxzoom: 15,
    //         paint: {
    //             "circle-radius": [
    //                 "interpolate",
    //                 ["linear"],
    //                 ["zoom"],
    //                 10,
    //                 5,
    //                 15,
    //                 10,
    //             ],
    //             "circle-color": "#1E3765",
    //             "circle-stroke-width": 1.5,
    //             "circle-stroke-color": "#ffffff",
    //         },
    //     });

    //     // ── Click handlers ────────────────────────────────────────────────
    //     const handleVenueClick = (e) => {
    //         const feature = e.features?.[0];
    //         if (feature) selectedCorridorId = feature.properties.id;
    //     };
    //     map.on("click", "corridor-circle", handleVenueClick);
    //     map.on("click", "corridor-fill", handleVenueClick);

    //     // ── Hover popup (desktop / fine-pointer only) ─────────────────────
    //     const supportsHover = window.matchMedia(
    //         "(hover: hover) and (pointer: fine)",
    //     ).matches;

    //     if (supportsHover) {
    //         const hoverPopup = new maplibregl.Popup({
    //             closeButton: false,
    //             closeOnClick: false,
    //             offset: 12,
    //             className: "corridor-hover-popup",
    //         });

    //         map.on("mouseenter", "corridor-circle", (e) => {
    //             map.getCanvas().style.cursor = "pointer";
    //             const f = e.features[0];
    //             hoverPopup
    //                 .setLngLat(f.geometry.coordinates)
    //                 .setHTML(`<span>${f.properties.name}</span>`)
    //                 .addTo(map);
    //         });
    //         map.on("mouseleave", "corridor-circle", () => {
    //             map.getCanvas().style.cursor = "";
    //             hoverPopup.remove();
    //         });
    //     } else {
    //         map.on("mouseenter", "corridor-circle", () => {
    //             map.getCanvas().style.cursor = "pointer";
    //         });
    //         map.on("mouseleave", "corridor-circle", () => {
    //             map.getCanvas().style.cursor = "";
    //         });
    //     }

    //     map.on("mouseenter", "corridor-fill", () => {
    //         map.getCanvas().style.cursor = "pointer";
    //     });
    //     map.on("mouseleave", "corridor-fill", () => {
    //         map.getCanvas().style.cursor = "";
    //     });
    // }

    // function addDemographyLayers() {
    //     if (!map) return;

    //     map.addSource("east-bay-census", {
    //         type: "geojson",
    //         data: eastBayCensus,
    //     });

    //     const demographyGroup = LAYER_GROUPS[0];

    //     for (const item of demographyGroup.items) {
    //         const fillColor = [
    //             "step",
    //             ["get", item.key],
    //             item.colors[0],
    //             ...item.breaks.flatMap((b, i) => [b, item.colors[i + 1]]),
    //         ];

    //         map.addLayer({
    //             id: item.id,
    //             type: "fill",
    //             source: "east-bay-census",
    //             paint: {
    //                 "fill-color": [
    //                     "case",
    //                     ["!=", ["get", item.key], null],
    //                     fillColor,
    //                     "#cbcbcb",
    //                 ],
    //                 "fill-opacity": 0.7,
    //             },
    //             layout: {
    //                 visibility: "none",
    //             },
    //         });
    //     }
    // }

    // function syncLayers() {
    //     if (!map || !mapLoaded) return;

    //     for (const group of LAYER_GROUPS) {
    //         for (const item of group.items) {
    //             const isVisible = group.exclusive
    //                 ? layerState[group.id]?.activeId === item.id
    //                 : (layerState[group.id]?.[item.id] ?? false);

    //             // Always set visibility for known layers
    //             const visibility = isVisible ? "visible" : "none";

    //             // Placeholder census variables
    //             switch (item.id) {
    //                 case "pop":
    //                 case "age":
    //                 case "income":
    //                 case "education":
    //                 case "citizenship":
    //                     if (map.getLayer(item.id)) {
    //                         map.setLayoutProperty(
    //                             item.id,
    //                             "visibility",
    //                             visibility,
    //                         );
    //                     }
    //                     break;
    //             }
    //         }
    //     }
    // }

    // $effect(() => {
    //     if (!selectedCorridorId || !mapLoaded) return;
    //     const feature = corridorCentroids.features.find(
    //         (f) => f.properties.id === selectedCorridorId,
    //     );
    //     if (feature) {
    //         map?.flyTo({
    //             center: feature.geometry.coordinates,
    //             zoom: 14,
    //             duration: 800,
    //         });
    //     }
    // });

    // $effect(() => {
    //     if (!mapLoaded) return;
    //     const selected = selectedCorridorId ?? "";
    //     const colorExpr = [
    //         "case",
    //         ["==", ["get", "id"], selected],
    //         "#DC4633",
    //         "#1E3765",
    //     ];

    //     if (map?.getLayer("corridor-circle")) {
    //         map.setPaintProperty("corridor-circle", "circle-color", colorExpr);
    //     }
    //     if (map?.getLayer("corridor-fill")) {
    //         map.setPaintProperty("corridor-fill", "fill-color", colorExpr);
    //         map.setPaintProperty("corridor-fill", "fill-opacity", [
    //             "case",
    //             ["==", ["get", "id"], selected],
    //             0.2,
    //             0.08,
    //         ]);
    //     }
    //     if (map?.getLayer("corridor-outline")) {
    //         map.setPaintProperty("corridor-outline", "line-color", colorExpr);
    //         map.setPaintProperty("corridor-outline", "line-width", [
    //             "case",
    //             ["==", ["get", "id"], selected],
    //             2.5,
    //             1.5,
    //         ]);
    //     }
    // });

    // $effect(() => {
    //     for (const group of LAYER_GROUPS) {
    //         if (group.exclusive) {
    //             void layerState[group.id]?.activeId;
    //         } else {
    //             for (const item of group.items) {
    //                 void layerState[group.id]?.[item.id];
    //             }
    //         }
    //     }
    //     syncLayers();
    // });
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

    /* Venue hover popup */
    :global(.corridor-hover-popup .maplibregl-popup-content) {
        padding: 5px 10px;
        background: rgba(30, 55, 101, 0.92);
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
        border-top-color: rgba(30, 55, 101, 0.92);
    }
</style>
