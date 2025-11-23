import { textSummary } from 'https://jslib.k6.io/k6-summary/0.0.3/index.js';

export function handleSummary(data) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    const jsonFile = 'tests/performance/results/summary-' + timestamp + '.json';
    const csvFile = 'tests/performance/results/summary-' + timestamp + '.csv';

    const metricsCsv = Object.entries(data.metrics)
        .map(([k, v]) => `${k},${v.type},${v.count || ''},${v.value || ''}`)
        .join('\n');

    return {
        stdout: textSummary(data, { indent: '→ ', enableColors: true }),
        [jsonFile]: JSON.stringify(data, null, 2),
        [csvFile]: metricsCsv,
    };
}