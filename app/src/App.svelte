<script>
  import { onMount } from 'svelte';
  import { loadResults, buildCellIndex, GRADE_ORDER } from './lib/data.js';
  import WeekSlider from './lib/WeekSlider.svelte';
  import Matrix from './lib/Matrix.svelte';
  import Legend from './lib/Legend.svelte';
  import DetailPanel from './lib/DetailPanel.svelte';
  import StatTile from './lib/StatTile.svelte';

  let students = [];
  let weeks = [];
  let subjects = [];
  let yearLevels = [];
  let records = [];
  let loading = true;
  let error = null;

  let subjectFilter = 'all';
  let levelFilter = 'all';
  let weekIndex = 0;
  let selection = null;

  onMount(async () => {
    try {
      const data = await loadResults();
      students = data.students;
      weeks = data.weeks;
      subjects = data.subjects;
      yearLevels = data.yearLevels;
      records = data.records;
      weekIndex = weeks.length ? weeks.length - 1 : 0;
    } catch (e) {
      error = e.message || String(e);
    } finally {
      loading = false;
    }
  });

  $: filteredStudents =
    levelFilter === 'all' ? students : students.filter((s) => s.yearLevel === levelFilter);

  $: filteredRecords = records
    .filter((r) => subjectFilter === 'all' || r.subject === subjectFilter)
    .filter((r) => levelFilter === 'all' || r.yearLevel === levelFilter);

  $: cellIndex = buildCellIndex(filteredRecords);

  $: currentWeek = weeks[weekIndex];

  $: weekRecords = currentWeek ? filteredRecords.filter((r) => r.week === currentWeek.key) : [];

  $: excellenceMeritCount = weekRecords.filter((r) => r.grade === 'Excellence' || r.grade === 'Merit').length;
  $: notAchievedCount = weekRecords.filter((r) => r.grade === 'Not Achieved').length;
  $: excellenceMeritRate = weekRecords.length
    ? Math.round((excellenceMeritCount / weekRecords.length) * 100)
    : 0;

  $: {
    weekIndex;
    subjectFilter;
    levelFilter;
    selection = null;
  }

  function handleSelect(e) {
    selection = e.detail;
  }

  $: if (weeks.length) {
    // clamp when data first loads or filter changes shrink range
    weekIndex = Math.min(weekIndex, weeks.length - 1);
  }
</script>

<main>
  <header class="app-header">
    <div class="title-block">
      <h1>Repton Results</h1>
      <p class="subtitle">Weekly assessment outcomes by student — Not Achieved, Achieved, Merit, Excellence</p>
    </div>
    <nav class="header-links">
      <a class="dorm-walk-link" href="/dorm-walk.html">Dorm Walk &rarr;</a>
      <a class="dorm-walk-link" href="/audit-log.html">Audit Log &rarr;</a>
    </nav>
  </header>

  {#if loading}
    <div class="state-message">Loading results…</div>
  {:else if error}
    <div class="state-message error">Couldn't load results: {error}</div>
  {:else if !weeks.length}
    <div class="state-message">No gradeable results found in the data set.</div>
  {:else}
    <section class="controls-row">
      <label class="subject-filter">
        <span>Subject</span>
        <select bind:value={subjectFilter}>
          <option value="all">All subjects</option>
          {#each subjects as s}
            <option value={s}>{s}</option>
          {/each}
        </select>
      </label>

      <label class="subject-filter">
        <span>Year level</span>
        <select bind:value={levelFilter}>
          <option value="all">All year levels</option>
          {#each yearLevels as l}
            <option value={l}>Year {l}</option>
          {/each}
        </select>
      </label>

      <div class="slider-wrap">
        <WeekSlider {weeks} bind:index={weekIndex} />
      </div>
    </section>

    <section class="stats-row">
      <StatTile label="Results this week" value={weekRecords.length} />
      <StatTile label="Merit + Excellence" value="{excellenceMeritRate}%" tone="good" />
      <StatTile label="Not Achieved" value={notAchievedCount} tone={notAchievedCount > 0 ? 'critical' : 'neutral'} />
    </section>

    <section class="matrix-section">
      <div class="matrix-card">
        <div class="matrix-card-head">
          <Legend />
        </div>
        <Matrix students={filteredStudents} {cellIndex} weekKey={currentWeek?.key} on:select={handleSelect} />
      </div>

      <DetailPanel bind:selection />
    </section>
  {/if}
</main>

<style>
  main {
    max-width: 1240px;
    margin: 0 auto;
    padding: 32px 24px 64px;
  }

  .app-header {
    margin-bottom: 24px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
  }

  .header-links {
    display: flex;
    gap: 8px;
    flex: none;
  }

  .dorm-walk-link {
    flex: none;
    font-size: 13px;
    font-weight: 600;
    color: var(--accent);
    text-decoration: none;
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--surface-raised);
    white-space: nowrap;
  }

  .dorm-walk-link:hover {
    background: var(--surface-2);
  }

  h1 {
    font-size: 26px;
    font-weight: 700;
    margin: 0;
    color: var(--text-primary);
  }

  .subtitle {
    margin: 6px 0 0;
    color: var(--text-secondary);
    font-size: 14px;
  }

  .state-message {
    padding: 40px;
    text-align: center;
    color: var(--text-secondary);
  }

  .state-message.error {
    color: var(--critical);
  }

  .controls-row {
    display: flex;
    align-items: flex-end;
    gap: 32px;
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 18px 20px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .subject-filter {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 12px;
    color: var(--text-secondary);
    flex: none;
  }

  .subject-filter select {
    font: inherit;
    font-size: 14px;
    padding: 7px 10px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background: var(--surface-1);
    color: var(--text-primary);
    min-width: 160px;
  }

  .slider-wrap {
    flex: 1 1 360px;
    min-width: 280px;
  }

  .stats-row {
    display: flex;
    gap: 14px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .matrix-section {
    display: flex;
    gap: 20px;
    align-items: flex-start;
  }

  .matrix-card {
    flex: 1;
    min-width: 0;
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 20px;
  }

  .matrix-card-head {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 14px;
  }
</style>
