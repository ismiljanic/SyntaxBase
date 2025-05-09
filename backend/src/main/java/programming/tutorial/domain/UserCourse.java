package programming.tutorial.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "user_courses")
public class UserCourse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @JoinColumn(name = "completed", nullable = false)
    private Boolean completed;

    public UserCourse() {
    }

    public UserCourse(Integer id, User user, Course course, Boolean completed) {
        this.id = id;
        this.user = user;
        this.course = course;
        this.completed = completed;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }
    @Override
    public String toString() {
        return "UserCourse{" +
                "id=" + id +
                ", user=" + user +
                ", course=" + course +
                ", completed=" + completed +
                '}';
    }
}
