# Activity (mobile-device visits to East Bay corridors)

The raw counts come from Cuebiq mobility data and are **licensed -- `data/activity/` is git-ignored and raw counts must not be published**. The map and corridor panel therefore only use proportions and sample-weighted estimates (`src/data/activity/`).

```
east_bay_corridor_activity_full*.ipynb   Cuebiq-workspace queries (set 1: 11 BIDs, set 2: 10 more corridors)
pilot / explore_* notebooks              earlier exploration, nothing downstream depends on them
01_ ... 05_                              production notebooks, run in order -> data for the web app
06_, 07_                                 research notebooks: statistics, comparisons, noteworthy facts
```

## Inputs

Download the two result ZIPs from the Cuebiq workspace and unzip them into `data/activity/`:

- `east_bay_essential_results/` (corridor set 1)
- `east_bay_essential_results2/` (corridor set 2)

Both have the same table layout (monthly or half-yearly gzipped CSVs, see the methods contract at the top of `east_bay_corridor_activity_full.ipynb`).

## Production notebooks (run in order)

| Notebook | Reads | Writes |
|---|---|---|
| `01_combine_corridor_results.ipynb` | both result folders | `data/activity/processed/*.csv.gz` (stacked tables, `corridor_lookup.csv`) |
| `02_bg_crosswalk_and_districts.ipynb` | `processed/home_geography`, TIGER2019 block groups (auto-downloaded to `data/geo/tiger2019_bg/`), Alameda 2020 block groups, council districts, corridor polygons | `processed/bg_crosswalk_2010_to_2020.csv.gz`, `bg_district_weights.csv`, `corridor_districts.csv` |
| `03_corridor_home_origin_by_bg.ipynb` | `processed/corridor_homes`, crosswalks | `src/data/activity/corridor_home_origin{,_s1,_s3}/corridor_<id>.json` (21 files each), `src/data/activity/legend_breaks.json`, `processed/corridor_bg_origin*.csv.gz`, `corridor_district_origin*.csv` |
| `04_cross_segment_comparability.ipynb` | `processed/*` | `processed/comparability.json` (which metrics may be compared across the provider break, and the uncertainty band) |
| `05_corridor_metrics.ipynb` | `processed/*`, `comparability.json` | `src/data/activity/corridor_metrics.json`, `corridor_index.json` |

### What ends up in `src/data/activity/`

| File | Size | Loaded | Contents |
|---|---|---|---|
| `corridor_index.json` | ~10 KB | on page load | one entry per corridor: `id`, `name`, `map_name` (exact `corridor_name` in `OAK_CORRIDORS.geo.json`, `null` for Hegenberger which is not on the map yet), centroid, primary council district, origin file names for the three variants |
| `corridor_metrics.json` | ~260 KB | on page load | `meta` (months, half-years, provider segments, bands, **comparability rules**) + one record per corridor (see below) |
| `corridor_home_origin/corridor_<id>.json` | ~35 KB each | lazily, on corridor select | `{ "<BG GEOID>": { "all": %, "evening": %, "nine-five": %, "weekdays": %, "weekends": % } }`, share of the corridor's visitors living in each Oakland block group, **S1 and S3 equal-weighted** (default). Keys match the Activity layers in `LayerConfig.js` and the map's `promoteId: "GEOID"`, so it can go straight into `map.setFeatureState` |
| `corridor_home_origin_s1/`, `_s3/` | same | lazily | the same files for each provider segment alone (2019-22 and 2023-25), so the UI can offer "2019-22 / 2023-25 / all years" |
| `legend_breaks.json` | <1 KB | at build/config time | quintile breaks per period for `pooled`, `S1` and `S3` (nearly identical; one set is enough) |

`corridor_metrics.json` per corridor: `monthly` (absolute devices/visits, **S1 and S3 as separate series**), `index` (each segment indexed to its own first 12 months = 100), `share_of_total` (% of the 21-corridor total, comparable across the break within `meta.comparability.share_band_factor`), `repeat_pct` (per half-year), `segments.S1` / `segments.S3` (summary card, timing splits, origin by area, council-district origin, travel distance, repeat %, and `peer` = rank among the 21 corridors and gap to the median corridor), `pooled.district_origin` (same basis as the map files) and `peer_change` (rank places moved S1 -> S3, only for metrics allowed across the break).

## The provider break: what is and isn't comparable

The data come from three providers: **S1** Jan 2019-Dec 2022, **S2** Jan-Jun 2023, **S3** Jul 2023-Dec 2025. There is **no overlap**, so nothing can calibrate one against another. `04_cross_segment_comparability` tests what survives:

- **S2 is excluded everywhere** (~17k-device panel, a few hundred devices per corridor-month). Its months are `null`.
- **Absolute levels are never joined across the break.** The provider effect is not a common multiplier (corridors differ by roughly x1.4 in either direction beyond ordinary change), so show S1 and S3 as separate lines.
- **Across the break only relative measures are used**: a corridor's *share of the 21-corridor total* (with the explicit uncertainty band), and *rank position* for metrics whose corridor ranking survives the break (Oakland share, share within 5 km, share beyond 25 km).
- **Within one segment only**: repeat %, evening share, weekend share and own-district share (their rankings do not survive the break).
- **Maps**: the default blends S1 and S3 shares with equal weights (each is computed inside one provider, so no scaling between providers is ever applied); per-segment maps are published alongside because the two segments agree on broad geography but not fine detail.
- What the data **cannot** say: "corridor X in 2025 is at N% of its 2019 level". That needs an absolute bridge across the break.

## Other method notes

- **Homes -> map block groups.** Visitor homes are TIGER2019 (2010-vintage) block groups; the map draws 2020 block groups. `02_` builds a crosswalk by *population-weighted areal interpolation* (overlap area x 2020 population density, normalised over all Alameda County block groups so slivers at the city edge don't over-allocate). Shares are `% of the corridor's matched-home visitors`, so the Oakland-wide sum is the corridor's *Oakland share* and the remainder is visitors from elsewhere. Validated against the data's own `Oakland` label: within 0.04 percentage points.
- **Measure.** `normalized_unique_device_months` (sample-weighted, as in the TAC map). Devices without a matched Bay Area home are excluded from numerators and denominators.
- **Time periods.** `all`, `evening` (every day 5-11 pm), `nine-five` (weekdays 9 am-5 pm), `weekdays`, `weekends`. Overlapping, never summed.
- **Council-district origin.** Each block group's activity is split across districts by area. "Own district" is the corridor's primary district (most corridor area); the full seven-district vector is kept for corridors that straddle two.

## Research notebooks

- `06_explore_corridor_profiles.ipynb`: scale, loyalty, timing, origin, travel distance and catchment shape for the 21 corridors (S3 / 2025); clustered profile heatmap and corridor types; auto-generated rankings; change in peer position since S1.
- `07_explore_origins_and_trends.ipynb`: COVID shock and recovery (within S1), who gained and lost share, seasonality, origin trends within each segment, catchment maps and overlap, demographics of origin block groups, district over-index matrix.
