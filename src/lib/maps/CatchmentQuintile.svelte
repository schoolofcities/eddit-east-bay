<script>
	// One catchment-profile row: the field's label and value, followed by
	// five dots showing which quintile of all catchment areas the value
	// falls in (lowest on the left, highest on the right). The dots sit at
	// the row's right edge, so across rows they line up as a column.
	let {
		label = "",
		value = null,
		breaks = null, // [p20, p40, p60, p80] across all catchment areas
		format = (v) => String(v),
	} = $props();

	const STEPS = 5;
	// What each quintile is called in the hover tooltip.
	const NAMES = [
		"Bottom 20%",
		"Bottom 40%",
		"Middle 20%",
		"Top 40%",
		"Top 20%",
	];

	function isMissing(v) {
		return v === null || v === undefined || Number.isNaN(v);
	}

	// 0–4, or null when there's nothing to compare against.
	const quintile = $derived.by(() => {
		if (isMissing(value) || !breaks) return null;
		const v = Number(value);
		const i = breaks.findIndex((b) => v <= b);
		return i === -1 ? STEPS - 1 : i;
	});

	const description = $derived(
		quintile === null
			? ""
			: `${NAMES[quintile]}`,
	);
</script>

<div class="quintile-row">
	<span class="quintile-label">{label}</span>
	<span class="quintile-end">
		<span class="quintile-value">{format(value)}</span>
		{#if quintile === null}
			<span class="quintile-meter"></span>
		{:else}
			<!-- Focusable so keyboard users get the same tooltip as hover. -->
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<span
				class="quintile-meter"
				role="img"
				aria-label={description}
				tabindex="0"
			>
				{#each NAMES as _, i}
					<span class="quintile-dot" class:on={i === quintile}></span>
				{/each}
				<span class="quintile-tooltip" aria-hidden="true">{description}</span>
			</span>
		{/if}
	</span>
</div>

<style>
	/* Colors inherit the --oak-* tokens from the parent panel, with fallbacks. */
	.quintile-row {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 10px;
		padding: 6px 0;
		border-bottom: 1px solid var(--oak-green-tint, #eaf1ec);
		font-size: 0.73rem;
		line-height: 1.35;
	}

	.quintile-row:last-child {
		border-bottom: none;
	}

	.quintile-label {
		color: var(--brandGray60);
	}

	.quintile-end {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		flex-shrink: 0;
	}

	/* Fixed width, even when empty, so values in every row end at the same
	   point and the dots form a column. */
	.quintile-meter {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 3px;
		width: calc(5 * 7px + 4 * 3px);
		outline: none;
		cursor: default;
	}

	.quintile-meter:focus-visible {
		outline: 2px solid var(--oak-green, rgb(44, 104, 61));
		outline-offset: 3px;
		border-radius: 4px;
	}

	/* Right-aligned to the dots, since they sit at the panel's right edge. */
	.quintile-tooltip {
		position: absolute;
		right: -4px;
		bottom: calc(100% + 6px);
		z-index: 1;
		padding: 4px 7px;
		border-radius: 3px;
		background: var(--oak-green-dark, #1e4a2a);
		color: #fff;
		font-size: 0.65rem;
		line-height: 1.2;
		white-space: nowrap;
		pointer-events: none;
		opacity: 0;
		transform: translateY(2px);
		transition:
			opacity 0.12s,
			transform 0.12s;
	}

	.quintile-meter:hover .quintile-tooltip,
	.quintile-meter:focus-visible .quintile-tooltip {
		opacity: 1;
		transform: translateY(0);
	}

	@media (prefers-reduced-motion: reduce) {
		.quintile-tooltip {
			transition: none;
		}
	}

	.quintile-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--oak-green-tint, #eaf1ec);
	}

	.quintile-dot.on {
		background: var(--oak-green-dark, #1e4a2a);
	}

	.quintile-value {
		font-family: "Public Sans", sans-serif;
		font-weight: 700;
		color: var(--oak-green-dark, #1e4a2a);
		white-space: nowrap;
	}
</style>