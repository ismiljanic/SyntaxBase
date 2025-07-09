package programming.tutorial.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String courseName;
    private int length;
    private String description;
    private String category;
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Lesson> lessons;
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "creator_id")
    private User creator;

    @Column(name = "system_course")
    private boolean systemCourse;

    public Course() {
    }

    public Course(String name, int length, String description, String category, User creator, boolean systemCourse) {
        this.courseName = name;
        this.length = length;
        this.description = description;
        this.category = category;
        this.creator = creator;
        this.systemCourse = systemCourse;
    }


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public int getLength() {
        return length;
    }

    public void setLength(int length) {
        this.length = length;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<Lesson> getLessons() {
        return lessons;
    }

    public void setLessons(List<Lesson> lessons) {
        this.lessons = lessons;
    }

    public User getCreator() {
        return creator;
    }

    public void setCreator(User creator) {
        this.creator = creator;
    }

    public boolean isSystemCourse() {
        return systemCourse;
    }

    public void setSystemCourse(boolean systemCourse) {
        this.systemCourse = systemCourse;
    }

    @Override
    public String toString() {
        return "Course{" +
                "id=" + id +
                ", courseName='" + courseName + '\'' +
                ", length=" + length +
                ", description='" + description + '\'' +
                ", category='" + category + '\'' +
                ", creator=" + creator +
                ", systemCourse=" + systemCourse +
                '}';
    }
}
