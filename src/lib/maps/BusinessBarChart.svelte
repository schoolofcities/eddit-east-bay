<script>
	// One donut chart for a business-composition dataset, with a legend
	// beside it. `categories` is a list of { label, value }, value in %.
	// Hovering a slice or a legend row highlights it and shows its value in
	// the middle of the donut.
	//
	// `groupBelow`: categories under this % are combined into one "Other"
	// slice (0 turns it off). Grouping only happens when at least two
	// categories qualify, so a single small category keeps its own name.
	//
	// `otherLabels`: category names that always go into "Other", whatever
	// their size (matched ignoring case and surrounding spaces). When any of
	// them are present, a lone small category joins them too.
	//
	// `sortByValue`: order slices largest to smallest (darkest to lightest).
	// "Other" always stays last. Off by default, keeping the data's order.
	let {
		title = "",
		categories = [],
		groupBelow = 0,
		otherLabels = [],
		sortByValue = false,
	} = $props();

	// Gradient endpoints: dark green for the first slice, light for the last.
	const DARK = [30, 74, 42]; // #1e4a2a (--oak-green-dark)
	const LIGHT = [196, 220, 202]; // #c4dcca

	// Donut geometry, in px.
	const SIZE = 120;
	const THICKNESS = 22;
	const RADIUS = (SIZE - THICKNESS) / 2;
	const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
	const GAP = 1.5; // white seam between slices

	let activeLabel = $state(null);

	function isMissing(value) {
		return value === null || value === undefined || Number.isNaN(value);
	}

	function formatShare(value) {
		if (isMissing(value)) return "—%";
		return `${value.toLocaleString(undefined, { maximumFractionDigits: 1 })}%`;
	}

	function colorAt(i, count) {
		const t = count <= 1 ? 0 : i / (count - 1);
		const [r, g, b] = DARK.map((d, k) => Math.round(d + (LIGHT[k] - d) * t));
		return `rgb(${r}, ${g}, ${b})`;
	}

	const segments = $derived.by(() => {
		let list = categories
			.filter((c) => !isMissing(c.value) && c.value > 0)
			.map((c) => ({ label: c.label, value: c.value }));

		// A category named "Other" in the data is always folded in as well.
		const named = new Set(
			["other", ...otherLabels].map((l) => l.trim().toLowerCase()),
		);
		const isNamed = (c) => named.has(c.label.trim().toLowerCase());

		const namedOther = list.filter(isNamed);
		const small =
			groupBelow > 0
				? list.filter((c) => !isNamed(c) && c.value < groupBelow)
				: [];
		const members = [
			...namedOther,
			...(small.length >= 2 || namedOther.length > 0 ? small : []),
		];

		// Everything in `members` becomes one "Other" slice, added at the end
		// after sorting so it always stays last.
		let other = null;
		if (members.length > 0) {
			list = list.filter((c) => !members.includes(c));
			other = {
				label: "Other",
				value: members.reduce((sum, c) => sum + c.value, 0),
			};
		}

		if (sortByValue) {
			list.sort((a, b) => b.value - a.value);
		}
		if (other) list.push(other);

		// Slice lengths are proportional to value, measured around the ring
		// clockwise from 12 o'clock.
		const total = list.reduce((sum, c) => sum + c.value, 0);
		const gap = list.length > 1 ? GAP : 0;
		let offset = 0;
		return list.map((c, i) => {
			const length = total > 0 ? (c.value / total) * CIRCUMFERENCE : 0;
			const drawn = Math.max(length - gap, 0.5);
			const segment = {
				...c,
				color: colorAt(i, list.length),
				dash: `${drawn} ${CIRCUMFERENCE - drawn}`,
				offset: -offset,
			};
			offset += length;
			return segment;
		});
	});

	const active = $derived(
		segments.find((s) => s.label === activeLabel) ?? null,
	);

	const summary = $derived(
		segments.map((s) => `${s.label} ${formatShare(s.value)}`).join(", "),
	);
</script>

<div class="donut-chart">
	{#if title}
		<p class="donut-title">{title}</p>
	{/if}

	{#if segments.length === 0}
		<p class="donut-empty">No data available.</p>
	{:else}
		<div class="donut-body">
			<div class="donut-figure" style={`width: ${SIZE}px; height: ${SIZE}px;`}>
				<svg
					width={SIZE}
					height={SIZE}
					viewBox={`0 0 ${SIZE} ${SIZE}`}
					role="img"
					aria-label={`${title}: ${summary}`}
				>
					<g transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}>
						{#each segments as segment (segment.label)}
							<!-- Hover only highlights; the legend carries the same information. -->
							<!-- svelte-ignore a11y_no_static_element_interactions -->
							<circle
								class="donut-slice"
								class:dimmed={active && active !== segment}
								cx={SIZE / 2}
								cy={SIZE / 2}
								r={RADIUS}
								fill="none"
								stroke={segment.color}
								stroke-width={THICKNESS}
								stroke-dasharray={segment.dash}
								stroke-dashoffset={segment.offset}
								onmouseenter={() => (activeLabel = segment.label)}
								onmouseleave={() => (activeLabel = null)}
							>
								<title>{segment.label}: {formatShare(segment.value)}</title>
							</circle>
						{/each}
					</g>
				</svg>

				{#if active}
					<div class="donut-center" aria-hidden="true">
						<span class="center-value">{formatShare(active.value)}</span>
						<span class="center-label">{active.label}</span>
					</div>
				{/if}
			</div>

			<ul class="donut-legend">
				{#each segments as segment (segment.label)}
					<li
						class="legend-item"
						class:dimmed={active && active !== segment}
						title={`${segment.label}: ${formatShare(segment.value)}`}
						onmouseenter={() => (activeLabel = segment.label)}
						onmouseleave={() => (activeLabel = null)}
					>
						<span class="legend-swatch" style={`background: ${segment.color};`}
						></span>
						<span class="legend-label">{segment.label}</span>
						<span class="legend-value">{formatShare(segment.value)}</span>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style>
	/* Colors inherit the --oak-* tokens from the parent panel, with fallbacks. */
	.donut-title {
		font-family: "Public Sans", sans-serif;
		font-size: 0.68rem;
		font-weight: bold;
		color: var(--brandGray60);
		margin: 0.9rem 0 0.5rem;
	}

	.donut-empty {
		font-size: 0.73rem;
		color: var(--brandGray60);
		line-height: 1.5;
		font-style: italic;
		margin: 0;
	}

	.donut-body {
		display: flex;
		align-items: center;
		gap: 14px;
	}

	.donut-figure {
		position: relative;
		flex-shrink: 0;
	}

	.donut-figure svg {
		display: block;
	}

	.donut-slice {
		transition: opacity 0.15s;
	}

	.donut-center {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 0 30px;
		text-align: center;
		pointer-events: none;
	}

	.center-value {
		font-family: "Public Sans", sans-serif;
		font-weight: 700;
		font-size: 0.9rem;
		color: var(--oak-green-dark, #1e4a2a);
		line-height: 1.1;
	}

	.center-label {
		font-size: 0.55rem;
		color: var(--brandGray60);
		line-height: 1.2;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.donut-legend {
		flex: 1;
		min-width: 0;
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 6px;
		min-width: 0;
		font-size: 0.68rem;
		line-height: 1.3;
		transition: opacity 0.15s;
	}

	.dimmed {
		opacity: 0.35;
	}

	.legend-swatch {
		flex-shrink: 0;
		width: 9px;
		height: 9px;
		border-radius: 2px;
	}

	.legend-label {
		flex: 1;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: var(--brandGray60);
	}

	.legend-value {
		font-family: "Public Sans", sans-serif;
		font-weight: 700;
		color: var(--oak-green-dark, #1e4a2a);
		white-space: nowrap;
	}
</style>