<script>
  export let label;
  export let value;
  export let tone = 'neutral'; // neutral | good | critical
</script>

<div class="tile tone-{tone}">
  <div class="tile-value">{value}</div>
  <div class="tile-label">{label}</div>
</div>

<style>
  .tile {
    background: var(--surface-raised);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 14px 16px;
    min-width: 128px;
  }

  .tile-value {
    font-size: 28px;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.1;
  }

  .tone-good .tile-value {
    color: var(--good);
  }

  .tone-critical .tile-value {
    color: var(--critical);
  }

  .tile-label {
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 4px;
  }
</style>
