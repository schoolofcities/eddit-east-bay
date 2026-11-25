<script>
	/**
	 * Share of a corridor's visitors living in each of Oakland's seven council
	 * districts. The corridor's own district is highlighted. With two datasets
	 * (one per data period) each district shows a pair of thin bars.
	 */
	let {
		datasets = [], // [{ id, label, color, values: number[7] }]  % of all visitors
		districts = [1, 2, 3, 4, 5, 6, 7],
		ownDistrict = null,
	} = $props();

	const maxVal = $derived(
		Math.max(5, ...datasets.flatMap((d) => d.values.map((v) => v ?? 0))) * 1.08,
	);
</script>

<div class="db">
	{#each districts as d, i (d)}
		<div class="row" class:own={d === ownDistrict}>
			<span class="label">D{d}</span>
			<div class="bars">
				{#each datasets as ds (ds.id)}
					<div class="track">
						<div
							class="fill"
							style={`width:${((ds.values[i] ?? 0) / maxVal) * 100}%; background:${d === ownDistrict ? "var(--oak-gold, #EAC555)" : ds.color}`}
						></div>
						<span class="val">{(ds.values[i] ?? 0).toFixed(0)}%</span>
					</div>
				{/each}
			</div>
		</div>
	{/each}

	{#if datasets.length > 1}
		<div class="legend">
			{#each datasets as ds (ds.id)}
				<span class="lg"><span class="sw" style={`background:${ds.color}`}></span>{ds.label}</span>
			{/each}
		</div>
	{/if}
</div>

<style>
	.db {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}

	.row {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.label {
		flex: 0 0 22px;
		font-size: 0.66rem;
		font-weight: 600;
		color: var(--oak-text, rgb(30, 60, 80));
	}
	.own .label {
		color: var(--oak-green-dark, #1e4a2a);
	}

	.bars {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 1px;
		min-width: 0;
	}

	.track {
		position: relative;
		display: flex;
		align-items: center;
		height: 9px;
	}

	.fill {
		height: 100%;
		border-radius: 0 2px 2px 0;
		min-width: 1px;
	}

	.val {
		margin-left: 5px;
		font-size: 0.6rem;
		color: var(--oak-text, rgb(30, 60, 80));
		line-height: 1;
	}

	.legend {
		display: flex;
		gap: 12px;
		margin-top: 3px;
		padding-left: 30px;
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
	}
</style>
