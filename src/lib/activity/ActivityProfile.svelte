<script>
	import LineChart from "./LineChart.svelte";
	import StackedBar from "./StackedBar.svelte";
	import DistrictBars from "./DistrictBars.svelte";
	import {
		loadMeta,
		loadCorridorMetrics,
		getActivityEntry,
		COLORS,
		SEGMENT_LABEL,
		DISTANCE_BUCKET_LABELS,
		bucketBands,
		formatMonth,
		formatHalfYear,
		fmtInt,
		meanOf,
	} from "./activityData.js";

	let {
		selectedCorridorId = null, // the corridor's name as drawn on the map
		period = "all", // all | evening | nine-five | weekdays | weekends (follows the Activity layer)
		windowId = "S3", // S3 | S1 | both (the time-period switch in the panel)
	} = $props();

	const PERIOD_LABEL = {
		all: "all visits",
		evening: "evenings (5–11 pm)",
		"nine-five": "weekday daytime (9 am–5 pm)",
		weekdays: "weekdays",
		weekends: "weekends",
	};

	// ── Load ──────────────────────────────────────────────────────────────────
	// Two small lazy files: shared meta (axes, rules, typical-corridor medians), then the
	// selected corridor's own record. Nothing is fetched until a corridor is selected.
	let meta = $state(null);
	let c = $state(null);
	let failed = $state(false);

	$effect(() => {
		if (meta) return;
		loadMeta()
			.then((m) => (meta = m))
			.catch(() => (failed = true));
	});

	const entry = $derived(getActivityEntry(selectedCorridorId));

	$effect(() => {
		const id = entry?.id;
		c = null;
		if (!id) return;
		let cancelled = false;
		loadCorridorMetrics(id)
			.then((r) => {
				if (!cancelled) c = r;
			})
			.catch(() => {
				if (!cancelled) failed = true;
			});
		return () => {
			cancelled = true;
		};
	});

	const rules = $derived(meta?.comparability.rules ?? {});
	const bandFactor = $derived(meta?.comparability.share_band_factor ?? 1.4);
	const nCorridors = $derived(meta?.n_corridors ?? 21);

	// ── Time axis helpers ─────────────────────────────────────────────────────
	const months = $derived(meta?.months ?? []);
	const s1End = $derived(meta ? months.indexOf(meta.segments.find((s) => s.id === "S1").end) : 0);
	const s3Start = $derived(meta ? months.indexOf(meta.segments.find((s) => s.id === "S3").start) : 0);
	const yearTicks = $derived(
		months.flatMap((m, i) => (m.endsWith("01") ? [{ i, label: m.slice(0, 4) }] : [])),
	);

	function splitSegments(values) {
		return {
			S1: values.map((v, i) => (i <= s1End ? v : null)),
			S3: values.map((v, i) => (i >= s3Start ? v : null)),
		};
	}

	// ── Monthly activity ──────────────────────────────────────────────────────
	let mode = $state("trend"); // trend | share

	const monthly = $derived.by(() => {
		if (!c) return null;
		const raw = mode === "trend" ? c.index[period] : c.share_of_total[period];
		const sp = splitSegments(raw);
		const lastS1 = meanOf(raw.slice(s1End - 5, s1End + 1));
		return {
			raw,
			series: [
				{ id: "S1", label: SEGMENT_LABEL.S1, color: COLORS.S1, values: sp.S1 },
				{ id: "S3", label: SEGMENT_LABEL.S3, color: COLORS.S3, values: sp.S3 },
			],
			band:
				mode === "share" && lastS1
					? { from: s3Start, to: months.length - 1, lo: lastS1 / bandFactor, hi: lastS1 * bandFactor }
					: null,
		};
	});

	function monthlyReadout(i) {
		if (!c || !monthly) return null;
		if (i > s1End && i < s3Start) return `${formatMonth(months[i])}: not used (data sample too small)`;
		const seg = i <= s1End ? "S1" : "S3";
		const v = monthly.raw[i];
		if (v === null || v === undefined) return null;
		const devices = c.monthly[period].devices[i];
		return mode === "trend"
			? `${formatMonth(months[i])} · ${SEGMENT_LABEL[seg]} data: ${Math.round(v)} (period start = 100) · ≈ ${fmtInt(devices)} devices`
			: `${formatMonth(months[i])} · ${SEGMENT_LABEL[seg]} data: ${v.toFixed(1)}% of all corridors' activity`;
	}

	// ── Repeat visitors ───────────────────────────────────────────────────────
	const halfYears = $derived(meta?.half_years ?? []);
	const repeat = $derived.by(() => {
		if (!c) return null;
		const raw = c.repeat_pct[period];
		const hyS1End = halfYears.indexOf("2022H2");
		const hyS3Start = halfYears.indexOf("2023H2");
		return {
			raw,
			hyS1End,
			hyS3Start,
			series: [
				{ id: "S1", label: SEGMENT_LABEL.S1, color: COLORS.S1, values: raw.map((v, i) => (i <= hyS1End ? v : null)) },
				{ id: "S3", label: SEGMENT_LABEL.S3, color: COLORS.S3, values: raw.map((v, i) => (i >= hyS3Start ? v : null)) },
			],
			ticks: halfYears.flatMap((h, i) => (h.endsWith("H1") ? [{ i, label: h.slice(0, 4) }] : [])),
		};
	});

	function repeatReadout(i) {
		if (!repeat) return null;
		const v = repeat.raw[i];
		if (v === null || v === undefined) return `${formatHalfYear(halfYears[i])}: not used (data sample too small)`;
		const seg = i <= repeat.hyS1End ? "S1" : "S3";
		return `${formatHalfYear(halfYears[i])} · ${SEGMENT_LABEL[seg]} data: ${v.toFixed(0)}% of devices came back`;
	}

	// ── Snapshot charts: which data periods to show ──────────────────────────
	const snapWindows = $derived(windowId === "both" ? ["S3", "S1"] : [windowId]);
	// segment used for single-number highlights
	const snap = $derived(windowId === "S1" ? "S1" : "S3");

	const weekendRows = $derived.by(() => {
		if (!c) return [];
		return snapWindows.map((s) => {
			const sp = c.segments[s].splits;
			const typ = meta.typical[s].weekend_pct;
			return {
				label: SEGMENT_LABEL[s],
				segments: [
					{ label: "Weekdays", value: sp.weekday_pct, color: COLORS.first },
					{ label: "Weekends", value: sp.weekend_pct, color: COLORS.second, dark: true },
				],
				marker: { pos: 100 - typ, label: `Typical corridor: ${typ.toFixed(0)}% on weekends` },
			};
		});
	});

	const eveningRows = $derived.by(() => {
		if (!c) return [];
		return snapWindows.map((s) => {
			const sp = c.segments[s].splits;
			const typ = meta.typical[s].evening_pct;
			return {
				label: SEGMENT_LABEL[s],
				segments: [
					{ label: "Weekday daytime (9–5)", value: sp.nine_five_pct, color: COLORS.first },
					{ label: "Evening (5–11 pm)", value: sp.evening_pct, color: COLORS.second, dark: true },
				],
				marker: { pos: 100 - typ, label: `Typical corridor: ${typ.toFixed(0)}% in the evening` },
			};
		});
	});

	// ── Council-district origin ───────────────────────────────────────────────
	const districtSets = $derived.by(() => {
		if (!c) return [];
		const make = (id, label, color, d) => ({
			id,
			label,
			color,
			values: d.by_district[period],
			inDistrict: d.in_district_pct[period],
		});
		if (windowId === "both") {
			return [make("pooled", "Average of both periods", COLORS.S3, c.pooled.district_origin)];
		}
		return [make(windowId, SEGMENT_LABEL[windowId], COLORS[windowId], c.segments[windowId].district_origin)];
	});
	const districtSet = $derived(districtSets[0] ?? null);
	const outsideOakland = $derived(
		districtSet ? Math.max(0, 100 - districtSet.values.reduce((a, b) => a + (b ?? 0), 0)) : null,
	);

	// ── Travel distance ───────────────────────────────────────────────────────
	const distanceRows = $derived.by(() => {
		if (!c) return [];
		return snapWindows.map((s) => {
			const td = c.segments[s].travel_distance[period];
			const b = bucketBands(td.bands);
			return {
				label: SEGMENT_LABEL[s],
				median: td.median_km,
				typical: meta.typical[s].median_km[period],
				segments: b.map((v, i) => ({
					label: DISTANCE_BUCKET_LABELS[i],
					value: v,
					color: COLORS.distance[i],
					dark: i < 2, // dark label on the two lightest greens
				})),
			};
		});
	});

	// ── Highlights ────────────────────────────────────────────────────────────
	const highlights = $derived.by(() => {
		if (!c || !meta) return [];
		const out = [];
		const sum = c.segments[snap].summary;
		const peer = c.segments[snap].peer;
		const label = PERIOD_LABEL[period];

		// 1. Recovery inside the 2019-22 data (own baseline, so valid)
		const idx = c.index[period];
		const y2022 = meanOf(idx.slice(months.indexOf("202201"), months.indexOf("202212") + 1));
		if (y2022 !== null) {
			out.push({
				strong: `${Math.round(y2022)}%`,
				text: `of its 2019 level for ${label} by 2022 (same data provider, so a fair comparison).`,
			});
		}

		// 2. Share of all corridors, with the provider-change band
		const share = c.share_of_total[period];
		const sh22 = meanOf(share.slice(months.indexOf("202201"), months.indexOf("202212") + 1));
		const sh25 = meanOf(share.slice(months.indexOf("202501"), months.indexOf("202512") + 1));
		if (sh22 && sh25) {
			const ratio = sh25 / sh22;
			const verdict =
				ratio > bandFactor
					? "a rise larger than the data-provider change alone could explain"
					: ratio < 1 / bandFactor
						? "a fall larger than the data-provider change alone could explain"
						: "within what the data-provider change alone could explain, so no clear shift";
			out.push({
				strong: `${sh22.toFixed(1)}% → ${sh25.toFixed(1)}%`,
				text: `share of the ${nCorridors} corridors' combined activity (${label}) from 2022 to 2025: ${verdict}.`,
			});
		}

		// 3. How local
		const oak = c.segments[snap].origin_by_area[period].oakland;
		const localRank = peer.oakland_pct.rank;
		out.push({
			strong: `${oak.toFixed(0)}%`,
			text: `of visitors live in Oakland (${SEGMENT_LABEL[snap]} data), more local than ${nCorridors - localRank} of ${nCorridors - 1} other corridors.`,
		});

		// 4. Typical trip
		const td = c.segments[snap].travel_distance[period];
		const typ = meta.typical[snap].median_km[period];
		out.push({
			strong: `${td.median_km.toFixed(1)} km`,
			text: `median trip from home (typical corridor: ${typ.toFixed(1)} km).`,
		});

		// 5. Change in rank since the earlier data
		const ch = c.peer_change.oakland_pct;
		if (period === "all" && ch !== undefined && Math.abs(ch) >= 3) {
			out.push({
				strong: `${ch > 0 ? "Up" : "Down"} ${Math.abs(ch)} places`,
				text: `in how local its visitors are, ${ch > 0 ? "versus" : "compared with"} other corridors, since 2019–22.`,
			});
		}
		return out;
	});

	const smallSample = $derived(c ? c.segments.S3.summary.devices_per_month < 1000 : false);

	function ruleChip(metric) {
		return rules[metric] === "peer_relative" ? "rank" : "within";
	}
</script>

{#snippet chip(kind)}
	{#if kind === "within"}
		<span class="chip within" title="The two data providers record visits differently, so these values can only be compared within one period, not between periods.">Compare within a period only</span>
	{:else if kind === "rank"}
		<span class="chip rank" title="Exact values shift between data providers, but how corridors rank against each other holds up, so rank changes are meaningful.">Rank is comparable across periods</span>
	{/if}
{/snippet}

{#if !entry}
	<p class="empty">No activity data is available for this corridor yet.</p>
{:else if failed}
	<p class="empty">Activity data could not be loaded.</p>
{:else if !c || !meta}
	<p class="empty">Loading activity profile…</p>
{:else}
	<div class="ap">
		{#if smallSample}
			<p class="warn">
				<strong>Small sample.</strong> Few devices were seen in this corridor, so values below are noisy. Interpret with caution.
			</p>
		{/if}

		<details class="about">
			<summary>About this data: what it shows and what it can't</summary>
			<ul>
				<li>
					Estimates come from <strong>anonymised mobile-device location data</strong>. They describe patterns
					of visits by devices with a known Bay Area home, not counts of people.
				</li>
				<li>
					The data come from <strong>two different providers</strong>: 2019–22 and mid-2023–25. They do not
					overlap and record visits differently, so <strong>levels cannot be joined across the break</strong>.
					Charts draw each period separately.
				</li>
				<li>
					Jan–Jun 2023 is <strong>left out</strong> because its sample is far too small to be reliable.
				</li>
				<li>
					Across the break, only <strong>relative</strong> measures are compared: a corridor's share of all
					{nCorridors} corridors' activity (with a grey uncertainty band) and how corridors rank against each other.
					Repeat visits, weekday/weekend and daytime/evening splits, and district origin are compared within a
					period only.
				</li>
				<li>Home areas are census block groups; values are shown as shares, never raw counts.</li>
			</ul>
		</details>

		<!-- Highlights -->
		<ul class="highlights">
			{#each highlights as h, i (i)}
				<li><strong>{h.strong}</strong> {h.text}</li>
			{/each}
		</ul>

		<!-- Monthly activity -->
		<div class="block">
			<div class="block-head">
				<h3>Monthly Activity <span class="per">· {PERIOD_LABEL[period]}</span></h3>
				<div class="seg" role="group" aria-label="Chart view">
					<button type="button" class:on={mode === "trend"} onclick={() => (mode = "trend")}>Trend</button>
					<button type="button" class:on={mode === "share"} onclick={() => (mode = "share")}>Share of all corridors</button>
				</div>
			</div>
			<LineChart
				series={monthly.series}
				xCount={months.length}
				xTicks={yearTicks}
				gaps={[{ from: s1End + 1, to: s3Start - 1, label: "no data" }]}
				vlines={[{ i: months.indexOf("202003"), label: "COVID-19" }]}
				band={monthly.band}
				refLine={mode === "trend" ? { y: 100 } : null}
				yFormat={mode === "trend" ? (v) => Math.round(v) : (v) => `${v.toFixed(0)}%`}
				readout={monthlyReadout}
				ariaLabel="Monthly activity"
			/>
			<div class="lg">
				<span><i style={`background:${COLORS.S1}`}></i>2019–22 data</span>
				<span><i style={`background:${COLORS.S3}`}></i>2023–25 data</span>
				<span><i class="gap-sw"></i>Jan–Jun 2023: not used</span>
				{#if mode === "trend"}<span><i class="ref-sw"></i>100 = average of the period's first 12 months</span>{/if}
				{#if mode === "share"}<span><i class="band-sw"></i>Uncertainty from the change of data provider</span>{/if}
			</div>
			<p class="cap">
				{#if mode === "trend"}
					Each line is indexed to the average of <strong>its own first 12 months = 100</strong>, so you can read change
					<em>within</em> each period (e.g. the COVID drop and recovery). The two lines are different data
					providers: don't compare their heights.
				{:else}
					The corridor's share of the combined activity of all {nCorridors} corridors, which removes each provider's
					overall scale so the two periods can be compared. The grey band shows how far the 2023–25 line could sit
					from the 2022 level <em>from the change of provider alone</em>; a line outside it signals a real shift.
				{/if}
			</p>
		</div>

		<!-- Repeat visitors -->
		<div class="block">
			<div class="block-head">
				<h3>Repeat Visitors</h3>
				{@render chip(ruleChip("repeat_pct"))}
			</div>
			<LineChart
				series={repeat.series}
				xCount={halfYears.length}
				xTicks={repeat.ticks}
				gaps={[{ from: repeat.hyS1End + 1, to: repeat.hyS3Start - 1, label: "" }]}
				yFormat={(v) => `${v.toFixed(0)}%`}
				yMax={Math.max(...repeat.raw.filter((v) => v !== null)) * 1.1}
				readout={repeatReadout}
				ariaLabel="Repeat visitors by half-year"
			/>
			<p class="cap">
				Share of devices seen on two or more days in a six-month period. The 2023–25 provider records fewer pings
				per device, so its repeat rates run lower: <strong>read each line on its own</strong>, not the drop between them.
			</p>
		</div>

		<!-- Weekday vs weekend -->
		<div class="block">
			<div class="block-head">
				<h3>Weekday vs. Weekend</h3>
				{@render chip(ruleChip("weekend_pct"))}
			</div>
			<StackedBar rows={weekendRows} refLine={{ pos: (5 / 7) * 100, label: "Share of days (5 of 7)" }} />
		</div>

		<!-- Daytime vs evening -->
		<div class="block">
			<div class="block-head">
				<h3>Daytime vs. Evening</h3>
				{@render chip(ruleChip("evening_pct"))}
			</div>
			<StackedBar rows={eveningRows} />
			<p class="cap">
				Share of visits in the evening versus weekday daytime. The evening window is shorter than the daytime one, so
				compare with the typical corridor marker rather than against 50%.
			</p>
		</div>

		<!-- Council district origin -->
		<div class="block">
			<div class="block-head">
				<h3>Council District Origin <span class="per">· {PERIOD_LABEL[period]}</span></h3>
				{@render chip(ruleChip("in_district_pct"))}
			</div>
			{#if districtSet}
				<p class="district-lead">
					<strong>{(districtSet.inDistrict ?? 0).toFixed(0)}%</strong> of visitors live in this corridor's own district
					(<strong>D{c.primary_district}</strong>{c.touched_districts.length > 1 ? `; it also touches D${c.touched_districts.filter((d) => d !== c.primary_district).join(", D")}` : ""}).
				</p>
				<DistrictBars datasets={districtSets} ownDistrict={c.primary_district} districts={meta.districts} />
				<p class="cap">
					Share of all visitors, by the council district they live in ({districtSet.label.toLowerCase()}). About
					<strong>{(outsideOakland ?? 0).toFixed(0)}%</strong> live outside Oakland.
					{#if windowId === "both"}This view averages the two periods with equal weight.{/if}
				</p>
			{/if}
		</div>

		<!-- Travel distance -->
		<div class="block">
			<div class="block-head">
				<h3>Travel Distance <span class="per">· {PERIOD_LABEL[period]}</span></h3>
				{@render chip(ruleChip("within_5km_pct"))}
			</div>
			<StackedBar rows={distanceRows.map((r) => ({ label: r.label, segments: r.segments }))} />
			<p class="cap">
				Straight-line distance from visitors' home block group to the corridor.
				{#each distanceRows as r (r.label)}
					Median in {r.label}: <strong>{r.median?.toFixed(1)} km</strong> (typical corridor {r.typical?.toFixed(1)} km).{" "}
				{/each}
				For the share of visitors living within 5 km it ranks{" "}
				{#each snapWindows as s, i (s)}
					<strong>#{c.segments[s].peer.within_5km_pct.rank} of {nCorridors}</strong> in {SEGMENT_LABEL[s]}{i < snapWindows.length - 1 ? " and " : " "}
				{/each}
				(1 = most local).
			</p>
		</div>
	</div>
{/if}

<style>
	.ap {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.empty {
		font-size: 0.73rem;
		color: var(--brandGray60, #777);
		font-style: italic;
		margin: 0;
	}

	.warn {
		margin: 0;
		padding: 7px 9px;
		border-left: 3px solid var(--oak-gold, #eac555);
		background: #fbf6e4;
		font-size: 0.7rem;
		line-height: 1.4;
		color: var(--oak-text, rgb(30, 60, 80));
	}

	/* About this data */
	.about {
		border: 1px solid var(--brandGray, #ddd);
		border-radius: 4px;
		background: #fafaf8;
	}
	.about summary {
		cursor: pointer;
		padding: 7px 10px;
		font-size: 0.7rem;
		font-weight: 600;
		color: var(--oak-green-dark, #1e4a2a);
		list-style: none;
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.about summary::-webkit-details-marker {
		display: none;
	}
	.about summary::before {
		content: "▸";
		font-size: 0.7rem;
		transition: transform 0.15s;
	}
	.about[open] summary::before {
		transform: rotate(90deg);
	}
	.about ul {
		margin: 0;
		padding: 0 12px 10px 26px;
		display: flex;
		flex-direction: column;
		gap: 5px;
		font-size: 0.7rem;
		line-height: 1.45;
		color: var(--oak-text, rgb(30, 60, 80));
	}

	/* Highlights */
	.highlights {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.highlights li {
		position: relative;
		padding-left: 12px;
		font-size: 0.74rem;
		line-height: 1.4;
		color: var(--oak-text, rgb(30, 60, 80));
	}
	.highlights li::before {
		content: "";
		position: absolute;
		left: 0;
		top: 0.5em;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--oak-gold, #eac555);
	}
	.highlights strong {
		color: var(--oak-green-dark, #1e4a2a);
	}

	/* Chart blocks */
	.block {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.block-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 4px 8px;
	}
	h3 {
		margin: 0;
		font-family: "Public Sans", sans-serif;
		font-weight: 700;
		font-size: 0.68rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--oak-green-dark, #1e4a2a);
	}
	.per {
		font-weight: 500;
		text-transform: none;
		letter-spacing: 0;
		color: var(--brandGray60, #777);
	}

	.cap {
		margin: 0;
		font-size: 0.66rem;
		line-height: 1.45;
		color: var(--brandGray60, #777);
	}
	.cap strong {
		color: var(--oak-text, rgb(30, 60, 80));
	}

	.district-lead {
		margin: 0;
		font-size: 0.74rem;
		line-height: 1.4;
		color: var(--oak-text, rgb(30, 60, 80));
	}
	.district-lead strong {
		color: var(--oak-green-dark, #1e4a2a);
	}

	/* Segmented control */
	.seg {
		display: inline-flex;
		border: 1px solid var(--brandGray, #ddd);
		border-radius: 999px;
		overflow: hidden;
	}
	.seg button {
		border: none;
		background: #fff;
		padding: 3px 9px;
		font-family: "Public Sans", sans-serif;
		font-size: 0.64rem;
		color: var(--brandGray70, #555);
		cursor: pointer;
		line-height: 1.2;
	}
	.seg button.on {
		background: var(--oak-gold, #eac555);
		color: var(--oak-green-dark, #1e4a2a);
		font-weight: 600;
	}
	.seg button:focus-visible {
		outline: 2px solid var(--oak-green, #2c683d);
		outline-offset: -2px;
	}

	/* Comparability chips */
	.chip {
		display: inline-block;
		padding: 2px 7px;
		border-radius: 999px;
		font-size: 0.6rem;
		font-weight: 600;
		line-height: 1.3;
		white-space: nowrap;
	}
	.chip.within {
		background: #f3efe0;
		color: var(--oak-gold-dark, #9c7c1f);
	}
	.chip.rank {
		background: var(--oak-green-tint, #eaf1ec);
		color: var(--oak-green, #2c683d);
	}

	/* legend under the line chart */
	.lg {
		display: flex;
		flex-wrap: wrap;
		gap: 3px 12px;
	}
	.lg span {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 0.66rem;
		color: var(--oak-text, rgb(30, 60, 80));
	}
	.lg i {
		width: 14px;
		height: 3px;
		border-radius: 2px;
	}
	.lg i.ref-sw {
		height: 0;
		width: 14px;
		border-top: 1.5px dashed #8a8f94;
		background: none;
	}
	.lg i.gap-sw {
		height: 9px;
		width: 14px;
		background: #f1f1ee;
		border: 1px solid #dedede;
	}
	.lg i.band-sw {
		height: 9px;
		width: 14px;
		background: #8a8f94;
		opacity: 0.25;
	}
</style>
