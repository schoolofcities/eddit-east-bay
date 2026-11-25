/**
 * Lazy loading + small helpers for the corridor activity data produced by
 * analysis/activity/ (see that folder's README).
 *
 * Everything heavy is code-split, so the page only pays for what is used:
 *   - corridor_index.json    (~10 KB)  imported statically: needed to map a selected
 *                                      corridor to its data
 *   - corridor_meta.json     (~3 KB)   shared axes, rules, typical-corridor medians; loaded once
 *   - corridor_metrics/<id>.json (~12 KB) one corridor's metrics, loaded when it is selected
 *   - corridor_home_origin (and _s1, _s3) folders: ~35 KB per file, one per corridor and
 *                                      time window, loaded only when an Activity map layer is on
 */
import corridorIndex from "../../data/activity/corridor_index.json";

// ── Corridor lookup ──────────────────────────────────────────────────────────

// The map and panel identify a corridor by its `corridor_name` exactly as it
// appears in OAK_CORRIDORS.geo.json (this can include odd whitespace, e.g.
// "Dimond "). `map_name` in the index holds that exact string.
const byMapName = new Map(
	corridorIndex.filter((e) => e.map_name).map((e) => [e.map_name, e]),
);

export function getActivityEntry(mapName) {
	if (!mapName) return null;
	return byMapName.get(mapName) ?? null;
}

// ── Lazy data ────────────────────────────────────────────────────────────────

let metaPromise = null;

/** Shared axes, segment definitions, comparability rules and typical-corridor medians. */
export function loadMeta() {
	metaPromise ??= import("../../data/activity/corridor_meta.json").then((m) => m.default);
	return metaPromise;
}

const metricLoaders = import.meta.glob("../../data/activity/corridor_metrics/*.json", { import: "default" });
const metricCache = new Map();

/** One corridor's metrics record (by corridor id, e.g. "downtown"). */
export async function loadCorridorMetrics(id) {
	if (metricCache.has(id)) return metricCache.get(id);
	const loader = metricLoaders[`../../data/activity/corridor_metrics/${id}.json`];
	if (!loader) return null;
	const data = await loader();
	metricCache.set(id, data);
	return data;
}

// One lazy loader per file; Vite turns each into its own chunk.
const originLoaders = import.meta.glob(
	"../../data/activity/corridor_home_origin*/corridor_*.json",
	{ import: "default" },
);

const ORIGIN_DIR = {
	pooled: "corridor_home_origin", // S1 and S3 averaged with equal weights
	S1: "corridor_home_origin_s1",
	S3: "corridor_home_origin_s3",
};

const originCache = new Map();

/**
 * Block-group shares for one corridor: { GEOID: { all, evening, "nine-five",
 * weekdays, weekends } } (% of the corridor's estimated visitors).
 */
export async function loadOrigin(mapName, variant = "S3") {
	const entry = getActivityEntry(mapName);
	if (!entry || !ORIGIN_DIR[variant]) return null;

	const key = `../../data/activity/${ORIGIN_DIR[variant]}/corridor_${entry.id}.json`;
	if (originCache.has(key)) return originCache.get(key);

	const loader = originLoaders[key];
	if (!loader) return null;
	const data = await loader();
	originCache.set(key, data);
	return data;
}

// ── Time windows (the two providers) ─────────────────────────────────────────

export const WINDOWS = [
	{ id: "S3", label: "2023–25", long: "2023–2025 (current data provider)" },
	{ id: "S1", label: "2019–22", long: "2019–2022 (earlier data provider)" },
	{ id: "both", label: "Both averaged", long: "Both periods, averaged" },
];

export const SEGMENT_LABEL = { S1: "2019–22", S3: "2023–25" };

/** Which origin-map file set matches the chosen window. */
export function originVariant(windowId) {
	return windowId === "both" ? "pooled" : windowId;
}

// ── Palette (matches the panel's green / gold brand colours) ─────────────────

export const COLORS = {
	S3: "#2C683D", // current provider
	S1: "#5D7FA3", // earlier provider
	accent: "#EAC555", // brand gold: highlights
	accentDark: "#9C7C1F",
	text: "rgb(30, 60, 80)",
	muted: "#8A8F94",
	grid: "#E3E3E3",
	// weekday/weekend and daytime/evening bars
	first: "#2C683D",
	second: "#EAC555",
	// near -> far travel distance
	distance: ["#B9D9C1", "#87BE96", "#57A36C", "#2C683D", "#1E4A2A"],
};

// ── Formatting ───────────────────────────────────────────────────────────────

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "202307" -> "Jul '23" */
export function formatMonth(ym) {
	return `${MONTHS[Number(ym.slice(4, 6)) - 1]} '${ym.slice(2, 4)}`;
}

/** "2023H2" -> "H2 '23" */
export function formatHalfYear(hy) {
	return `${hy.slice(4)} '${hy.slice(2, 4)}`;
}

export function fmtPct(v, digits = 0) {
	return v === null || v === undefined ? "—" : `${v.toFixed(digits)}%`;
}

export function fmtInt(v) {
	return v === null || v === undefined ? "—" : Math.round(v).toLocaleString();
}

export function median(values) {
	const v = values.filter((x) => x !== null && x !== undefined && !Number.isNaN(x)).sort((a, b) => a - b);
	if (!v.length) return null;
	const mid = Math.floor(v.length / 2);
	return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2;
}

// ── Derived data ─────────────────────────────────────────────────────────────

/** The 7 native distance bands -> 5 easier-to-read buckets (<2, 2-5, 5-10, 10-25, 25+ km). */
export function bucketBands(bands) {
	if (!bands) return null;
	return [bands[0], bands[1], bands[2], bands[3], bands[4] + bands[5] + bands[6]];
}
export const DISTANCE_BUCKET_LABELS = ["< 2 km", "2–5 km", "5–10 km", "10–25 km", "25+ km"];

/** Mean of an array slice, ignoring nulls. */
export function meanOf(values) {
	const v = values.filter((x) => x !== null && x !== undefined);
	return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
}
