package programming.tutorial.domain;

import jakarta.persistence.*;

import java.util.Objects;

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

    public Course() {
    }

    public Course(String name, int length, String description, String category) {
        this.courseName = name;
        this.length = length;
        this.description = description;
        this.category = category;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return courseName;
    }

    public void setName(String name) {
        this.courseName = name;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Course course = (Course) o;
        return length == course.length &&
                Objects.equals(id, course.id) &&
                Objects.equals(courseName, course.courseName) &&
                Objects.equals(description, course.description) &&
                Objects.equals(category, course.category);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, courseName, length, description, category);
    }

    @Override
    public String toString() {
        return "Course{" +
                "id=" + id +
                ", name='" + courseName + '\'' +
                ", length=" + length +
                ", description='" + description + '\'' +
                ", category='" + category + '\'' +
                '}';
    }
}
