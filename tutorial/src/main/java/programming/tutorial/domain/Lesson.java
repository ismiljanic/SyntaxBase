package programming.tutorial.domain;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "lesson")
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @Column(name = "lessonName")
    private String lessonName;
    @ManyToOne
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LessonFeedback> feedbackList = new ArrayList<>();

    public Lesson() {
    }

    public Lesson(String lessonName, Course course) {
        this.lessonName = lessonName;
        this.course = course;
    }

    public List<LessonFeedback> getFeedbackList() {
        return feedbackList;
    }

    public void setFeedbackList(List<LessonFeedback> feedbackList) {
        this.feedbackList = feedbackList;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getLessonName() {
        return lessonName;
    }

    public void setLessonName(String lessonName) {
        this.lessonName = lessonName;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    @Override
    public String toString() {
        return "Lesson{" +
                "id=" + id +
                ", lessonName='" + lessonName + '\'' +
                ", course=" + course +
                ", feedbackList=" + feedbackList +
                '}';
    }
}
