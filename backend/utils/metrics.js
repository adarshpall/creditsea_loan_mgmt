let metrics = {
  received: 0,
  processed: 0,
  errors: 0,
  logs: [],
};

function addError({ loan, error }) {
  metrics.errors++;
  metrics.logs.push({ loan, error, timestamp: new Date() });
}

function getMetrics() {
  return metrics;
}

function resetMetrics() {
  metrics = { received: 0, processed: 0, errors: 0, logs: [] };
}

function broadcastMetrics(wss) {
  const interval = setInterval(() => {
    const message = JSON.stringify({ type: 'metrics', payload: metrics });
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(message);
      }
    });
  }, 1000); // Every second
  return () => clearInterval(interval);
}

function sendMetricsNow(wss) {
  const message = JSON.stringify({ type: 'metrics', payload: metrics });
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}

module.exports = {
  metrics,
  addError,
  getMetrics,
  resetMetrics,
  broadcastMetrics,
  sendMetricsNow,
};
