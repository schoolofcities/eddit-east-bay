<script>
	/**
	 * Small hand-rolled line chart (no chart library), built for series that are
	 * deliberately broken into separate pieces: one line per data provider,
	 * a shaded gap where there is no data, and an optional uncertainty band.
	 *
	 * Drawn at the real pixel width of its container (no stretching), with a
	 * hover/touch readout so values can be read off without clutter.
	 */
	let {
		series = [], // [{ id, label, color, values: (number|null)[] }]  -> null breaks the line
		xCount = 0, // number of x positions (every series' `values` has this length)
		xTicks = [], // [{ i, label }]
		gaps = [], // [{ from, to, label }]  inclusive x indices with no data (shaded)
		vlines = [], // [{ i, label }]  dotted vertical markers
		band = null, // { from, to, lo, hi }  shaded uncertainty band
		refLine = null, // { y, label }  dashed horizontal reference
		yFormat = (v) => String(v),
		yMin = 0,
		yMax = null,
		height = 130,
		readout = null, // (i) => string shown above the chart while hovering
		hint = "Hover or drag across the chart to read values",
		ariaLabel = "Line chart",
	} = $props();

	let width = $state(300);
	let hover = $state(null);

	const pad = { top: 12, right: 8, bottom: 20, left: 34 };
	const plotW = $derived(Math.max(10, width - pad.left - pad.right));
	const plotH = $derived(height - pad.top - pad.bottom);

	const dataMax = $derived.by(() => {
		let m = 0;
		for (const s of series) for (const v of s.values) if (v !== null && v > m) m = v;
		if (band && band.hi > m) m = band.hi;
		if (refLine && refLine.y > m) m = refLine.y;
		return m || 1;
	});
	// "Nice" axis: round tick values (0, 50, 100, 150 ...) and a top that is one of them.
	function niceStep(range, n = 3) {
		const raw = range / n;
		const mag = Math.pow(10, Math.floor(Math.log10(raw)));
		const f = raw / mag;
		return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10) * mag;
	}
	const scale = $derived.by(() => {
		const hi = yMax ?? dataMax * 1.04;
		const step = niceStep(hi - yMin);
		const niceTop = Math.ceil(hi / step - 1e-9) * step;
		const ticks = [];
		for (let v = yMin; v <= niceTop + 1e-9; v += step) ticks.push(v);
		return { top: niceTop, ticks };
	});
	const top = $derived(scale.top);

	function x(i) {
		return pad.left + (xCount <= 1 ? 0 : (i / (xCount - 1)) * plotW);
	}
	function y(v) {
		return pad.top + (1 - (v - yMin) / (top - yMin || 1)) * plotH;
	}

	// One path per contiguous run of non-null values.
	function paths(values) {
		const out = [];
		let cur = [];
		values.forEach((v, i) => {
			if (v === null || v === undefined) {
				if (cur.length) out.push(cur);
				cur = [];
			} else {
				cur.push([x(i), y(v)]);
			}
		});
		if (cur.length) out.push(cur);
		return out.map((pts) => pts.map((p, j) => `${j ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" "));
	}

	const yTickValues = $derived(scale.ticks);

	function onMove(e) {
		const rect = e.currentTarget.getBoundingClientRect();
		const rel = (e.clientX - rect.left - pad.left) / plotW;
		const i = Math.round(Math.min(1, Math.max(0, rel)) * (xCount - 1));
		hover = i;
	}

	const readoutText = $derived(hover === null || !readout ? hint : (readout(hover) ?? hint));
</script>

<div class="lc">
	<p class="readout" class:idle={hover === null}>{readoutText}</p>

	<div class="lc-box" bind:clientWidth={width}>
		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<svg
			{width}
			{height}
			role="img"
			aria-label={ariaLabel}
			onpointermove={onMove}
			onpointerdown={onMove}
			onpointerleave={() => (hover = null)}
		>
			<!-- shaded gaps (no data) -->
			{#each gaps as g (g.from)}
				{@const x0 = x(Math.max(0, g.from - 0.5))}
				{@const x1 = x(Math.min(xCount - 1, g.to + 0.5))}
				<rect x={x0} y={pad.top} width={x1 - x0} height={plotH} class="gap" />
				{#if x1 - x0 > 26}
					<text x={(x0 + x1) / 2} y={pad.top + 9} class="note" text-anchor="middle">{g.label ?? ""}</text>
				{/if}
			{/each}

			<!-- uncertainty band -->
			{#if band}
				<rect
					x={x(band.from)}
					y={y(band.hi)}
					width={x(band.to) - x(band.from)}
					height={Math.max(0, y(band.lo) - y(band.hi))}
					class="band"
				/>
			{/if}

			<!-- gridlines + y ticks -->
			{#each yTickValues as t (t)}
				<line x1={pad.left} x2={width - pad.right} y1={y(t)} y2={y(t)} class="grid" />
				<text x={pad.left - 4} y={y(t) + 3} class="tick" text-anchor="end">{yFormat(t)}</text>
			{/each}

			{#if refLine}
				<line x1={pad.left} x2={width - pad.right} y1={y(refLine.y)} y2={y(refLine.y)} class="ref" />
				{#if refLine.label}
					<text x={width - pad.right} y={y(refLine.y) - 3} class="note" text-anchor="end">{refLine.label}</text>
				{/if}
			{/if}

			<!-- vertical markers -->
			{#each vlines as v (v.i)}
				<line x1={x(v.i)} x2={x(v.i)} y1={pad.top} y2={pad.top + plotH} class="vline" />
				{#if v.label}
					<text x={x(v.i) + 3} y={pad.top + 9} class="note">{v.label}</text>
				{/if}
			{/each}

			<!-- x axis -->
			<line x1={pad.left} x2={width - pad.right} y1={pad.top + plotH} y2={pad.top + plotH} class="axis" />
			{#each xTicks as t (t.i)}
				<text x={x(t.i)} y={height - 6} class="tick" text-anchor="middle">{t.label}</text>
			{/each}

			<!-- series -->
			{#each series as s (s.id)}
				{#each paths(s.values) as d, k (k)}
					<path {d} stroke={s.color} class="line" />
				{/each}
			{/each}

			<!-- hover crosshair -->
			{#if hover !== null}
				<line x1={x(hover)} x2={x(hover)} y1={pad.top} y2={pad.top + plotH} class="cross" />
				{#each series as s (s.id)}
					{#if s.values[hover] !== null && s.values[hover] !== undefined}
						<circle cx={x(hover)} cy={y(s.values[hover])} r="3.2" fill={s.color} class="dot" />
					{/if}
				{/each}
			{/if}
		</svg>
	</div>
</div>

<style>
	.lc {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.readout {
		margin: 0;
		min-height: 1.3em;
		font-size: 0.68rem;
		line-height: 1.3;
		font-weight: 600;
		color: var(--oak-green-dark, #1e4a2a);
	}
	.readout.idle {
		font-weight: 400;
		color: var(--brandGray60, #777);
	}

	.lc-box {
		width: 100%;
		touch-action: pan-y; /* horizontal drag scrubs the chart, vertical still scrolls the panel */
	}

	svg {
		display: block;
		overflow: visible;
	}

	.grid {
		stroke: #e6e6e6;
		stroke-width: 0.7;
	}
	.axis {
		stroke: #bdbdbd;
		stroke-width: 0.8;
	}
	.tick {
		font-family: "Public Sans", sans-serif;
		font-size: 9px;
		fill: var(--oak-text, rgb(30, 60, 80));
	}
	.note {
		font-family: "Public Sans", sans-serif;
		font-size: 8.5px;
		fill: #8a8f94;
	}
	.line {
		fill: none;
		stroke-width: 1.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.gap {
		fill: #f1f1ee;
	}
	.band {
		fill: #8a8f94;
		opacity: 0.18;
	}
	.ref {
		stroke: #8a8f94;
		stroke-width: 0.8;
		stroke-dasharray: 3 3;
	}
	.vline {
		stroke: #b5b5b5;
		stroke-width: 0.8;
		stroke-dasharray: 1.5 3;
	}
	.cross {
		stroke: #9c7c1f;
		stroke-width: 1;
	}
	.dot {
		stroke: #fff;
		stroke-width: 1.2;
	}
</style>
