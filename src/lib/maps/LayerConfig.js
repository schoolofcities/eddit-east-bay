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
			{ id: 'pop', label: 'Placeholder Label', key: 'pop', breaks: [1, 2, 3, 4], colors: COLOURS },
			{ id: 'age', label: 'Placeholder Label', key: 'age', breaks: [1, 2, 3, 4], colors: COLOURS },
			{ id: 'income', label: 'Placeholder Label', key: 'income', breaks: [1, 2, 3, 4], colors: COLOURS },
			{ id: 'education', label: 'Placeholder Label', key: 'education', breaks: [1, 2, 3, 4], colors: COLOURS },
			{ id: 'citizenship', label: 'Placeholder Label', key: 'citizenship', breaks: [1, 2, 3, 4], colors: COLOURS },
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
