package programming.tutorial.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "lessonFeedback", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"lesson_id", "user_id"})
})
public class LessonFeedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String feedback;

    public LessonFeedback() {
    }

    public LessonFeedback(Lesson lesson, User user, String feedback) {
        this.lesson = lesson;
        this.user = user;
        this.feedback = feedback;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Lesson getLesson() {
        return lesson;
    }

    public void setLesson(Lesson lesson) {
        this.lesson = lesson;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "LessonFeedback{" +
                "id=" + id +
                ", lesson=" + lesson +
                ", user=" + user +
                ", feedback='" + feedback + '\'' +
                '}';
    }
}
