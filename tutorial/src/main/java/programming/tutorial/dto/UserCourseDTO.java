package programming.tutorial.dto;

import programming.tutorial.domain.Course;
import programming.tutorial.domain.User;

public class UserCourseDTO {

    private Integer userId;
    private Integer courseId;

    private User user;

    private Course course;

    public UserCourseDTO() {
    }

    public UserCourseDTO(Integer userId, Integer courseId, User user, Course course) {
        this.userId = userId;
        this.courseId = courseId;
        this.user = user;
        this.course = course;
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

    @Override
    public String toString() {
        return "UserCourseDTO{" +
                "userId=" + userId +
                ", courseId=" + courseId +
                ", user=" + user +
                ", course=" + course +
                '}';
    }
}
