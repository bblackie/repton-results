import './app.css';
import AuditLog from './AuditLog.svelte';

const app = new AuditLog({
  target: document.getElementById('app'),
});

export default app;
