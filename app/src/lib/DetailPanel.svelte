<script>
  export let selection = null; // { student, grade, records }

  function close() {
    selection = null;
  }
</script>

{#if selection}
  <aside class="panel" aria-label="Assessment details">
    <div class="panel-head">
      <div>
        <div class="panel-grade">{selection.grade}</div>
        <div class="panel-student">{selection.student.name}</div>
      </div>
      <button class="close-btn" on:click={close} aria-label="Close details">×</button>
    </div>

    <ul class="record-list">
      {#each selection.records as r}
        <li class="record">
          <div class="record-top">
            <span class="record-subject">{r.subject}</span>
            <span class="record-date">{r.dateLabel}</span>
          </div>
          <div class="record-title">{r.title}</div>
          <div class="record-meta">{r.teacher} · {r.resultText}</div>
          {#if r.comment}
            <p class="record-comment">{r.comment}</p>
          {/if}
        </li>
      {/each}
    </ul>
  </aside>
{/if}

<style>
  .panel {
    width: 320px;
    flex: none;
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 18px;
    max-height: calc(100vh - 220px);
    overflow-y: auto;
    position: sticky;
    top: 24px;
  }

  .panel-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 14px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--gridline);
  }

  .panel-grade {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--text-muted);
  }

  .panel-student {
    font-size: 17px;
    font-weight: 700;
    color: var(--text-primary);
    margin-top: 2px;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 20px;
    line-height: 1;
    color: var(--text-muted);
    cursor: pointer;
    padding: 2px 6px;
    border-radius: var(--radius-sm);
  }

  .close-btn:hover {
    background: var(--surface-2);
    color: var(--text-primary);
  }

  .record-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .record {
    padding-bottom: 14px;
    border-bottom: 1px solid var(--gridline);
  }

  .record:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  .record-top {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: var(--text-muted);
    margin-bottom: 4px;
  }

  .record-subject {
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .record-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .record-meta {
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 2px;
  }

  .record-comment {
    font-size: 12px;
    color: var(--text-secondary);
    margin: 8px 0 0;
    line-height: 1.5;
  }
</style>
