<script>
  export let weeks = [];
  export let index = 0;

  $: current = weeks[index];

  function step(delta) {
    const next = index + delta;
    if (next >= 0 && next < weeks.length) index = next;
  }

  function onInput(e) {
    index = Number(e.target.value);
  }

  function onKeydown(e) {
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  }
</script>

<div class="slider-block">
  <div class="slider-head">
    <div class="slider-title">
      <span class="week-count">Week {index + 1} of {weeks.length}</span>
      <span class="week-range">{current ? current.label : ''}</span>
    </div>
    <div class="slider-controls">
      <button class="nav-btn" on:click={() => step(-1)} disabled={index === 0} aria-label="Previous week">
        ‹
      </button>
      <button class="nav-btn" on:click={() => step(1)} disabled={index === weeks.length - 1} aria-label="Next week">
        ›
      </button>
    </div>
  </div>

  <input
    class="range"
    type="range"
    min="0"
    max={Math.max(weeks.length - 1, 0)}
    step="1"
    value={index}
    on:input={onInput}
    on:keydown={onKeydown}
    aria-label="Select week"
  />

  <div class="ticks" aria-hidden="true">
    {#each weeks as w, i}
      <div class="tick" class:active={i === index} style="left: {weeks.length > 1 ? (i / (weeks.length - 1)) * 100 : 0}%"></div>
    {/each}
  </div>
</div>

<style>
  .slider-block {
    width: 100%;
  }

  .slider-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .slider-title {
    display: flex;
    align-items: baseline;
    gap: 10px;
  }

  .week-count {
    font-weight: 600;
    font-size: 15px;
    color: var(--text-primary);
  }

  .week-range {
    font-size: 13px;
    color: var(--text-secondary);
  }

  .slider-controls {
    display: flex;
    gap: 6px;
  }

  .nav-btn {
    width: 30px;
    height: 30px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background: var(--surface-raised);
    color: var(--text-primary);
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.12s ease;
  }

  .nav-btn:hover:not(:disabled) {
    background: var(--surface-2);
  }

  .nav-btn:disabled {
    opacity: 0.35;
    cursor: default;
  }

  .range {
    width: 100%;
    appearance: none;
    -webkit-appearance: none;
    height: 4px;
    border-radius: 2px;
    background: var(--gridline);
    outline: none;
    margin: 0;
  }

  .range::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--accent);
    border: 2px solid var(--surface-raised);
    box-shadow: 0 0 0 1px var(--accent);
    cursor: pointer;
    margin-top: -6px;
  }

  .range::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: var(--accent);
    border: 2px solid var(--surface-raised);
    box-shadow: 0 0 0 1px var(--accent);
    cursor: pointer;
  }

  .range::-webkit-slider-runnable-track {
    height: 4px;
    border-radius: 2px;
    background: var(--gridline);
  }

  .ticks {
    position: relative;
    height: 6px;
    margin-top: 4px;
  }

  .tick {
    position: absolute;
    top: 0;
    width: 2px;
    height: 6px;
    background: var(--baseline);
    transform: translateX(-1px);
  }

  .tick.active {
    background: var(--accent);
  }
</style>
