package programming.tutorial.dto;

import java.util.List;

public class CourseWithLessonsDTO {
    private String courseName;
    private int courseLength;
    private String description;
    private String category;
    private String auth0UserId;
    private List<String> lessons;

    private boolean systemCourse;


    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public int getCourseLength() {
        return courseLength;
    }

    public void setCourseLength(int courseLength) {
        this.courseLength = courseLength;
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

    public String getAuth0UserId() {
        return auth0UserId;
    }

    public void setAuth0UserId(String auth0UserId) {
        this.auth0UserId = auth0UserId;
    }

    public List<String> getLessons() {
        return lessons;
    }

    public void setLessons(List<String> lessons) {
        this.lessons = lessons;
    }

    public boolean isSystemCourse() {
        return systemCourse;
    }

    public void setSystemCourse(boolean systemCourse) {
        this.systemCourse = systemCourse;
    }
}
