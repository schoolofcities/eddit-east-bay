/**
 * Map layer catalog — City of Oakland / East Bay business corridors.
 *
 * Mirrors the structure of tacLayerConfig.js (Toronto Arts Council project),
 * swapped from "arts venue" to "business corridor" as the unit of analysis:
 *   - demography: ACS-style census indicators, shaded on Oakland block groups
 *   - activity: per-corridor home-origin visitor share (fetched at runtime,
 *     see EastBayMap.svelte's applyActivityFeatureState)
 *   - mobility: BART / AC Transit lines + stops
 *   - reference: neighbourhood, council district, and business-improvement-
 *     district boundaries
 *
 * NOTE: this is currently a barebones prototype. None of the $data files
 * these layers reference exist yet, so the corresponding code in
 * EastBayMap.svelte is commented out — this config is the source of truth
 * for what the panel UI *will* control once that data is wired in.
 *
 * group.exclusive: one active item at a time
 * group.ui: UI hint for panel rendering ('dropdown' | 'radio-toggles' | 'toggles')
 * item.key: data field (demography) or feature-state key (activity) —
 *   null for layers that aren't choropleths (transit, reference)
 *
 * NOTE ON BREAKS: the numeric breakpoints below are placeholders modeled on
 * plausible Oakland/Alameda County ACS ranges. Recompute actual quintile/
 * jenks breaks once real census extracts are wired in, the same way the
 * Toronto breaks were computed in analysis/*.ipynb.
 */

// Brand ramp, anchored on the main brand green (rgb(44,104,61) / #2C683D)
// at the dark end, stepping up through lighter tints for lower values.
const COLOURS = [
	"#EAF3EC",
	"#B9D9C1",
	"#87BE96",
	"#57A36C",
	"#2C683D",
];

export const LAYER_GROUPS = [
	{
		id: "demography",
		label: "Demography",
		exclusive: true,
		ui: "dropdown",
		items: [
			{ id: "pop-density", label: "Population Density (per km²)", key: "pop_density", breaks: [3053, 4850, 6737, 9102], colors: COLOURS },
			{ id: "pop-count", label: "Population Count", key: "population", breaks: [855, 1056, 1296, 1606], colors: COLOURS },
			{ id: "median-household-income", label: "Median Household Income", key: "median_household_income", breaks: [50072, 78269, 110872, 158710], colors: COLOURS },
			{ id: "median-age", label: "Median Age", key: "age_median", breaks: [32.4, 36.8, 41.2, 45.6], colors: COLOURS },
			{ id: "avg-household-size", label: "Average Household Size", key: "household_avg_size", breaks: [2.0, 2.3, 2.6, 3.0], colors: COLOURS },
			{ id: "income-inequality", label: "Income Inequality (Gini index)", key: "gini_index", breaks: [0.38, 0.42, 0.46, 0.51], colors: COLOURS },
			{ id: "pct-low-income", label: "Below Poverty Level (%)", key: "poverty_pct", breaks: [9.5, 13.8, 18.4, 24.0], colors: COLOURS },
			{ id: "pct-bachelors", label: "Bachelor's Degree or Higher (%)", key: "education_bachelor_higher_pct", breaks: [22.0, 32.5, 44.0, 58.0], colors: COLOURS },
			{ id: "pct-no-highschool", label: "Less Than High School (%)", key: "education_less_than_hs_pct", breaks: [6.5, 11.0, 16.5, 24.0], colors: COLOURS },
			{ id: "labour-creatives", label: "Workers in Creative Industries (%)", key: "labour_creatives_pct", breaks: [0.8, 1.4, 2.2, 3.6], colors: COLOURS },
			{ id: "labour-independent-artists", label: "Independent Artists (%)", key: "labour_independent_artists_pct", breaks: [0.1, 0.4, 0.8, 1.5], colors: COLOURS },
			{ id: "shelter-costs", label: "Households Spending >30% of Income on Housing (%)", key: "housing_cost_burdened_pct", breaks: [28.0, 33.0, 39.0, 46.0], colors: COLOURS },
			{ id: "tenure-renter", label: "Renter-Occupied Households (%)", key: "housing_tenure_renter_pct", breaks: [35.0, 48.0, 60.0, 72.0], colors: COLOURS },
			{ id: "people-of-color", label: "People of Color (%)", key: "poc_pct", breaks: [40.0, 55.0, 70.0, 85.0], colors: COLOURS },
			{ id: "pct-no-vehicle", label: "Households with No Vehicle (%)", key: "no_vehicle_pct", breaks: [8.0, 14.0, 22.0, 33.0], colors: COLOURS },
		],
	},
	{
		id: "activity",
		label: "Activity",
		exclusive: true,
		ui: "radio-toggles",
		items: [
			// `key` is the time_period field read out of each corridor's
			// static/corridor_home_origin/corridor_<id>.json (via MapLibre
			// feature-state, since the data is per-corridor and fetched at
			// runtime — see EastBayMap.svelte). `breaks`/`colors` are placeholder
			// quintile breakpoints; recompute once real visitation data lands,
			// mirroring analysis/activity/interpolate_venue_activity_ct.ipynb.
			{ id: "activity-all", label: "All", key: "all", breaks: [0.042, 0.106, 0.221, 0.565], colors: COLOURS },
			{ id: "activity-evenings", label: "Evenings (5-11PM)", key: "evening", breaks: [0.044, 0.123, 0.293, 0.82], colors: COLOURS },
			{ id: "activity-daytime", label: "Daytime (9AM-5PM)", key: "nine-five", breaks: [0.052, 0.146, 0.333, 0.938], colors: COLOURS },
			{ id: "activity-weekdays", label: "Weekdays", key: "weekdays", breaks: [0.043, 0.11, 0.235, 0.638], colors: COLOURS },
			{ id: "activity-weekends", label: "Weekends", key: "weekends", breaks: [0.051, 0.145, 0.33, 0.914], colors: COLOURS },
		],
	},
	{
		id: "mobility",
		label: "Mobility",
		exclusive: false,
		ui: "toggles",
		items: [
			{ id: "transit-rail", label: "BART", key: null },
			{ id: "transit-busses", label: "AC Transit Bus", key: null },
		],
	},
	{
		id: "reference",
		label: "Reference",
		exclusive: true,
		ui: "radio-toggles",
		items: [
			{ id: "ref-neighbourhoods", label: "Neighborhoods", key: null },
			{ id: "ref-council-districts", label: "City Council Districts", key: null },
			{ id: "ref-bids", label: "Business Improvement Districts", key: null },
		],
	},
];

export function makeInitialLayerState() {
	const state = {};

	for (const group of LAYER_GROUPS) {
		if (group.exclusive) {
			state[group.id] = { activeId: null };
			continue;
		}

		state[group.id] = {};
		for (const item of group.items) {
			state[group.id][item.id] = item.options ? null : false;
		}
	}

	return state;
}
