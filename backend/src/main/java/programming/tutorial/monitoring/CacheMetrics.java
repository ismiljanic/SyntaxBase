package programming.tutorial.monitoring;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Component;

@Component
public class CacheMetrics {

    private final Counter cacheHit;
    private final Counter cacheMiss;

    public CacheMetrics(MeterRegistry registry) {
        this.cacheHit = Counter.builder("redis_cache_hit_total")
                .description("Cache hits")
                .register(registry);

        this.cacheMiss = Counter.builder("redis_cache_miss_total")
                .description("Cache misses")
                .register(registry);
    }

    public void hit() { cacheHit.increment(); }
    public void miss() { cacheMiss.increment(); }
}
