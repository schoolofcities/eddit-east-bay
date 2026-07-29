import { a as push, b as bind_props, p as pop, c as ensure_array_like, m as maybe_selected, d as attr, e as escape_html, f as attr_class, h as copy_payload, i as assign_payload, j as head } from "../../../chunks/index.js";
/* empty css                            */
import "maplibre-gl";
const COLOURS = [
  "#EAF3EC",
  "#B9D9C1",
  "#87BE96",
  "#57A36C",
  "#2C683D"
];
const LAYER_GROUPS = [
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
      { id: "avg-household-size", label: "Average Household Size", key: "household_avg_size", breaks: [2, 2.3, 2.6, 3], colors: COLOURS },
      { id: "income-inequality", label: "Income Inequality (Gini index)", key: "gini_index", breaks: [0.38, 0.42, 0.46, 0.51], colors: COLOURS },
      { id: "pct-low-income", label: "Below Poverty Level (%)", key: "poverty_pct", breaks: [9.5, 13.8, 18.4, 24], colors: COLOURS },
      { id: "pct-bachelors", label: "Bachelor's Degree or Higher (%)", key: "education_bachelor_higher_pct", breaks: [22, 32.5, 44, 58], colors: COLOURS },
      { id: "pct-no-highschool", label: "Less Than High School (%)", key: "education_less_than_hs_pct", breaks: [6.5, 11, 16.5, 24], colors: COLOURS },
      { id: "labour-creatives", label: "Workers in Creative Industries (%)", key: "labour_creatives_pct", breaks: [0.8, 1.4, 2.2, 3.6], colors: COLOURS },
      { id: "labour-independent-artists", label: "Independent Artists (%)", key: "labour_independent_artists_pct", breaks: [0.1, 0.4, 0.8, 1.5], colors: COLOURS },
      { id: "shelter-costs", label: "Households Spending >30% of Income on Housing (%)", key: "housing_cost_burdened_pct", breaks: [28, 33, 39, 46], colors: COLOURS },
      { id: "tenure-renter", label: "Renter-Occupied Households (%)", key: "housing_tenure_renter_pct", breaks: [35, 48, 60, 72], colors: COLOURS },
      { id: "people-of-color", label: "People of Color (%)", key: "poc_pct", breaks: [40, 55, 70, 85], colors: COLOURS },
      { id: "pct-no-vehicle", label: "Households with No Vehicle (%)", key: "no_vehicle_pct", breaks: [8, 14, 22, 33], colors: COLOURS }
    ]
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
      { id: "activity-weekends", label: "Weekends", key: "weekends", breaks: [0.051, 0.145, 0.33, 0.914], colors: COLOURS }
    ]
  },
  {
    id: "mobility",
    label: "Mobility",
    exclusive: false,
    ui: "toggles",
    items: [
      { id: "transit-rail", label: "BART", key: null },
      { id: "transit-busses", label: "AC Transit Bus", key: null }
    ]
  },
  {
    id: "reference",
    label: "Reference",
    exclusive: true,
    ui: "radio-toggles",
    items: [
      { id: "ref-neighbourhoods", label: "Neighborhoods", key: null },
      { id: "ref-council-districts", label: "City Council Districts", key: null },
      { id: "ref-bids", label: "Business Improvement Districts", key: null }
    ]
  }
];
function makeInitialLayerState() {
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
function EastBayMap($$payload, $$props) {
  push();
  let { map = null, selectedCorridorId = null, layerState = {} } = $$props;
  $$payload.out += `<div class="map-container svelte-iylopc"></div>`;
  bind_props($$props, { map, selectedCorridorId });
  pop();
}
function breaksLegend($$payload, item) {
  const each_array = ensure_array_like(item.colors);
  const each_array_1 = ensure_array_like(item.breaks);
  $$payload.out += `<svg class="legend svelte-lyve1b" width="100%" height="40"><!--[-->`;
  for (let i = 0, $$length = each_array.length; i < $$length; i++) {
    let color = each_array[i];
    $$payload.out += `<rect${attr("x", i * 20 + "%")} y="0" width="20%" height="20"${attr("fill", color)} stroke="white" stroke-width="1" opacity="0.7"></rect>`;
  }
  $$payload.out += `<!--]--><!--[-->`;
  for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
    let value = each_array_1[i];
    $$payload.out += `<text class="legend-label svelte-lyve1b"${attr("x", `${(i + 1) * 20}%`)} y="35" text-anchor="middle">`;
    if (i === 0) {
      $$payload.out += "<!--[-->";
      $$payload.out += `&lt;${escape_html(value.toLocaleString())}`;
    } else {
      $$payload.out += "<!--[!-->";
      if (i === item.breaks.length - 1) {
        $$payload.out += "<!--[-->";
        $$payload.out += `>${escape_html(value.toLocaleString())}`;
      } else {
        $$payload.out += "<!--[!-->";
        $$payload.out += `${escape_html(value.toLocaleString())}`;
      }
      $$payload.out += `<!--]-->`;
    }
    $$payload.out += `<!--]--></text>`;
  }
  $$payload.out += `<!--]--></svg>`;
}
function EastBayPanel($$payload, $$props) {
  push();
  let { selectedCorridorId = null, layerState = {}, corridors = [] } = $$props;
  const selectedCorridor = corridors.find((c) => c.id === selectedCorridorId) ?? null;
  function isOn(group, item) {
    if (group.exclusive) {
      return layerState[group.id]?.activeId === item.id;
    }
    return layerState[group.id]?.[item.id] ?? false;
  }
  const each_array_2 = ensure_array_like(corridors);
  const each_array_3 = ensure_array_like(LAYER_GROUPS);
  $$payload.out += `<aside class="panel svelte-lyve1b"><header class="panel-header svelte-lyve1b"><span class="header-org svelte-lyve1b">School of Cities | City of Oakland</span> <h1 class="header-title svelte-lyve1b">Equitable Development Data Insight Training (EDDIT)</h1> <p class="header-authors svelte-lyve1b">Author One, Author Two · 2026</p></header> <section class="panel-section svelte-lyve1b"><h2 class="section-heading svelte-lyve1b">Business Corridor</h2> <p class="section-desc svelte-lyve1b">Choose from the list or click a corridor on the map.</p> <div class="select-wrapper svelte-lyve1b"><select class="corridor-select svelte-lyve1b" aria-label="Select a corridor">`;
  $$payload.select_value = selectedCorridorId ?? "";
  $$payload.out += `<option value=""${maybe_selected($$payload, "")}>— Select a corridor —</option><!--[-->`;
  for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
    let corridor = each_array_2[$$index_2];
    $$payload.out += `<option${attr("value", corridor.id)}${maybe_selected($$payload, corridor.id)}>${escape_html(corridor.name)}</option>`;
  }
  $$payload.out += `<!--]-->`;
  if (corridors.length === 0) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<option value=""${maybe_selected($$payload, "")} disabled>(Corridors not yet loaded)</option>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  $$payload.select_value = void 0;
  $$payload.out += `</select> <svg class="select-arrow svelte-lyve1b" viewBox="0 0 10 6" aria-hidden="true"><path d="M0 0l5 6 5-6z"></path></svg></div></section> <div class="divider svelte-lyve1b"></div> <section class="panel-section svelte-lyve1b">`;
  if (selectedCorridor) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p class="cd-name svelte-lyve1b">${escape_html(selectedCorridor.name)}</p> <p class="cd-address svelte-lyve1b">${escape_html(selectedCorridor.address)}, Oakland, CA ${escape_html(selectedCorridor.postalCode)}</p> <p class="cd-body svelte-lyve1b">${escape_html(selectedCorridor.description || "Corridor description coming soon.")}</p>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<p class="empty-state svelte-lyve1b">Select a corridor above or click a marker on the map to view its
				description.</p>`;
  }
  $$payload.out += `<!--]--></section> <div class="divider svelte-lyve1b"></div> <section class="panel-section svelte-lyve1b"><h2 class="section-heading svelte-lyve1b">Map Layers</h2> <!--[-->`;
  for (let $$index_6 = 0, $$length = each_array_3.length; $$index_6 < $$length; $$index_6++) {
    let group = each_array_3[$$index_6];
    $$payload.out += `<div class="layer-group svelte-lyve1b"><span class="layer-group-label svelte-lyve1b">${escape_html(group.label)}</span> `;
    if (group.ui === "dropdown") {
      $$payload.out += "<!--[-->";
      const each_array_4 = ensure_array_like(group.items);
      $$payload.out += `<div class="select-wrapper svelte-lyve1b"><select class="corridor-select layer-select svelte-lyve1b"${attr("aria-label", `Select ${group.label} layer`)}>`;
      $$payload.select_value = layerState[group.id]?.activeId ?? "";
      $$payload.out += `<option value=""${maybe_selected($$payload, "")}>None</option><!--[-->`;
      for (let $$index_3 = 0, $$length2 = each_array_4.length; $$index_3 < $$length2; $$index_3++) {
        let item = each_array_4[$$index_3];
        $$payload.out += `<option${attr("value", item.id)}${maybe_selected($$payload, item.id)}>${escape_html(item.label)}</option>`;
      }
      $$payload.out += `<!--]-->`;
      $$payload.select_value = void 0;
      $$payload.out += `</select> <svg class="select-arrow svelte-lyve1b" viewBox="0 0 10 6" aria-hidden="true"><path d="M0 0l5 6 5-6z"></path></svg></div> `;
      if (group.id === "demography" && layerState.demography?.activeId) {
        $$payload.out += "<!--[-->";
        const selectedItem = group.items.find((item) => item.id === layerState.demography.activeId);
        if (selectedItem) {
          $$payload.out += "<!--[-->";
          breaksLegend($$payload, selectedItem);
        } else {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]-->`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]-->`;
    } else {
      $$payload.out += "<!--[!-->";
      if (group.ui === "radio-toggles") {
        $$payload.out += "<!--[-->";
        const each_array_5 = ensure_array_like(group.items);
        $$payload.out += `<div class="activity-grid svelte-lyve1b"><!--[-->`;
        for (let $$index_4 = 0, $$length2 = each_array_5.length; $$index_4 < $$length2; $$index_4++) {
          let item = each_array_5[$$index_4];
          $$payload.out += `<button type="button"${attr_class("activity-btn svelte-lyve1b", void 0, { "active": isOn(group, item) })}${attr("disabled", group.id === "activity" && !selectedCorridorId, true)}>${escape_html(item.label)}</button>`;
        }
        $$payload.out += `<!--]--></div> `;
        if (group.id === "activity") {
          $$payload.out += "<!--[-->";
          if (!selectedCorridorId) {
            $$payload.out += "<!--[-->";
            $$payload.out += `<p class="section-desc activity-hint svelte-lyve1b">Select a corridor to view its home-origin
								activity layers.</p>`;
          } else {
            $$payload.out += "<!--[!-->";
            if (layerState.activity?.activeId) {
              $$payload.out += "<!--[-->";
              const selectedActivityItem = group.items.find((item) => item.id === layerState.activity.activeId);
              if (selectedActivityItem) {
                $$payload.out += "<!--[-->";
                breaksLegend($$payload, selectedActivityItem);
                $$payload.out += `<!----> <p class="section-desc legend-caption svelte-lyve1b">% share of the corridor's estimated
									home-origin visitors, by census block
									group (quintiles). Gray areas had no
									estimated visitors.</p>`;
              } else {
                $$payload.out += "<!--[!-->";
              }
              $$payload.out += `<!--]-->`;
            } else {
              $$payload.out += "<!--[!-->";
            }
            $$payload.out += `<!--]-->`;
          }
          $$payload.out += `<!--]-->`;
        } else {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]-->`;
      } else {
        $$payload.out += "<!--[!-->";
        const each_array_6 = ensure_array_like(group.items);
        $$payload.out += `<!--[-->`;
        for (let $$index_5 = 0, $$length2 = each_array_6.length; $$index_5 < $$length2; $$index_5++) {
          let item = each_array_6[$$index_5];
          $$payload.out += `<label class="layer-toggle svelte-lyve1b"><span${attr_class("toggle-track svelte-lyve1b", void 0, { "on": isOn(group, item) })}><input type="checkbox"${attr("checked", isOn(group, item), true)} class="sr-only svelte-lyve1b"/> <span class="toggle-thumb svelte-lyve1b"></span></span> <span class="layer-label svelte-lyve1b">${escape_html(item.label)}</span></label>`;
        }
        $$payload.out += `<!--]-->`;
      }
      $$payload.out += `<!--]-->`;
    }
    $$payload.out += `<!--]--></div>`;
  }
  $$payload.out += `<!--]--></section> <div class="divider svelte-lyve1b"></div> <section class="panel-section svelte-lyve1b"><h2 class="section-heading svelte-lyve1b">Corridor Profile</h2> `;
  if (selectedCorridor) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p class="corridor-name svelte-lyve1b">${escape_html(selectedCorridor.name)}</p> <div class="stat-grid svelte-lyve1b"><div class="stat-card svelte-lyve1b"><span class="stat-label svelte-lyve1b">Monthly Foot Traffic</span> <span class="stat-value placeholder svelte-lyve1b">—</span></div> <div class="stat-card svelte-lyve1b"><span class="stat-label svelte-lyve1b">Catchment Radius</span> <span class="stat-value placeholder svelte-lyve1b">—</span></div> <div class="stat-card svelte-lyve1b"><span class="stat-label svelte-lyve1b">Equity Index</span> <span class="stat-value placeholder svelte-lyve1b">—</span></div> <div class="stat-card svelte-lyve1b"><span class="stat-label svelte-lyve1b">Transit Access</span> <span class="stat-value placeholder svelte-lyve1b">—</span></div></div>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<p class="empty-state svelte-lyve1b">Select a corridor above or click on the map to view its
				activity and demographic profile.</p>`;
  }
  $$payload.out += `<!--]--></section> <div class="divider svelte-lyve1b"></div> <section class="panel-section panel-section--grow svelte-lyve1b"><h2 class="section-heading svelte-lyve1b">Compare Corridors</h2> <p class="empty-state svelte-lyve1b">Side-by-side comparison of multiple selected corridors will appear
			here.</p></section></aside>`;
  bind_props($$props, { selectedCorridorId, layerState });
  pop();
}
function _page($$payload, $$props) {
  push();
  let layerState = makeInitialLayerState();
  let $$settled = true;
  let $$inner_payload;
  function $$render_inner($$payload2) {
    head($$payload2, ($$payload3) => {
      $$payload3.title = `<title>East Bay Business Corridor Map</title>`;
      $$payload3.out += `<meta name="description" content="East Bay business corridors project description."/> <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1"/>`;
    });
    $$payload2.out += `<div class="layout svelte-15eqz9a"><div class="panel-wrap svelte-15eqz9a">`;
    EastBayPanel($$payload2, {
      get layerState() {
        return layerState;
      },
      set layerState($$value) {
        layerState = $$value;
        $$settled = false;
      }
    });
    $$payload2.out += `<!----></div> <div class="map-wrap svelte-15eqz9a">`;
    EastBayMap($$payload2, { layerState });
    $$payload2.out += `<!----></div></div>`;
  }
  do {
    $$settled = true;
    $$inner_payload = copy_payload($$payload);
    $$render_inner($$inner_payload);
  } while (!$$settled);
  assign_payload($$payload, $$inner_payload);
  pop();
}
export {
  _page as default
};
