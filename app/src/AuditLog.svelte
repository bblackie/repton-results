<script>
  import { onMount } from 'svelte';
  import { loadResults } from './lib/data.js';

  let auditEntries = [];
  let loading = true;
  let error = null;

  let studentQuery = '';
  let subjectFilter = 'all';
  let dateQuery = '';

  onMount(async () => {
    try {
      const data = await loadResults();
      auditEntries = data.auditEntries;
    } catch (e) {
      error = e.message || String(e);
    } finally {
      loading = false;
    }
  });

  $: subjects = [...new Set(auditEntries.map((e) => e.subject).filter(Boolean))].sort();

  $: filteredEntries = auditEntries
    .filter((e) => {
      const q = studentQuery.trim().toLowerCase();
      return !q || (e.studentName || '').toLowerCase().includes(q);
    })
    .filter((e) => subjectFilter === 'all' || e.subject === subjectFilter)
    .filter((e) => {
      const q = dateQuery.trim().toLowerCase();
      return !q || (e.dateLabel || '').toLowerCase().includes(q);
    })
    .sort((a, b) => (a.studentName || '').localeCompare(b.studentName || ''));

  function clearFilters() {
    studentQuery = '';
    subjectFilter = 'all';
    dateQuery = '';
  }

  $: hasActiveFilters = studentQuery.trim() !== '' || subjectFilter !== 'all' || dateQuery.trim() !== '';
</script>

<main>
  <header class="app-header">
    <div class="title-block">
      <a class="back-link" href="/index.html">&larr; Back to matrix</a>
      <h1>Audit Log</h1>
      <p class="subtitle">
        CSV rows that never became a counted NCEA result &mdash; non-standard result text or an
        unparseable publish date. Cross-check against <a href="/dorm-walk.html">Dorm Walk</a>'s
        result/record discrepancy flags.
      </p>
    </div>
    <nav class="header-links">
      <a class="dorm-walk-link" href="/assessments.html">Assessments &rarr;</a>
      <a class="dorm-walk-link" href="/dorm-walk.html">Dorm Walk &rarr;</a>
    </nav>
  </header>

  {#if loading}
    <div class="state-message">Loading results&hellip;</div>
  {:else if error}
    <div class="state-message error">Couldn't load results: {error}</div>
  {:else}
    <section class="controls-row">
      <label class="filter-field">
        <span>Student</span>
        <input type="text" placeholder="Search by name&hellip;" bind:value={studentQuery} />
      </label>

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
        <span>Date</span>
        <input type="text" placeholder="e.g. 25/08/2026" bind:value={dateQuery} />
      </label>

      {#if hasActiveFilters}
        <button type="button" class="clear-btn" on:click={clearFilters}>Clear filters</button>
      {/if}
    </section>

    <p class="result-summary">
      Showing {filteredEntries.length} of {auditEntries.length} non-standard row{auditEntries.length === 1 ? '' : 's'}
    </p>

    {#if filteredEntries.length}
      <div class="table-wrap">
        <table class="audit-table">
          <thead>
            <tr>
              <th class="col-student">Student</th>
              <th class="col-subject">Subject</th>
              <th class="col-module">Module</th>
              <th class="col-date">Date</th>
              <th class="col-result">Result text</th>
              <th class="col-reason">Why it's non-standard</th>
            </tr>
          </thead>
          <tbody>
            {#each filteredEntries as e (e.studentId + '|' + e.subject + '|' + e.title + '|' + e.dateLabel + '|' + e.resultText)}
              <tr>
                <td class="col-student">{e.studentName || '(no name)'}</td>
                <td class="col-subject">{e.subject || '—'}</td>
                <td class="col-module" title={e.title}>{e.title || '—'}</td>
                <td class="col-date">{e.dateLabel || '(blank)'}</td>
                <td class="col-result">{e.resultText || '(blank)'}</td>
                <td class="col-reason">{e.reason}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {:else}
      <p class="no-results">No non-standard rows match this search.</p>
    {/if}
  {/if}
</main>

<style>
  main {
    max-width: 1100px;
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
    max-width: 640px;
  }

  .subtitle a {
    color: var(--accent);
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

  .table-wrap {
    overflow-x: auto;
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
  }

  .audit-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  .audit-table th {
    text-align: left;
    font-weight: 600;
    color: var(--text-secondary);
    padding: 8px 10px;
    border-bottom: 1px solid var(--gridline);
    white-space: nowrap;
    position: sticky;
    top: 0;
    background: var(--surface-raised);
  }

  .audit-table td {
    padding: 7px 10px;
    border-bottom: 1px solid var(--gridline);
    color: var(--text-primary);
    vertical-align: top;
  }

  .audit-table tr:last-child td {
    border-bottom: none;
  }

  .col-student {
    white-space: nowrap;
    font-weight: 600;
  }

  .col-subject {
    white-space: nowrap;
  }

  .col-module {
    max-width: 260px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .col-date {
    white-space: nowrap;
    color: var(--text-secondary);
  }

  .col-result {
    white-space: nowrap;
    color: var(--text-secondary);
  }

  .col-reason {
    min-width: 260px;
    color: var(--critical);
  }

  @media print {
    .back-link,
    .header-links,
    .clear-btn {
      display: none;
    }
  }
</style>
