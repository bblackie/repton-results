import './app.css';
import Assessments from './Assessments.svelte';

const app = new Assessments({
  target: document.getElementById('app'),
});

export default app;
