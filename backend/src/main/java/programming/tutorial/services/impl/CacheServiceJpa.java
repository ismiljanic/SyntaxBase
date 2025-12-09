package programming.tutorial.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

@Service
public class CacheServiceJpa {

    @Autowired
    private CacheManager cacheManager;

    public void evictAllCoursesCache() {
        if (cacheManager.getCache("all_courses") != null) {
            cacheManager.getCache("all_courses").clear();
        }
    }

    public void evictCoursesByUser(String auth0UserId) {
        if (cacheManager.getCache("courses_by_user") != null) {
            cacheManager.getCache("courses_by_user").evict(auth0UserId);
        }
    }
}
