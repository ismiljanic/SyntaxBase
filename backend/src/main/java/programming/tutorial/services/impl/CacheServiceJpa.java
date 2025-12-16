package programming.tutorial.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

@Service
public class CacheServiceJpa {

    @Autowired
    private CacheManager cacheManager;

    public void evictAllCoursesCache() {
        var cache = cacheManager.getCache("all_courses");
        if (cache != null) {
            cache.clear();
        }
    }

    public void evictCoursesByUser(String auth0UserId) {
        var cache = cacheManager.getCache("courses_by_user");
        if (cache != null) {
            cache.evict(auth0UserId);
        }
    }

    public void evictAllCaches() {
        cacheManager.getCacheNames().forEach(name -> {
            var cache = cacheManager.getCache(name);
            if (cache != null) {
                cache.clear();
            }
        });
    }
}