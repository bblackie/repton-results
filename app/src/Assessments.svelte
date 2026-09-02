<script>
  import { onMount } from 'svelte';
  import { loadResults } from './lib/data.js';

  const COLUMNS = ['Not Achieved', 'Achieved', 'Merit', 'Excellence'];
  const COLUMN_LETTER = { 'Not Achieved': 'N', Achieved: 'A', Merit: 'M', Excellence: 'E' };
  const COLUMN_VAR = {
    'Not Achieved': '--grade-not-achieved',
    Achieved: '--grade-achieved',
    Merit: '--grade-merit',
    Excellence: '--grade-excellence',
  };

  let records = [];
  let loading = true;
  let error = null;

  let subjectFilter = 'all';
  let levelFilter = 'all';
  let teacherFilter = 'all';
  let titleQuery = '';

  onMount(async () => {
    try {
      const data = await loadResults();
      records = data.records;
    } catch (e) {
      error = e.message || String(e);
    } finally {
      loading = false;
    }
  });

  $: subjects = [...new Set(records.map((r) => r.subject).filter(Boolean))].sort();
  $: teachers = [...new Set(records.map((r) => r.teacher).filter(Boolean))].sort();
  $: yearLevels = [...new Set(records.map((r) => r.yearLevel).filter(Boolean))].sort(
    (a, b) => Number(a) - Number(b)
  );

  $: levelRecords = levelFilter === 'all' ? records : records.filter((r) => r.yearLevel === levelFilter);

  $: assessments = (() => {
    const map = new Map();
    for (const r of levelRecords) {
      const key = [r.subject, r.moduleNumber, r.title, r.teacher, r.dateLabel].join('|');
      if (!map.has(key)) {
        map.set(key, {
          key,
          subject: r.subject,
          moduleNumber: r.moduleNumber,
          shortDesc: r.shortDesc,
          title: r.title,
          type: r.type,
          teacher: r.teacher,
          date: r.date,
          dateLabel: r.dateLabel,
          results: [],
          counts: { 'Not Achieved': 0, Achieved: 0, Merit: 0, Excellence: 0 },
        });
      }
      const a = map.get(key);
      a.results.push(r);
      if (a.counts[r.grade] !== undefined) a.counts[r.grade] += 1;
    }
    for (const a of map.values()) {
      a.results.sort((x, y) => x.studentName.localeCompare(y.studentName));
    }
    return [...map.values()].sort((a, b) => b.date - a.date);
  })();

  $: filteredAssessments = assessments
    .filter((a) => subjectFilter === 'all' || a.subject === subjectFilter)
    .filter((a) => teacherFilter === 'all' || a.teacher === teacherFilter)
    .filter((a) => {
      const q = titleQuery.trim().toLowerCase();
      return !q || (a.title || '').toLowerCase().includes(q);
    });

  function clearFilters() {
    subjectFilter = 'all';
    levelFilter = 'all';
    teacherFilter = 'all';
    titleQuery = '';
  }

  $: hasActiveFilters =
    subjectFilter !== 'all' || levelFilter !== 'all' || teacherFilter !== 'all' || titleQuery.trim() !== '';
</script>

<main>
  <header class="app-header">
    <div class="title-block">
      <a class="back-link" href="/index.html">&larr; Back to matrix</a>
      <h1>Assessments</h1>
      <p class="subtitle">Every assessment, most recent first, with every student's result.</p>
    </div>
    <nav class="header-links">
      <a class="header-link" href="/dorm-walk.html">Dorm Walk &rarr;</a>
      <a class="header-link" href="/audit-log.html">Audit Log &rarr;</a>
    </nav>
  </header>

  {#if loading}
    <div class="state-message">Loading results&hellip;</div>
  {:else if error}
    <div class="state-message error">Couldn't load results: {error}</div>
  {:else}
    <section class="controls-row">
      <label class="filter-field">
        <span>Subject</span>
        <select bind:value={subjectFilter}>
          <option value="all">All subjects</option>
          {#each subjects as s}
            <option value={s}>{s}</option>
          {/each}
        </select>
      </label>

      <label class="filter-field">
        <span>Year group</span>
        <select bind:value={levelFilter}>
          <option value="all">All year groups</option>
          {#each yearLevels as l}
            <option value={l}>Year {l}</option>
          {/each}
        </select>
      </label>

      <label class="filter-field">
        <span>Teacher</span>
        <select bind:value={teacherFilter}>
          <option value="all">All teachers</option>
          {#each teachers as t}
            <option value={t}>{t}</option>
          {/each}
        </select>
      </label>

      <label class="filter-field">
        <span>Title</span>
        <input type="text" placeholder="Search title&hellip;" bind:value={titleQuery} />
      </label>

      {#if hasActiveFilters}
        <button type="button" class="clear-btn" on:click={clearFilters}>Clear filters</button>
      {/if}
    </section>

    <p class="result-summary">
      Showing {filteredAssessments.length} of {assessments.length} assessment{assessments.length === 1 ? '' : 's'}
    </p>

    {#if filteredAssessments.length}
      <div class="assessment-list">
        {#each filteredAssessments as a (a.key)}
          <article class="assessment-card">
            <div class="assessment-head">
              <h2>{a.title}</h2>
              <span class="date-tag">{a.dateLabel}</span>
            </div>
            <div class="meta-row">
              <span class="meta-pill">{a.subject}</span>
              {#if a.moduleNumber}<span class="meta-pill">Module {a.moduleNumber}</span>{/if}
              {#if a.shortDesc}<span class="meta-pill">{a.shortDesc}</span>{/if}
              <span class="meta-pill">{a.type || 'Test'}</span>
              {#if a.teacher}<span class="meta-pill">{a.teacher}</span>{/if}
              <span class="meta-pill count-pill">
                {a.results.length} student{a.results.length === 1 ? '' : 's'}
              </span>
              {#each COLUMNS as col}
                {#if a.counts[col]}
                  <span class="meta-pill grade-pill" style="color: var({COLUMN_VAR[col]});">
                    {a.counts[col]} {COLUMN_LETTER[col]}
                  </span>
                {/if}
              {/each}
            </div>

            <table class="result-table">
              <thead>
                <tr>
                  <th class="col-student">Student</th>
                  {#each COLUMNS as col}
                    <th class="col-grade" style="color: var({COLUMN_VAR[col]});">{COLUMN_LETTER[col]}</th>
                  {/each}
                </tr>
              </thead>
              <tbody>
                {#each a.results as r (r.studentId)}
                  <tr>
                    <td class="col-student" title={r.comment || ''}>{r.studentName}</td>
                    {#each COLUMNS as col}
                      <td class="col-grade">
                        {#if r.grade === col}
                          <span class="mark" style="background: var({COLUMN_VAR[col]});"></span>
                        {/if}
                      </td>
                    {/each}
                  </tr>
                {/each}
              </tbody>
            </table>
          </article>
        {/each}
      </div>
    {:else}
      <p class="no-results">No assessments match this search.</p>
    {/if}
  {/if}
</main>

<style>
  main {
    max-width: 900px;
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

  .header-link {
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

  .header-link:hover {
    background: var(--surface-2);
  }

  .back-link {
    display: inline-block;
    font-size: 13px;
    color: var(--accent);
    text-decoration: none;
    margin-bottom: 10px;
  }

  .back-link:hover {
    text-decoration: underline;
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
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 16px;
    margin-bottom: 16px;
    padding: 14px 16px;
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
  }

  .filter-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
  }

  .filter-field input,
  .filter-field select {
    font: inherit;
    font-size: 13px;
    padding: 6px 8px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background: var(--surface-1);
    color: var(--text-primary);
    min-width: 180px;
  }

  .filter-field input:focus,
  .filter-field select:focus {
    outline: 2px solid var(--accent);
    outline-offset: 1px;
  }

  .clear-btn {
    font: inherit;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    background: transparent;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 6px 12px;
    cursor: pointer;
  }

  .clear-btn:hover {
    background: var(--surface-2);
    color: var(--text-primary);
  }

  .result-summary {
    margin: 0 0 12px;
    font-size: 13px;
    color: var(--text-muted);
  }

  .no-results {
    margin: 0;
    padding: 24px;
    text-align: center;
    font-size: 13px;
    color: var(--text-muted);
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
  }

  .assessment-list {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .assessment-card {
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 16px 18px;
    break-inside: avoid;
  }

  .assessment-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
  }

  .assessment-head h2 {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
  }

  .date-tag {
    flex: none;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
    white-space: nowrap;
  }

  .meta-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
  }

  .meta-pill {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    background: var(--surface-2);
    border-radius: var(--radius-sm);
    padding: 3px 8px;
    white-space: nowrap;
  }

  .grade-pill {
    background: transparent;
    border: 1px solid var(--gridline);
  }

  .result-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  .result-table th {
    text-align: left;
    font-weight: 600;
    color: var(--text-secondary);
    padding: 5px 8px;
    border-bottom: 1px solid var(--gridline);
  }

  .result-table td {
    padding: 5px 8px;
    border-bottom: 1px solid var(--gridline);
    color: var(--text-primary);
  }

  .result-table tr:last-child td {
    border-bottom: none;
  }

  .col-student {
    width: auto;
  }

  .col-grade {
    width: 36px;
    text-align: center;
  }

  .mark {
    display: inline-block;
    width: 18px;
    height: 18px;
    border-radius: 4px;
  }

  @media print {
    .back-link,
    .header-links,
    .clear-btn {
      display: none;
    }

    .assessment-card {
      page-break-inside: avoid;
    }
  }
</style>
