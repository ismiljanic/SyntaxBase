package programming.tutorial.config;

import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;

import java.time.Duration;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        try {
            LettuceConnectionFactory redisConnectionFactory = new LettuceConnectionFactory("localhost", 6379);
            redisConnectionFactory.afterPropertiesSet();
            redisConnectionFactory.getConnection().ping();

            RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
                    .entryTtl(Duration.ofMinutes(10));
            return RedisCacheManager.builder(redisConnectionFactory)
                    .cacheDefaults(config)
                    .build();
        } catch (Exception e) {
            System.out.println("Redis not available. Using in-memory cache.");
            return new ConcurrentMapCacheManager();
        }
    }
}