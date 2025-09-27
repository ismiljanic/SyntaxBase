package programming.tutorial.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import programming.tutorial.domain.Badge;
import programming.tutorial.domain.User;
import programming.tutorial.domain.UserBadge;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserBadgeRepository extends JpaRepository<UserBadge, UUID> {
    boolean existsByUserAndBadge(User user, Badge badge);
    List<UserBadge> findByUser(User user);
}
