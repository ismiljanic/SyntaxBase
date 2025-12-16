package programming.tutorial.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import programming.tutorial.services.impl.CacheServiceJpa;

@RestController
@RequestMapping("/admin/cache")
public class CacheController {

    @Autowired
    private CacheServiceJpa cacheService;

    @DeleteMapping("/courses")
    public ResponseEntity<String> clearAllCoursesCache() {
        cacheService.evictAllCoursesCache();
        System.out.println("Called");
        return ResponseEntity.ok("All course caches cleared!");
    }

    @DeleteMapping("/all")
    public ResponseEntity<String> clearAllCaches() {
        cacheService.evictAllCaches();
        return ResponseEntity.ok("All caches cleared");
    }
}
