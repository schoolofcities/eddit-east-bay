import { base } from "$app/paths";

// Business-composition distributions, one CSV per breakdown, each shaped
// like: FID, BID, <category columns...> — with one row per corridor and
// each category column holding a % share for that corridor. These files
// live in /static, so (unlike LayerConfig's build-time geojson imports)
// they're fetched at runtime and parsed here, then cached in memory.
//
// Joined to a corridor the same way the catchment-area polygons are: by
// FID, resolved from the selected BID via LayerConfig's getCorridorFid.

export const BUSINESS_DISTRIBUTION_DATASETS = [
	{
		id: "sector",
		label: "Business Sectors",
		file: "/business_statistics/broad_sector_distribution.csv",
	},
	{
		id: "employees",
		label: "Employee Range",
		file: "/business_statistics/employee_range_distribution.csv",
	},
	{
		id: "sales",
		label: "Annual Sales Range",
		file: "/business_statistics/sales_range_distribution.csv",
	},
	{
		id: "ownLease",
		label: "Own or Lease",
		file: "/business_statistics/own_or_lease_da_distribution.csv",
	},
];

// Minimal RFC4180-style CSV parser — handles quoted fields, commas and
// escaped quotes inside quotes (needed here: several category names like
// "Arts, Entertainment & Recreation" contain commas), and both \n and \r\n
// line endings.
function parseCSV(text) {
	const rows = [];
	let row = [];
	let field = "";
	let inQuotes = false;

	for (let i = 0; i < text.length; i++) {
		const char = text[i];

		if (inQuotes) {
			if (char === '"') {
				if (text[i + 1] === '"') {
					field += '"';
					i++;
				} else {
					inQuotes = false;
				}
			} else {
				field += char;
			}
			continue;
		}

		if (char === '"') {
			inQuotes = true;
		} else if (char === ",") {
			row.push(field);
			field = "";
		} else if (char === "\n" || char === "\r") {
			if (char === "\r" && text[i + 1] === "\n") i++;
			row.push(field);
			field = "";
			if (row.length > 1 || row[0] !== "") rows.push(row);
			row = [];
		} else {
			field += char;
		}
	}

	// Flush a trailing field/row that wasn't newline-terminated.
	if (field.length || row.length) {
		row.push(field);
		rows.push(row);
	}

	return rows;
}

// Converts parsed rows into an array of { FID, BID, <category>: value, ... }
// objects, preserving the header's column order (JS preserves string-key
// insertion order, which is what "original CSV column order" relies on
// downstream).
function rowsToRecords(rows) {
	if (rows.length === 0) return [];
	const [header, ...body] = rows;

	return body
		.filter((cells) => cells.length === header.length)
		.map((cells) =>
			Object.fromEntries(header.map((key, i) => [key, cells[i]])),
		);
}

// dataset.id -> Promise<Map<FID (string), record>>
const datasetCache = new Map();

function loadDataset(dataset) {
	if (datasetCache.has(dataset.id)) return datasetCache.get(dataset.id);

	const promise = fetch(`${base}${dataset.file}`)
		.then((res) => {
			if (!res.ok) {
				throw new Error(
					`Failed to load ${base}${dataset.file}: ${res.status} ${res.statusText}`,
				);
			}
			return res.text();
		})
		.then((text) => {
			const byFid = new Map();
			for (const record of rowsToRecords(parseCSV(text))) {
				if (record.FID !== undefined) byFid.set(String(record.FID), record);
			}
			return byFid;
		});

	datasetCache.set(dataset.id, promise);
	return promise;
}

// Returns, for a given FID, all four distributions in
// BUSINESS_DISTRIBUTION_DATASETS order:
//   [{ id, label, categories: [{ label, value }, ...] }, ...]
// categories preserve original CSV column order and only include numeric,
// non-FID/BID columns. Returns null if fid is missing; a dataset with no
// matching row (or a load failure) comes back with an empty categories list
// rather than throwing, so one bad/missing file doesn't blank the panel.
export async function getBusinessDistributions(fid) {
	if (fid === null || fid === undefined) return null;

	return Promise.all(
		BUSINESS_DISTRIBUTION_DATASETS.map(async (dataset) => {
			try {
				const byFid = await loadDataset(dataset);
				const record = byFid.get(String(fid));
				if (!record) return { ...dataset, categories: [] };

				const categories = Object.keys(record)
					.filter((key) => key !== "FID" && key !== "BID")
					.map((key) => ({ label: key, value: parseFloat(record[key]) }))
					.filter((category) => !Number.isNaN(category.value));

				return { ...dataset, categories };
			} catch (err) {
				console.error(`[BusinessData] ${dataset.id} failed to load:`, err);
				return { ...dataset, categories: [] };
			}
		}),
	);
}