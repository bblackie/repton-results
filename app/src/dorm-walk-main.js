import './app.css';
import DormWalk from './DormWalk.svelte';

const app = new DormWalk({
  target: document.getElementById('app'),
});

export default app;
