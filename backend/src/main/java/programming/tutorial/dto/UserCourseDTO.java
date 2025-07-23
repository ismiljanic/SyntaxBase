package programming.tutorial.dto;

import programming.tutorial.domain.Course;
import programming.tutorial.domain.User;

public class UserCourseDTO {

    private Integer userId;
    private Integer courseId;
    private User user;
    private Course course;
    private String auth0UserId;
    private Boolean isCourseCompleted;

    public UserCourseDTO() {
    }

    public UserCourseDTO(Integer userId, Integer courseId, User user, Course course, Boolean isCourseCompleted) {
        this.userId = userId;
        this.courseId = courseId;
        this.user = user;
        this.course = course;
        this.isCourseCompleted = isCourseCompleted;
    }

    public UserCourseDTO(String auth0UserId, Integer courseId) {
        this.auth0UserId = auth0UserId;
        this.courseId = courseId;
    }

    public Boolean getCourseCompleted() {
        return isCourseCompleted;
    }

    public void setCourseCompleted(Boolean courseCompleted) {
        isCourseCompleted = courseCompleted;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public String getAuth0UserId() {
        return auth0UserId;
    }

    public void setAuth0UserId(String auth0UserId) {
        this.auth0UserId = auth0UserId;
    }

    @Override
    public String toString() {
        return "UserCourseDTO{" +
                "userId=" + userId +
                ", courseId=" + courseId +
                ", user=" + user +
                ", course=" + course +
                ", isCourseCompleted=" + isCourseCompleted +
                '}';
    }
}
