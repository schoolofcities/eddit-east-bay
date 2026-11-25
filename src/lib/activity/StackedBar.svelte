<script>
	/**
	 * One or more horizontal 100% stacked bars (weekday/weekend, daytime/evening,
	 * travel distance). With several rows, each is one data period, so the two
	 * data providers sit side by side and are never blended into one number.
	 *
	 * A row can carry a marker: where the *typical corridor* (median of all 21,
	 * measured within the same provider) falls along the bar.
	 */
	let {
		rows = [], // [{ label, segments: [{ label, value, color }], marker: { pos, label } | null }]
		refLine = null, // { pos, label }  e.g. 5/7 days
		showLegend = true,
		barHeight = 20,
	} = $props();

	const legendSegments = $derived(rows[0]?.segments ?? []);
	const multi = $derived(rows.length > 1);

	const total = (segs) => segs.reduce((s, x) => s + (x.value ?? 0), 0) || 1;
	const pct = (v, segs) => ((v ?? 0) / total(segs)) * 100;
</script>

<div class="sb">
	{#each rows as row (row.label)}
		<div class="row">
			{#if multi || row.label}
				<span class="row-label">{row.label}</span>
			{/if}
			<div class="bar-wrap">
				<div class="bar" style={`height:${barHeight}px`}>
					{#each row.segments as seg, i (i)}
						{#if seg.value > 0}
							<div
								class="seg"
								style={`width:${pct(seg.value, row.segments)}%; background:${seg.color}`}
								title={`${seg.label}: ${seg.value.toFixed(1)}%`}
							>
								{#if pct(seg.value, row.segments) >= 13}
									<span class="seg-val" class:dark={seg.dark}>{seg.value.toFixed(0)}%</span>
								{/if}
							</div>
						{/if}
					{/each}

					{#if refLine}
						<div class="ref" style={`left:${refLine.pos}%`} title={refLine.label}></div>
					{/if}
				</div>
				{#if row.marker}
					<div class="marker" style={`left:${row.marker.pos}%`} title={row.marker.label}>
						<span class="tri"></span>
					</div>
				{/if}
			</div>
		</div>
	{/each}

	{#if showLegend}
		<div class="legend">
			{#each legendSegments as seg, i (i)}
				<span class="lg"><span class="sw" style={`background:${seg.color}`}></span>{seg.label}</span>
			{/each}
			{#if refLine}
				<span class="lg"><span class="sw ref-sw"></span>{refLine.label}</span>
			{/if}
			{#if rows.some((r) => r.marker)}
				<span class="lg"><span class="tri small"></span>Typical corridor</span>
			{/if}
		</div>
	{/if}
</div>

<style>
	.sb {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.row {
		display: flex;
		align-items: flex-start;
		gap: 8px;
	}

	.row-label {
		flex: 0 0 48px;
		padding-top: 3px;
		font-size: 0.65rem;
		color: var(--brandGray60, #777);
		line-height: 1.2;
	}

	.bar-wrap {
		position: relative;
		flex: 1;
		min-width: 0;
		padding-bottom: 9px; /* room for the typical-corridor marker */
	}

	.bar {
		position: relative;
		display: flex;
		width: 100%;
		background: #ececec;
		box-sizing: border-box;
	}

	.seg {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		border-right: 2px solid #fff;
		box-sizing: border-box;
		min-width: 0;
	}
	.seg:last-child {
		border-right: none;
	}

	.seg-val {
		font-size: 0.62rem;
		font-weight: 700;
		color: #fff;
		white-space: nowrap;
	}
	.seg-val.dark {
		color: var(--oak-green-dark, #1e4a2a);
	}

	.ref {
		position: absolute;
		top: -4px;
		bottom: -4px;
		width: 0;
		border-left: 1.5px dashed rgba(30, 60, 80, 0.7);
		pointer-events: none;
	}

	.marker {
		position: absolute;
		bottom: 0;
		width: 0;
	}
	.tri {
		position: absolute;
		left: -4px;
		bottom: 0;
		width: 0;
		height: 0;
		border-left: 4px solid transparent;
		border-right: 4px solid transparent;
		border-bottom: 6px solid var(--oak-text, rgb(30, 60, 80));
	}
	.tri.small {
		position: static;
		display: inline-block;
		margin-right: 4px;
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 12px;
		margin-left: 0;
	}
	.lg {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 0.66rem;
		color: var(--oak-text, rgb(30, 60, 80));
	}
	.sw {
		width: 8px;
		height: 8px;
		border-radius: 2px;
		flex-shrink: 0;
	}
	.ref-sw {
		background: none;
		border-left: 1.5px dashed rgba(30, 60, 80, 0.7);
		border-radius: 0;
		width: 0;
		height: 10px;
	}
</style>
