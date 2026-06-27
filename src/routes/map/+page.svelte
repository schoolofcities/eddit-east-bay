<script>
    import "../../assets/global-styles.css";

    import EastBayMap from "$lib/maps/EastBayMap.svelte";
    import EastBayPanel from "$lib/maps/EastBayPanel.svelte";

    import { makeInitialLayerState } from "$lib/maps/LayerConfig.js";
    // import corridorPolygons from '$data/corridor-polygons.geo.json';

    let map = $state(null);
    // let selectedCorridorID = $state(null);
    let layerState = $state(makeInitialLayerState());

    // const corridors = corridorPolygons.features
    //     .map((f) => ({
    //         id: String(f.properties.fid),
    //         name: f.properties.corridor_name,
    //     }))
    //     .sort((a, b) => a.name.localeCompare(b.name));
</script>

<svelte:head>
    <title>East Bay Business Corridor Map</title>
    <meta
        name="description"
        content="East Bay business corridors project description."
    />
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1, minimum-scale=1"
    />
</svelte:head>

<div class="layout">
    <!-- <div class="panel-wrap">
        <EastBayPanel 
            bind:selectedCorridorID 
            bind:layerState 
            {corridors} 
        />
    </div> -->

    <!-- <div class="map-wrap">
        <EastBayMap 
            bind:map 
            bind:selectedCorridorID 
            {layerState} 
            />
    </div> -->

    <div class="panel-wrap">
        <EastBayPanel bind:layerState />
    </div>

    <div class="map-wrap">
        <EastBayMap {layerState} />
    </div>
</div>

<style>
    /* Reset: prevent the global body styles from adding scroll or min-width */
    :global(html, body) {
        margin: 0;
        padding: 0;
        overflow: hidden;
        width: 100%;
        height: 100%;
    }

    /* ── Layout ──────────────────────────────────────────────────────────── */

    .layout {
        display: flex;
        flex-direction: row;
        width: 100vw;
        height: 100dvh;
        overflow: hidden;
    }

    .panel-wrap {
        width: 400px;
        height: 100%;
        flex-shrink: 0;
        border-right: 1px solid var(--brandGray);
        overflow: hidden;
        z-index: 10;
    }

    /* Map: fills remaining space */
    .map-wrap {
        flex: 1;
        height: 100%;
        position: relative;
        min-width: 0; /* prevent flex blowout */
    }

    /* ── Mobile: stack vertically ────────────────────────────────────────── */
    /*
		Map takes the top 55%, panel the bottom 45%.
		Flip the visual order so the map is always at top of screen.
	*/
    @media (max-width: 768px) {
        .layout {
            flex-direction: column;
        }

        .panel-wrap {
            width: 100vw;
            height: 45dvh;
            border-right: none;
            border-top: 1px solid var(--brandGray);
            order: 2;
        }

        .map-wrap {
            width: 100vw;
            height: 55dvh;
            order: 1;
        }
    }
</style>
