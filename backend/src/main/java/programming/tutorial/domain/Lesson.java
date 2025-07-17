package programming.tutorial.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @JsonIgnore
    private Course course;
    @OneToMany(mappedBy = "lesson", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<LessonFeedback> feedbackList = new ArrayList<>();

    @Column(length = 10000, nullable = false)
    private String content;
    @Column(name = "editable")
    private boolean editable = false;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;
    @Column(name = "completed")
    private boolean completed;

    @Column(name = "lesson_number_id")
    private Integer lessonNumber;

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
        this.lessonNumber = extractLessonNumber(lessonName);
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public boolean isEditable() {
        return editable;
    }

    public void setEditable(boolean editable) {
        this.editable = editable;
    }

    public Integer getLessonNumber() {
        return lessonNumber;
    }

    public void setLessonNumber(Integer lessonNumber) {
        this.lessonNumber = lessonNumber;
    }

    private Integer extractLessonNumber(String name) {
        try {
            String[] parts = name.split(" ");
            return Integer.parseInt(parts[1]);
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public String toString() {
        return "Lesson{" +
                "id=" + id +
                ", lessonName='" + lessonName + '\'' +
                ", feedbackList=" + feedbackList +
                ", user=" + user +
                ", completed=" + completed +
                '}';
    }
}