<script>

</script>

<aside class="panel">
    <!-- ── Header ─────────────────────────────────────────────────────── -->
    <header class="panel-header">
        <span class="header-org">School of Cities | East Bay</span>
        <h1 class="header-title">
            Equitable Development Data Insight Training (EDDIT)
        </h1>
        <p class="header-authors">Author One, Author Two &middot; 2026</p>
    </header>

    <!-- ── Corridor Selector ────────────────────────────────────────────── -->
    <section class="panel-section">
       
    </section>

    <div class="divider"></div>
    <!-- ── Corridor Description ──────────────────────────────────────────── -->
    <section class="panel-section">
       
    </section>

    <div class="divider"></div>
    <!-- ── Layer Toggles ─────────────────────────────────────────────── -->
    <section class="panel-section">
       
    </section>

    <div class="divider"></div>

    <!-- ── Corridor Profile ─────────────────────────────────────────────── -->
    <section class="panel-section">
       
    </section>

    <div class="divider"></div>

    <!-- ── Compare ───────────────────────────────────────────────────── -->
    <section class="panel-section panel-section--grow">
       
    </section>
</aside>

<style>
    /* ── Container ──────────────────────────────────────────────────────── */

    .panel {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background: #ffffff;
        color: var(--brandBlack);
        font-family: OpenSans, sans-serif;
        font-size: 0.8rem;
        overflow-y: auto;
        overflow-x: hidden;
        scrollbar-width: thin;
        scrollbar-color: var(--brandGray) transparent;
    }

    /* ── Header ─────────────────────────────────────────────────────────── */

    .panel-header {
        flex-shrink: 0;
        padding: 16px 16px 14px;
        background: var(--brandDarkBlue);
        color: #fff;
    }

    .header-org {
        display: block;
        font-family: TradeGothic, sans-serif;
        font-size: 0.65rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: var(--brandLightBlue);
        margin-bottom: 6px;
    }

    .header-title {
        font-family: TradeGothicBold, sans-serif;
        font-size: 1.05rem;
        line-height: 1.25;
        margin: 0 0 10px;
        color: #fff;
    }

    .header-authors {
        font-size: 0.7rem;
        color: rgba(255, 255, 255, 0.6);
        margin: 0;
        line-height: 1.4;
    }

    /* ── Sections ───────────────────────────────────────────────────────── */

    .divider {
        height: 1px;
        background: var(--brandGray);
        flex-shrink: 0;
    }

    .panel-section {
        padding: 14px 16px;
        flex-shrink: 0;
    }

    /* Let the last section expand to fill remaining height */
    .panel-section--grow {
        flex: 1;
    }

    .section-heading {
        font-family: TradeGothicBold, sans-serif;
        font-size: 0.68rem;
        text-transform: uppercase;
        letter-spacing: 0.07em;
        color: var(--brandDarkBlue);
        margin: 0 0 8px;
    }

    .section-desc {
        font-size: 0.73rem;
        color: var(--brandGray60);
        margin: 0 0 10px;
        line-height: 1.45;
    }

    .empty-state {
        font-size: 0.73rem;
        color: var(--brandGray60);
        line-height: 1.5;
        font-style: italic;
        margin: 0;
    }

    /* ── Venue Select ───────────────────────────────────────────────────── */

    .select-wrapper {
        position: relative;
    }

    .layer-select {
        font-size: 0.75rem;
    }

    .corridor-select {
        width: 100%;
        padding: 7px 28px 7px 10px;
        font-family: OpenSans, sans-serif;
        font-size: 0.78rem;
        border: 1px solid var(--brandGray);
        border-radius: 4px;
        background: #fff;
        color: var(--brandBlack);
        appearance: none;
        -webkit-appearance: none;
        cursor: pointer;
        outline: none;
        transition:
            border-color 0.15s,
            box-shadow 0.15s;
        box-sizing: border-box;
    }

    .corridor-select:focus {
        border-color: var(--brandMedBlue);
        box-shadow: 0 0 0 2px rgba(0, 127, 163, 0.18);
    }

    .select-arrow {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        width: 10px;
        height: 6px;
        fill: var(--brandDarkBlue);
        pointer-events: none;
    }

    /* ── Layer Toggles ──────────────────────────────────────────────────── */

    .layer-group {
        margin-bottom: 10px;
    }

    .layer-group:last-child {
        margin-bottom: 0;
    }

    .layer-group-label {
        display: block;
        font-size: 0.65rem;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--brandGray60);
        margin-bottom: 5px;
    }

    .layer-toggle {
        display: flex;
        align-items: center;
        gap: 9px;
        padding: 4px 0;
        cursor: pointer;
        user-select: none;
    }

    .layer-toggle-disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    /* Screen-reader only — visually hidden checkbox */
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip: rect(0 0 0 0);
        white-space: nowrap;
    }

    /* Toggle pill */
    .toggle-track {
        position: relative;
        display: inline-flex;
        align-items: center;
        width: 30px;
        height: 16px;
        border-radius: 8px;
        background: var(--brandGray);
        flex-shrink: 0;
        transition: background 0.2s;
        cursor: pointer;
    }

    .toggle-track.on {
        background: var(--brandMedBlue);
    }

    .toggle-thumb {
        position: absolute;
        left: 2px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #fff;
        transition: left 0.2s;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }

    .toggle-track.on .toggle-thumb {
        left: 16px;
    }

    .layer-label {
        font-size: 0.77rem;
        color: var(--brandBlack);
        line-height: 1.3;
    }

    .activity-grid {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
    }

    .activity-btn {
        border: 1px solid var(--brandGray);
        background: #fff;
        color: var(--brandGray70);
        padding: 5px 8px;
        font-size: 0.7rem;
        font-family: OpenSans, sans-serif;
        border-radius: 999px;
        line-height: 1.2;
        cursor: pointer;
        transition: all 0.15s ease;
    }

    .activity-btn.active {
        background: var(--brandMedBlue);
        border-color: var(--brandMedBlue);
        color: #fff;
    }

    /* ── Venue Description ──────────────────────────────────────────────── */

    .cd-name {
        font-family: TradeGothicBold, sans-serif;
        font-size: 0.92rem;
        color: var(--brandDarkBlue);
        margin: 0 0 4px;
        line-height: 1.25;
    }

    .cd-address {
        font-size: 0.72rem;
        color: var(--brandGray60);
        margin: 0 0 10px;
        line-height: 1.4;
    }

    .cd-body {
        font-size: 0.75rem;
        color: var(--brandBlack);
        line-height: 1.55;
        margin: 0;
        font-style: italic;
        opacity: 0.65;
    }

    /* ── Venue Profile ──────────────────────────────────────────────────── */

    .corridor-name {
        font-family: TradeGothicBold, sans-serif;
        font-size: 0.88rem;
        color: var(--brandDarkBlue);
        margin: 0 0 10px;
    }

    .stat-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
    }

    .stat-card {
        background: #f4f5f7;
        border-radius: 4px;
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .stat-label {
        font-size: 0.65rem;
        color: var(--brandGray60);
        text-transform: uppercase;
        letter-spacing: 0.04em;
        line-height: 1.3;
    }

    .stat-value {
        font-family: TradeGothicBold, sans-serif;
        font-size: 1rem;
        color: var(--brandDarkBlue);
    }

    .stat-value.placeholder {
        color: var(--brandGray);
    }

    .legend {
        margin-top: 0.5rem;
        display: block;
    }
</style>
