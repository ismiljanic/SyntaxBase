package programming.tutorial.services;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import programming.tutorial.dao.BadgeRepository;
import programming.tutorial.dao.UserBadgeRepository;
import programming.tutorial.dao.UserRepository;
import programming.tutorial.domain.Badge;
import programming.tutorial.domain.User;
import programming.tutorial.domain.UserBadge;
import programming.tutorial.services.impl.BadgeServiceJpa;

import java.util.*;

class BadgeServiceTest {

    @Mock
    private BadgeRepository badgeRepository;

    @Mock
    private UserBadgeRepository userBadgeRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private BadgeServiceJpa badgeService;

    private User user;
    private Badge badge1;
    private Badge badge2;
    private Badge validBadge;
    private Badge invalidBadge;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = new User();
        user.setUsername("testUser");
        user.setAuth0UserId("auth0-123");

        badge1 = new Badge();
        badge1.setId(UUID.randomUUID());
        badge1.setName("First Course Completed");
        badge1.setType("COURSE_COMPLETION");
        badge1.setCriteria("1");

        badge2 = new Badge();
        badge2.setId(UUID.randomUUID());
        badge2.setName("Course Master");
        badge2.setType("COURSE_COMPLETION");
        badge2.setCriteria("3");

        validBadge = new Badge();
        validBadge.setId(UUID.randomUUID());
        validBadge.setName("First Course Completed");
        validBadge.setType("COURSE_COMPLETION");
        validBadge.setCriteria("1");

        invalidBadge = new Badge();
        invalidBadge.setId(UUID.randomUUID());
        invalidBadge.setName("Broken Badge");
        invalidBadge.setType("COURSE_COMPLETION");
        invalidBadge.setCriteria("INVALID");
    }

    @Test
    void testAwardCourseCompletionBadge_shouldReturnBadge() {
        when(badgeRepository.findAllByType("COURSE_COMPLETION")).thenReturn(Arrays.asList(badge1, badge2));
        when(userBadgeRepository.existsByUserAndBadge(any(User.class), any(Badge.class))).thenReturn(false);

        badgeService.awardCourseCompletionBadge(user, 2);

        verify(userBadgeRepository, times(1)).save(argThat(ub -> ub.getBadge().equals(badge1)));
        verify(userBadgeRepository, never()).save(argThat(ub -> ub.getBadge().equals(badge2)));
    }

    @Test
    void testAwardForumActivityBadge_shouldReturnBadge() {
        Badge forumBadge = new Badge();
        forumBadge.setId(UUID.randomUUID());
        forumBadge.setName("Forum Contributor");
        forumBadge.setType("FORUM_ACTIVITY");
        forumBadge.setCriteria("5");

        when(userRepository.findByAuth0UserId("auth0-123")).thenReturn(Optional.of(user));
        when(badgeRepository.findAllByType("FORUM_ACTIVITY")).thenReturn(List.of(forumBadge));
        when(userBadgeRepository.existsByUserAndBadge(user, forumBadge)).thenReturn(false);

        badgeService.awardForumActivityBadge("auth0-123", 6);

        verify(userBadgeRepository, times(1)).save(argThat(ub -> ub.getBadge().equals(forumBadge)));
    }

    @Test
    void testGetUserBadges_shouldReturnListOfBadges() {
        UserBadge userBadge = new UserBadge(user, badge1);

        when(userRepository.findByAuth0UserId("auth0-123")).thenReturn(Optional.of(user));
        when(userBadgeRepository.findByUser(user)).thenReturn(List.of(userBadge));

        List<UserBadge> badges = badgeService.getUserBadges("auth0-123");

        assertEquals(1, badges.size());
        assertEquals(badge1.getName(), badges.get(0).getBadge().getName());
    }

    @Test
    void testAwardCourseCompletionBadgeWithInvalidCriteria() {
        when(badgeRepository.findAllByType("COURSE_COMPLETION")).thenReturn(Arrays.asList(validBadge, invalidBadge));
        when(userBadgeRepository.existsByUserAndBadge(any(User.class), any(Badge.class))).thenReturn(false);

        badgeService.awardCourseCompletionBadge(user, 2);

        verify(userBadgeRepository, times(1)).save(argThat(ub -> ub.getBadge().equals(validBadge)));
        verify(userBadgeRepository, never()).save(argThat(ub -> ub.getBadge().equals(invalidBadge)));
    }

    @Test
    void testAwardCourseCompletionBadgeUserAlreadyHasBadge() {
        when(badgeRepository.findAllByType("COURSE_COMPLETION")).thenReturn(List.of(validBadge));
        when(userBadgeRepository.existsByUserAndBadge(user, validBadge)).thenReturn(true);

        badgeService.awardCourseCompletionBadge(user, 5);

        verify(userBadgeRepository, never()).save(any());
    }

    @Test
    void testAwardForumActivityBadgeUserNotFound() {
        when(userRepository.findByAuth0UserId("auth0-123")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> badgeService.awardForumActivityBadge("auth0-123", 10));

        assertEquals("User not found", ex.getMessage());
    }

    @Test
    void testAwardForumActivityBadgeNoBadgesAvailable() {
        when(userRepository.findByAuth0UserId("auth0-123")).thenReturn(Optional.of(user));
        when(badgeRepository.findAllByType("FORUM_ACTIVITY")).thenReturn(Collections.emptyList());

        badgeService.awardForumActivityBadge("auth0-123", 10);

        verify(userBadgeRepository, never()).save(any());
    }

    @Test
    void testGetUserBadgesUserNotFound() {
        when(userRepository.findByAuth0UserId("auth0-123")).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> badgeService.getUserBadges("auth0-123"));

        assertEquals("User not found", ex.getMessage());
    }
}