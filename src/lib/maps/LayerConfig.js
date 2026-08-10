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
			// Population
			// { id: "pop-count", label: "Population Count", key: "pop_count", breaks: [855.4, 1056, 1295.8, 1606.2], colors: COLOURS },
			{ id: "pop-density-sqmi", label: "Population Density (per mi²)", key: "pop_density_sqmi", breaks: [7907.36, 12560.98, 17449.6, 23573.48], colors: COLOURS },
			{ id: "total-households", label: "Total Households", key: "total_households", breaks: [332.2, 429, 517.8, 649.4], colors: COLOURS },
			{ id: "avg-household-size", label: "Average Household Size", key: "avg_household_size", breaks: [1.92, 2.31, 2.69, 3.12], colors: COLOURS },
			{ id: "median-age", label: "Median Age", key: "median_age", breaks: [33.16, 36.22, 39.8, 45.64], colors: COLOURS },

			// Income & housing cost
			{ id: "median-household-income", label: "Median Household Income", key: "median_household_income", breaks: [50072, 78269.4, 110871.8, 158709.6], colors: COLOURS },
			{ id: "per-capita-income", label: "Per Capita Income", key: "per_capita_income", breaks: [28820.8, 44274.8, 68274.2, 95857.6], colors: COLOURS },
			{ id: "purchasing-power-index", label: "Purchasing Power Index", key: "purchasing_power_index", breaks: [17955810, 35788790, 57418450, 83795750], colors: COLOURS },
			{ id: "purchasing-power-density", label: "Purchasing Power Density", key: "purchasing_power_density", breaks: [157657100, 376652500, 597736400, 921301500], colors: COLOURS },
			{ id: "low-income-share", label: "Low-Income Households (share)", key: "low_income_share", breaks: [0.07, 0.14, 0.21, 0.33], colors: COLOURS },

			// Housing stock
			{ id: "median-home-value", label: "Median Home Value", key: "median_home_value", breaks: [577500, 713120, 873560, 1181720], colors: COLOURS },
			{ id: "median-gross-rent", label: "Median Gross Rent", key: "median_gross_rent", breaks: [552.6, 1758, 2049.2, 2393], colors: COLOURS },
			{ id: "renter-share", label: "Renter-Occupied Households (share)", key: "renter_share", breaks: [0.3, 0.49, 0.66, 0.81], colors: COLOURS },
			// { id: "total-housing-units", label: "Total Housing Units", key: "total_housing_units", breaks: [352.2, 462.4, 554, 715.4], colors: COLOURS },
			{ id: "median-year-built", label: "Median Year Built", key: "median_year_built", breaks: [1938, 1944, 1953, 1966.4], colors: COLOURS },

			// Transportation
			{ id: "drive-alone-share", label: "Drive Alone to Work (share)", key: "drive_alone_share", breaks: [0.32, 0.41, 0.52, 0.63], colors: COLOURS },
			// Q1 and Q2 are both 0 in the source data — deduped to 3 breaks since a
			// "step" expression needs strictly ascending stops.
			{ id: "active-transit-share", label: "Walk/Bike to Work (share)", key: "active_transit_share", breaks: [0, 0.01, 0.03], colors: COLOURS },
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