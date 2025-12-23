# Chat Load Testing (WebSocket + Kafka) - Initial Phase

**Environment:** Local Docker, M1 Max  
**Users simulated:** up to 5,000 concurrent virtual users (VUs)  
**Test tools:** k6 + Prometheus (remote write) + Grafana (dashboard)

## Metrics

| Metric                   | Value          |
|--------------------------|----------------|
| Checks succeeded         | 100% (35,640)  |
| Average message latency  | 58.39 ms       |
| Median message latency   | 2 ms           |
| Max message latency      | 414 ms         |
| P90 latency              | 272 ms         |
| P95 latency              | 341 ms         |
| WS connect avg           | 4.45 ms        |
| WS messages sent         | 106,920        |
| WS messages received     | 35,640         |
| Iteration duration avg   | 5 s            |
| Data received            | 16 MB          |
| Data sent                | 88 MB          |

## Observations / Bottlenecks

- [x] Overall connectivity is stable; 100% successful WebSocket connections
- [x] Latency spikes observed in p95 (341 ms) — investigate causes
- [x] WS session duration consistent (~5s per iteration)
- [ ] Consider Kafka backpressure or WebSocket queueing under peak load
- [x] Test simulates up to 5,000 users; adjust stages for larger scenarios

## Next Steps

1. Increase simulated users to 10k+ for stress testing
2. Compare performance: WebSocket-only vs WebSocket + Kafka pipeline
3. Add gRPC streaming load test for chat microservice (will have to investigate further)
4. Monitor Kafka consumer lag and message throughput under peak load
5. Document changes, optimizations, and repeat tests