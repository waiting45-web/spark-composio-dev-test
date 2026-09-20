declare const __BUILD_TIMESTAMP__: string;

const app = document.querySelector<HTMLDivElement>('#app');

if (app) {
  const timestamp = typeof __BUILD_TIMESTAMP__ !== 'undefined' ? __BUILD_TIMESTAMP__ : new Date().toISOString();
  app.innerHTML = `
    <div class="card">
      <h1 id="pipeline-title">Spark + Composio Dev Pipeline</h1>
      <p class="meta-item">Status: <span class="badge" id="pipeline-status">Active &amp; Verified</span></p>
      <p class="meta-item">Build Timestamp: <code id="build-timestamp">${timestamp}</code></p>
      <p class="meta-item">Commit SHA: <code id="commit-sha">PENDING_COMMIT</code></p>
    </div>
  `;
}
