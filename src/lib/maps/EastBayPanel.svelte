<script>
	import { LAYER_GROUPS } from "./LayerConfig.js";

	let {
		selectedCorridorId = $bindable(null),
		layerState = $bindable({}),
		corridors = [],
	} = $props();

	const selectedCorridor = $derived(
		corridors.find((c) => c.id === selectedCorridorId) ?? null,
	);

	function setExclusive(groupId, itemId) {
		if (groupId === "activity" && !selectedCorridorId) return;
		const current = layerState[groupId]?.activeId ?? null;
		const next = current === itemId ? null : itemId;
		layerState[groupId].activeId = next;
		applyCrossGroupExclusion(groupId, next);
	}

	function setExclusiveFromSelect(groupId, value) {
		const next = value || null;
		layerState[groupId].activeId = next;
		applyCrossGroupExclusion(groupId, next);
	}

	// Demography and Activity are two fill layers drawn on the same map
	// surface — picking one clears the other so they never compete for the
	// same visual space. "except" is the layer that was just activated and
	// should be left alone.
	function clearOtherExclusiveLayers(except) {
		if (except !== "demography") layerState.demography.activeId = null;
		if (except !== "activity") layerState.activity.activeId = null;
	}

	function applyCrossGroupExclusion(groupId, next) {
		if (!next) return;
		if (groupId !== "demography" && groupId !== "activity") return;
		clearOtherExclusiveLayers(groupId);
	}

	function toggleNonExclusive(groupId, itemId) {
		layerState[groupId][itemId] = !layerState[groupId][itemId];
	}

	function isOn(group, item) {
		if (group.exclusive) {
			return layerState[group.id]?.activeId === item.id;
		}
		return layerState[group.id]?.[item.id] ?? false;
	}
</script>

{#snippet breaksLegend(item)}
	<svg class="legend" width="100%" height="40">
		{#each item.colors as color, i}
			<rect
				x={i * 20 + "%"}
				y="0"
				width="20%"
				height="20"
				fill={color}
				stroke="white"
				stroke-width="1"
				opacity="0.7"
			/>
		{/each}

		{#each item.breaks as value, i}
			<text
				class="legend-label"
				x={`${(i + 1) * 20}%`}
				y="35"
				text-anchor="middle"
			>
				{#if i === 0}
					&lt;{value.toLocaleString()}
				{:else if i === item.breaks.length - 1}
					&gt;{value.toLocaleString()}
				{:else}
					{value.toLocaleString()}
				{/if}
			</text>
		{/each}
	</svg>
{/snippet}

<aside class="panel">
	<!-- ── Header ─────────────────────────────────────────────────────── -->
	<header class="panel-header">
		<span class="header-org">School of Cities | City of Oakland</span>
		<h1 class="header-title">
			Equitable Development Data Insight Training (EDDIT)
		</h1>
		<p class="header-authors">Author One, Author Two &middot; 2026</p>
	</header>

	<!-- ── Corridor Selector ────────────────────────────────────────────── -->
	<section class="panel-section">
		<h2 class="section-heading">Business Corridor</h2>
		<p class="section-desc">
			Choose from the list or click a corridor on the map.
		</p>

		<div class="select-wrapper">
			<select
				class="corridor-select"
				value={selectedCorridorId ?? ""}
				onchange={(e) => {
					selectedCorridorId = e.currentTarget.value || null;
				}}
				aria-label="Select a corridor"
			>
				<option value="">— Select a corridor —</option>
				{#each corridors as corridor (corridor.id)}
					<option value={corridor.id}>{corridor.name}</option>
				{/each}
				{#if corridors.length === 0}
					<option value="" disabled>(Corridors not yet loaded)</option>
				{/if}
			</select>
			<svg class="select-arrow" viewBox="0 0 10 6" aria-hidden="true">
				<path d="M0 0l5 6 5-6z" />
			</svg>
		</div>
	</section>

	<div class="divider"></div>
	<!-- ── Corridor Description ──────────────────────────────────────────── -->
	<section class="panel-section">
		{#if selectedCorridor}
			<p class="cd-name">{selectedCorridor.name}</p>
			<p class="cd-address">
				{selectedCorridor.address}, Oakland, CA {selectedCorridor.postalCode}
			</p>
			<p class="cd-body">
				{selectedCorridor.description || "Corridor description coming soon."}
			</p>
		{:else}
			<p class="empty-state">
				Select a corridor above or click a marker on the map to view its
				description.
			</p>
		{/if}
	</section>

	<div class="divider"></div>
	<!-- ── Layer Toggles ─────────────────────────────────────────────── -->
	<section class="panel-section">
		<h2 class="section-heading">Map Layers</h2>

		{#each LAYER_GROUPS as group (group.id)}
			<div class="layer-group">
				<span class="layer-group-label">{group.label}</span>

				{#if group.ui === "dropdown"}
					<div class="select-wrapper">
						<select
							class="corridor-select layer-select"
							value={layerState[group.id]?.activeId ?? ""}
							onchange={(e) =>
								setExclusiveFromSelect(
									group.id,
									e.currentTarget.value,
								)}
							aria-label={`Select ${group.label} layer`}
						>
							<option value="">None</option>
							{#each group.items as item (item.id)}
								<option value={item.id}>{item.label}</option>
							{/each}
						</select>

						<svg
							class="select-arrow"
							viewBox="0 0 10 6"
							aria-hidden="true"
						>
							<path d="M0 0l5 6 5-6z" />
						</svg>
					</div>

					{#if group.id === "demography" && layerState.demography?.activeId}
						{@const selectedItem = group.items.find(
							(item) =>
								item.id === layerState.demography.activeId,
						)}

						{#if selectedItem}
							{@render breaksLegend(selectedItem)}
						{/if}
					{/if}
				{:else if group.ui === "radio-toggles"}
					<div class="activity-grid">
						{#each group.items as item (item.id)}
							<button
								type="button"
								class="activity-btn"
								class:active={isOn(group, item)}
								disabled={group.id === "activity" &&
									!selectedCorridorId}
								onclick={() => setExclusive(group.id, item.id)}
							>
								{item.label}
							</button>
						{/each}
					</div>

					{#if group.id === "activity"}
						{#if !selectedCorridorId}
							<p class="section-desc activity-hint">
								Select a corridor to view its home-origin
								activity layers.
							</p>
						{:else if layerState.activity?.activeId}
							{@const selectedActivityItem = group.items.find(
								(item) =>
									item.id === layerState.activity.activeId,
							)}
							{#if selectedActivityItem}
								{@render breaksLegend(selectedActivityItem)}
								<p class="section-desc legend-caption">
									% share of the corridor's estimated
									home-origin visitors, by census block
									group (quintiles). Gray areas had no
									estimated visitors.
								</p>
							{/if}
						{/if}
					{/if}
				{:else}
					{#each group.items as item (item.id)}
						<label class="layer-toggle">
							<span
								class="toggle-track"
								class:on={isOn(group, item)}
							>
								<input
									type="checkbox"
									checked={isOn(group, item)}
									onchange={() =>
										toggleNonExclusive(
											group.id,
											item.id,
										)}
									class="sr-only"
								/>
								<span class="toggle-thumb"></span>
							</span>
							<span class="layer-label">{item.label}</span>
						</label>
					{/each}
				{/if}
			</div>
		{/each}
	</section>

	<div class="divider"></div>

	<!-- ── Corridor Profile ─────────────────────────────────────────────── -->
	<section class="panel-section">
		<h2 class="section-heading">Corridor Profile</h2>

		{#if selectedCorridor}
			<p class="corridor-name">{selectedCorridor.name}</p>

			<div class="stat-grid">
				<div class="stat-card">
					<span class="stat-label">Monthly Foot Traffic</span>
					<span class="stat-value placeholder">—</span>
				</div>
				<div class="stat-card">
					<span class="stat-label">Catchment Radius</span>
					<span class="stat-value placeholder">—</span>
				</div>
				<div class="stat-card">
					<span class="stat-label">Equity Index</span>
					<span class="stat-value placeholder">—</span>
				</div>
				<div class="stat-card">
					<span class="stat-label">Transit Access</span>
					<span class="stat-value placeholder">—</span>
				</div>
			</div>
		{:else}
			<p class="empty-state">
				Select a corridor above or click on the map to view its
				activity and demographic profile.
			</p>
		{/if}
	</section>

	<div class="divider"></div>

	<!-- ── Compare ───────────────────────────────────────────────────── -->
	<section class="panel-section panel-section--grow">
		<h2 class="section-heading">Compare Corridors</h2>
		<p class="empty-state">
			Side-by-side comparison of multiple selected corridors will appear
			here.
		</p>
	</section>
</aside>

<style>
	/*
		Brand palette — main: rgb(44,104,61), accent (buttons): rgb(234,197,85),
		text: rgb(30,60,80). Main green anchors headings/headers/selection
		state; gold accent is reserved for active/selected buttons and toggles;
		the text color is the default body copy color throughout the panel.
	*/
	.panel {
		--oak-green: rgb(44, 104, 61);
		--oak-green-dark: #1e4a2a;
		--oak-green-tint: #eaf1ec;
		--oak-gold: rgb(234, 197, 85);
		--oak-gold-dark: #9c7c1f;
		--oak-text: rgb(30, 60, 80);

		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		background: #ffffff;
		color: var(--oak-text);
		font-family: "Public Sans", sans-serif;
		font-size: 0.8rem;
		overflow-y: auto;
		overflow-x: hidden;
		scrollbar-width: thin;
		scrollbar-color: var(--brandGray) transparent;
	}

	/* ── Header ─────────────────────────────────────────────────────────── */

	.panel-header {
		flex-shrink: 0;
		padding: 16px 16px 14px;
		background: var(--oak-green-dark);
		color: #fff;
		border-bottom: 3px solid var(--oak-gold);
	}

	.header-org {
		display: block;
		font-family: "Public Sans", sans-serif;
		font-weight: 600;
		font-size: 0.65rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--oak-gold);
		margin-bottom: 6px;
	}

	.header-title {
		font-family: "Public Sans", sans-serif;
		font-weight: 700;
		font-size: 1.05rem;
		line-height: 1.25;
		margin: 0 0 10px;
		color: #fff;
	}

	.header-authors {
		font-size: 0.7rem;
		color: rgba(255, 255, 255, 0.65);
		margin: 0;
		line-height: 1.4;
	}

	/* ── Sections ───────────────────────────────────────────────────────── */

	.divider {
		height: 1px;
		background: var(--brandGray);
		flex-shrink: 0;
	}

	.panel-section {
		padding: 14px 16px;
		flex-shrink: 0;
	}

	/* Let the last section expand to fill remaining height */
	.panel-section--grow {
		flex: 1;
	}

	.section-heading {
		font-family: "Public Sans", sans-serif;
		font-weight: 700;
		font-size: 0.68rem;
		text-transform: uppercase;
		letter-spacing: 0.07em;
		color: var(--oak-green-dark);
		margin: 0 0 8px;
	}

	.section-desc {
		font-size: 0.73rem;
		color: var(--brandGray60);
		margin: 0 0 10px;
		line-height: 1.45;
	}

	.empty-state {
		font-size: 0.73rem;
		color: var(--brandGray60);
		line-height: 1.5;
		font-style: italic;
		margin: 0;
	}

	/* ── Corridor Select ────────────────────────────────────────────────── */

	.select-wrapper {
		position: relative;
	}

	.layer-select {
		font-size: 0.75rem;
	}

	.corridor-select {
		width: 100%;
		padding: 7px 28px 7px 10px;
		font-family: "Public Sans", sans-serif;
		font-size: 0.78rem;
		border: 1px solid var(--brandGray);
		border-radius: 4px;
		background: #fff;
		color: var(--oak-text);
		appearance: none;
		-webkit-appearance: none;
		cursor: pointer;
		outline: none;
		transition:
			border-color 0.15s,
			box-shadow 0.15s;
		box-sizing: border-box;
	}

	.corridor-select:focus {
		border-color: var(--oak-green);
		box-shadow: 0 0 0 2px rgba(44, 104, 61, 0.18);
	}

	.select-arrow {
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
		width: 10px;
		height: 6px;
		fill: var(--oak-green-dark);
		pointer-events: none;
	}

	/* ── Layer Toggles ──────────────────────────────────────────────────── */

	.layer-group {
		margin-bottom: 10px;
	}

	.layer-group:last-child {
		margin-bottom: 0;
	}

	.layer-group-label {
		display: block;
		font-size: 0.65rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--brandGray60);
		margin-bottom: 5px;
	}

	.layer-toggle {
		display: flex;
		align-items: center;
		gap: 9px;
		padding: 4px 0;
		cursor: pointer;
		user-select: none;
	}

	/* Screen-reader only — visually hidden checkbox */
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	/* Toggle pill */
	.toggle-track {
		position: relative;
		display: inline-flex;
		align-items: center;
		width: 30px;
		height: 16px;
		border-radius: 8px;
		background: var(--brandGray);
		flex-shrink: 0;
		transition: background 0.2s;
		cursor: pointer;
	}

	.toggle-track.on {
		background: var(--oak-gold);
	}

	.toggle-thumb {
		position: absolute;
		left: 2px;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: #fff;
		transition: left 0.2s;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
	}

	.toggle-track.on .toggle-thumb {
		left: 16px;
	}

	.layer-label {
		font-size: 0.77rem;
		color: var(--oak-text);
		line-height: 1.3;
	}

	.activity-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	.activity-btn {
		border: 1px solid var(--brandGray);
		background: #fff;
		color: var(--brandGray70);
		padding: 5px 8px;
		font-size: 0.7rem;
		font-family: "Public Sans", sans-serif;
		border-radius: 999px;
		line-height: 1.2;
		cursor: pointer;
		transition: all 0.15s ease;
	}

	.activity-btn.active {
		background: var(--oak-gold);
		border-color: var(--oak-gold);
		color: var(--oak-green-dark);
	}

	.activity-btn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.activity-hint {
		margin: 6px 0 0;
	}

	.legend-caption {
		margin: 4px 0 0;
	}

	/* ── Corridor Description ──────────────────────────────────────────── */

	.cd-name {
		font-family: "Public Sans", sans-serif;
		font-weight: 700;
		font-size: 0.92rem;
		color: var(--oak-green-dark);
		margin: 0 0 4px;
		line-height: 1.25;
	}

	.cd-address {
		font-size: 0.72rem;
		color: var(--brandGray60);
		margin: 0 0 10px;
		line-height: 1.4;
	}

	.cd-body {
		font-size: 0.75rem;
		color: var(--oak-text);
		line-height: 1.55;
		margin: 0;
		opacity: 0.75;
	}

	/* ── Corridor Profile ──────────────────────────────────────────────── */

	.corridor-name {
		font-family: "Public Sans", sans-serif;
		font-weight: 700;
		font-size: 0.88rem;
		color: var(--oak-green-dark);
		margin: 0 0 10px;
	}

	.stat-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
	}

	.stat-card {
		background: var(--oak-green-tint);
		border-radius: 4px;
		padding: 10px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.stat-label {
		font-size: 0.65rem;
		color: var(--brandGray60);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		line-height: 1.3;
	}

	.stat-value {
		font-family: "Public Sans", sans-serif;
		font-weight: 700;
		font-size: 1rem;
		color: var(--oak-green-dark);
	}

	.stat-value.placeholder {
		color: var(--brandGray);
	}

	.legend {
		margin-top: 0.5rem;
		display: block;
	}

	.legend-label {
		font-size: 0.6rem;
		fill: var(--brandGray60);
		font-family: "Public Sans", sans-serif;
	}
</style>
