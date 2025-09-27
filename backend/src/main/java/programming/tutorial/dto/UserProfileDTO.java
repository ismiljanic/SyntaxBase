package programming.tutorial.dto;

import programming.tutorial.domain.User;

import java.time.LocalDateTime;
import java.util.List;

public class UserProfileDTO {
    private User user;
    private List<UserBadgeDTO> badges;
    private List<CourseDTO> courses;
    private List<PostDTO> posts;

    public UserProfileDTO() {
    }

    public UserProfileDTO(User user, List<UserBadgeDTO> badges, List<CourseDTO> courses, List<PostDTO> posts) {
        this.user = user;
        this.badges = badges;
        this.courses = courses;
        this.posts = posts;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public List<UserBadgeDTO> getBadges() {
        return badges;
    }

    public void setBadges(List<UserBadgeDTO> badges) {
        this.badges = badges;
    }

    public List<CourseDTO> getCourses() {
        return courses;
    }

    public void setCourses(List<CourseDTO> courses) {
        this.courses = courses;
    }

    public List<PostDTO> getPosts() {
        return posts;
    }

    public void setPosts(List<PostDTO> posts) {
        this.posts = posts;
    }
}
