<div class="legend">
  <span class="legend-label">Results that week</span>
  <div class="scale">
    <span class="swatch c0"></span>
    <span class="swatch c1">1</span>
    <span class="swatch c2">2</span>
    <span class="swatch c3">3</span>
    <span class="swatch c4">4+</span>
  </div>
</div>

<style>
  .legend {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    color: var(--text-secondary);
  }

  .legend-label {
    white-space: nowrap;
  }

  .scale {
    display: flex;
    gap: 3px;
  }

  .swatch {
    width: 24px;
    height: 20px;
    border-radius: 5px;
    border: 1px solid var(--gridline);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 700;
  }

  .c0 {
    background: var(--surface-2);
  }
  .c1 {
    background: var(--cell-1);
    color: var(--cell-text-low);
    border-color: transparent;
  }
  .c2 {
    background: var(--cell-2);
    color: var(--cell-text-low);
    border-color: transparent;
  }
  .c3 {
    background: var(--cell-3);
    color: var(--cell-text-high);
    border-color: transparent;
  }
  .c4 {
    background: var(--cell-4);
    color: var(--cell-text-high);
    border-color: transparent;
  }
</style>
