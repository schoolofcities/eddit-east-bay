/**
 * Map layer catalog.
 *
 * group.exclusive: one active item at a time
 * group.ui: UI hint for panel rendering
 * item.key: optional data field key to connect once data is wired
 */

const COLOURS = [
	"#EAF0F8",
	"#B8C8E3",
	"#7E99C6",
	"#4A679A",
	"#1E3765"
];


export const LAYER_GROUPS = [
	{
		id: 'demography',
		label: 'Demography',
		exclusive: true,
		ui: 'dropdown',
		items: [
			{ id: 'pop_density', label: 'Population Density', key: 'pop_density', breaks: [3053, 4850, 6737, 9102], colors: COLOURS },
			{ id: 'pop_count', label: 'Population Count', key: 'population', breaks: [855, 1056, 1296, 1606], colors: COLOURS },
			{ id: 'median_household_income', label: 'Median Household Income', key: 'median_household_income', breaks: [50072, 78269, 110872, 158710], colors: COLOURS },
		],
	}
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
			state[group.id][item.id] = false;
		}
	}

	return state;
}
