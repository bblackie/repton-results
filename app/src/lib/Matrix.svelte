<script>
  import { createEventDispatcher } from 'svelte';
  import { GRADE_ORDER, getCell } from './data.js';

  export let students = [];
  export let cellIndex;
  export let weekKey;

  const dispatch = createEventDispatcher();

  const gradeSwatch = {
    Excellence: 'var(--grade-excellence)',
    Merit: 'var(--grade-merit)',
    Achieved: 'var(--grade-achieved)',
    'Not Achieved': 'var(--grade-not-achieved)',
  };

  let tooltip = null; // { x, y, studentName, grade, count, records }

  function cellData(index, wk, studentId, grade) {
    return wk ? getCell(index, wk, studentId, grade) : { count: 0, records: [] };
  }

  function countClass(count) {
    if (count <= 0) return 'c0';
    if (count === 1) return 'c1';
    if (count === 2) return 'c2';
    if (count === 3) return 'c3';
    return 'c4';
  }

  function showTooltip(e, student, grade, cell) {
    if (cell.count === 0) {
      tooltip = null;
      return;
    }
    tooltip = {
      x: e.clientX,
      y: e.clientY,
      studentName: student.name,
      grade,
      count: cell.count,
      subjects: [...new Set(cell.records.map((r) => r.subject))],
    };
  }

  function moveTooltip(e) {
    if (tooltip) {
      tooltip = { ...tooltip, x: e.clientX, y: e.clientY };
    }
  }

  function hideTooltip() {
    tooltip = null;
  }

  function selectCell(student, grade, cell) {
    if (cell.count === 0) return;
    dispatch('select', { student, grade, records: cell.records });
  }

  $: gridTemplateColumns = `172px repeat(${students.length}, minmax(30px, 1fr))`;
</script>

<div class="matrix-scroll">
  <div class="matrix-grid" style="grid-template-columns: {gridTemplateColumns};">
    {#each GRADE_ORDER as grade, gi}
      <div class="row-label" style="grid-row: {gi + 1}; grid-column: 1;">
        <span class="swatch" style="background: {gradeSwatch[grade]};"></span>
        <span class="row-label-text">{grade}</span>
      </div>
      {#each students as student, si}
        {@const cell = cellData(cellIndex, weekKey, student.id, grade)}
        <button
          type="button"
          class="cell {countClass(cell.count)}"
          style="grid-row: {gi + 1}; grid-column: {si + 2};"
          on:pointerenter={(e) => showTooltip(e, student, grade, cell)}
          on:pointermove={moveTooltip}
          on:pointerleave={hideTooltip}
          on:focus={(e) => showTooltip(e, student, grade, cell)}
          on:blur={hideTooltip}
          on:click={() => selectCell(student, grade, cell)}
          aria-label="{student.name}: {grade}, {cell.count} assessment{cell.count === 1 ? '' : 's'}"
        >
          {#if cell.count > 0}
            <span class="cell-value">{cell.count}</span>
          {/if}
        </button>
      {/each}
    {/each}

    <div class="corner" style="grid-row: {GRADE_ORDER.length + 1}; grid-column: 1;"></div>
    {#each students as student, si}
      <div class="student-label-cell" style="grid-row: {GRADE_ORDER.length + 1}; grid-column: {si + 2};">
        <span class="student-label">{student.name}</span>
      </div>
    {/each}
  </div>
</div>

{#if tooltip}
  <div class="cell-tooltip" style="left: {tooltip.x + 14}px; top: {tooltip.y + 14}px;">
    <div class="tooltip-value">{tooltip.count} assessment{tooltip.count === 1 ? '' : 's'}</div>
    <div class="tooltip-name">{tooltip.studentName} · {tooltip.grade}</div>
    <div class="tooltip-subjects">{tooltip.subjects.join(', ')}</div>
  </div>
{/if}

<style>
  .matrix-scroll {
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .matrix-grid {
    display: grid;
    grid-auto-rows: 52px;
    row-gap: 2px;
    column-gap: 2px;
    min-width: 100%;
    width: max-content;
    padding-right: 20px;
  }

  .row-label {
    position: sticky;
    left: 0;
    z-index: 2;
    background: var(--surface-1);
    display: flex;
    align-items: center;
    gap: 8px;
    padding-right: 12px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
    white-space: nowrap;
  }

  .swatch {
    width: 10px;
    height: 10px;
    border-radius: 3px;
    flex: none;
  }

  .cell {
    background: var(--surface-2);
    border: 1px solid var(--gridline);
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: default;
    padding: 0;
    transition: transform 0.08s ease, outline 0.08s ease;
    font: inherit;
  }

  .cell.c1,
  .cell.c2,
  .cell.c3,
  .cell.c4 {
    cursor: pointer;
  }

  .cell.c0 {
    background: var(--surface-2);
  }
  .cell.c1 {
    background: var(--cell-1);
  }
  .cell.c2 {
    background: var(--cell-2);
  }
  .cell.c3 {
    background: var(--cell-3);
  }
  .cell.c4 {
    background: var(--cell-4);
  }

  .cell.c1 .cell-value,
  .cell.c2 .cell-value {
    color: var(--cell-text-low);
  }
  .cell.c3 .cell-value,
  .cell.c4 .cell-value {
    color: var(--cell-text-high);
  }

  .cell:hover:not(.c0) {
    transform: scale(1.06);
    outline: 2px solid var(--text-primary);
    outline-offset: -2px;
    z-index: 1;
  }

  .cell:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 1px;
  }

  .cell-value {
    font-size: 14px;
    font-weight: 700;
  }

  .corner {
    position: sticky;
    left: 0;
    background: var(--surface-1);
    z-index: 2;
  }

  .student-label-cell {
    position: relative;
    height: 110px;
  }

  .student-label {
    position: absolute;
    top: 0;
    right: 6px;
    transform-origin: top right;
    transform: rotate(-48deg);
    white-space: nowrap;
    font-size: 12px;
    color: var(--text-secondary);
  }

  .cell-tooltip {
    position: fixed;
    z-index: 50;
    pointer-events: none;
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 8px 10px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
    max-width: 240px;
  }

  .tooltip-value {
    font-size: 13px;
    font-weight: 700;
    color: var(--text-primary);
  }

  .tooltip-name {
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 2px;
  }

  .tooltip-subjects {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 2px;
  }
</style>
