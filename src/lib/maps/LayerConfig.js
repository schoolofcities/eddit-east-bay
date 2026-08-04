import bidBoundaries from "../../data/OAK_BIDs.geo.json";


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
			{ id: "transit-rail", label: "Rail", key: null },
			// { id: "transit-busses", label: "AC Transit Bus", key: null },
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
		],
	},
];


export const CORRIDOR_BOUNDARIES = bidBoundaries;

export const CORRIDORS = bidBoundaries.features
	.map((feature) => ({
		id: feature.properties.BID,
		name: feature.properties.BID,
	}))
	.sort((a, b) => a.name.localeCompare(b.name));

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
