<script>
  import { onMount } from 'svelte';
  import { loadResults } from './lib/data.js';
  import { DORM_ROSTER } from './lib/dormRoster.js';

  const COLUMNS = ['Not Achieved', 'Achieved', 'Merit', 'Excellence'];
  const COLUMN_LETTER = { 'Not Achieved': 'N', Achieved: 'A', Merit: 'M', Excellence: 'E' };
  const COLUMN_VAR = {
    'Not Achieved': '--grade-not-achieved',
    Achieved: '--grade-achieved',
    Merit: '--grade-merit',
    Excellence: '--grade-excellence',
  };

  let records = [];
  let rowCountByName = new Map();
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      const data = await loadResults();
      records = data.records;
      rowCountByName = data.rowCountByName || new Map();
    } catch (e) {
      error = e.message || String(e);
    } finally {
      loading = false;
    }
  });

  $: recordsByStudent = (() => {
    const map = new Map();
    for (const r of records) {
      if (!map.has(r.studentName)) map.set(r.studentName, []);
      map.get(r.studentName).push(r);
    }
    for (const list of map.values()) list.sort((a, b) => b.date - a.date);
    return map;
  })();

  function resultsFor(key) {
    if (!key) return [];
    return recordsByStudent.get(key) || [];
  }

  // Total CSV rows for this student, including ones that never became a
  // counted result (non-standard result text, unparseable date). Compared
  // against resultsFor(key).length to flag when the two disagree.
  function totalRecordsFor(key) {
    if (!key) return 0;
    return rowCountByName.get(key) || 0;
  }
</script>

<main>
  <header class="app-header">
    <div class="title-block">
      <a class="back-link" href="/index.html">&larr; Back to matrix</a>
      <h1>Dorm Walk</h1>
      <p class="subtitle">
        Room by room, in the order boys live in each dorm &mdash; most recent result first.
      </p>
    </div>
    <nav class="header-links">
      <a class="audit-link" href="/assessments.html">Assessments &rarr;</a>
      <a class="audit-link" href="/audit-log.html">Audit Log &rarr;</a>
    </nav>
  </header>

  {#if loading}
    <div class="state-message">Loading results&hellip;</div>
  {:else if error}
    <div class="state-message error">Couldn't load results: {error}</div>
  {:else}
    {#each DORM_ROSTER as dorm}
      <section class="dorm-section">
        <h2>{dorm.dorm} <span class="year-tag">{dorm.year}</span></h2>
        <div class="resident-list">
          {#each dorm.residents as resident}
            {@const results = resultsFor(resident.key)}
            {@const totalRecords = totalRecordsFor(resident.key)}
            {@const discrepancy = totalRecords - results.length}
            <article class="resident-card">
              <div class="resident-head">
                <span class="room-number">Rm {resident.room}</span>
                <span class="resident-name">{resident.display}</span>
                <span class="resident-meta">
                  <span class="result-count" class:zero={results.length === 0}>
                    {results.length} result{results.length === 1 ? '' : 's'}
                  </span>
                  <span class="record-count" class:mismatch={discrepancy !== 0}>
                    {totalRecords} record{totalRecords === 1 ? '' : 's'}
                  </span>
                  {#if discrepancy !== 0}
                    <span
                      class="discrepancy-flag"
                      title={`${totalRecords} CSV row${totalRecords === 1 ? '' : 's'} for this student but only ${results.length} counted as NCEA result${results.length === 1 ? '' : 's'} — ${discrepancy} row${Math.abs(discrepancy) === 1 ? '' : 's'} have non-standard result text or an unparseable date and ${Math.abs(discrepancy) === 1 ? 'is' : 'are'} being silently dropped`}
                    >&#9888; {discrepancy} not counted</span>
                  {/if}
                </span>
                {#if resident.note}
                  <span class="resident-note" title={resident.note}>&#9888; verify</span>
                {/if}
              </div>

              {#if results.length}
                <table class="result-table">
                  <thead>
                    <tr>
                      <th class="col-date">Date</th>
                      <th class="col-subject">Subject</th>
                      <th class="col-module">Module</th>
                      <th class="col-short-desc">Short Desc</th>
                      <th class="col-type">Type</th>
                      {#each COLUMNS as col}
                        <th class="col-grade" style="color: var({COLUMN_VAR[col]});">{COLUMN_LETTER[col]}</th>
                      {/each}
                    </tr>
                  </thead>
                  <tbody>
                    {#each results as r (r.studentId + r.week + r.subject + r.title + r.dateLabel)}
                      <tr>
                        <td class="col-date">{r.dateLabel}</td>
                        <td class="col-subject" title={r.title}>{r.subject}</td>
                        <td class="col-module" title={r.title}>{r.moduleNumber || '—'}</td>
                        <td class="col-short-desc" title={r.title}>{r.shortDesc || '—'}</td>
                        <td class="col-type" title={r.title}>{r.type || 'Test'}</td>
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
              {:else}
                <p class="no-results">No NCEA results recorded this year.</p>
              {/if}
            </article>
          {/each}
        </div>
      </section>
    {/each}
  {/if}
</main>

<style>
  main {
    max-width: 900px;
    margin: 0 auto;
    padding: 32px 24px 64px;
  }

  .app-header {
    margin-bottom: 28px;
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

  .audit-link {
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

  .audit-link:hover {
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

  .dorm-section {
    margin-bottom: 36px;
  }

  .dorm-section h2 {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  .year-tag {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
  }

  .resident-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .resident-card {
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 12px 14px;
    break-inside: avoid;
  }

  .resident-head {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 8px;
  }

  .room-number {
    font-size: 11px;
    font-weight: 700;
    color: var(--text-muted);
    background: var(--surface-2);
    border-radius: var(--radius-sm);
    padding: 2px 6px;
  }

  .resident-name {
    font-size: 15px;
    font-weight: 700;
    color: var(--text-primary);
  }

  .resident-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
  }

  .result-count,
  .record-count {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    background: var(--surface-2);
    border-radius: var(--radius-sm);
    padding: 2px 6px;
    white-space: nowrap;
  }

  .result-count.zero {
    color: var(--critical);
  }

  .record-count.mismatch {
    color: var(--critical);
  }

  .discrepancy-flag {
    font-size: 12px;
    font-weight: 700;
    color: var(--critical);
    cursor: help;
    white-space: nowrap;
  }

  .resident-note {
    font-size: 12px;
    color: var(--warning);
    cursor: help;
  }

  .no-results {
    margin: 0;
    font-size: 13px;
    color: var(--text-muted);
  }

  .result-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }

  .result-table th {
    text-align: left;
    font-weight: 600;
    color: var(--text-secondary);
    padding: 4px 6px;
    border-bottom: 1px solid var(--gridline);
  }

  .result-table td {
    padding: 3px 6px;
    border-bottom: 1px solid var(--gridline);
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .result-table tr:last-child td {
    border-bottom: none;
  }

  .col-date {
    width: 78px;
    color: var(--text-secondary);
  }

  .col-subject {
    max-width: 50px;
    width: 50px;
  }

  .col-module {
    width: 52px;
    white-space: nowrap;
  }

  .col-short-desc {
    width: 74px;
    white-space: nowrap;
  }

  .col-type {
    width: 48px;
    white-space: nowrap;
  }

  .col-grade {
    width: 30px;
    text-align: center;
  }

  .mark {
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 4px;
  }

  @media print {
    .back-link,
    .header-links {
      display: none;
    }

    .resident-card {
      page-break-inside: avoid;
    }
  }
</style>
