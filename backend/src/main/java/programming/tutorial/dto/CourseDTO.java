package programming.tutorial.dto;

import programming.tutorial.domain.User;

public class CourseDTO {

    private Integer courseId;
    private String courseName;
    private int courseLength;
    private String description;
    private String category;
    private String creatorId;
    private User creator;
    private boolean systemCourse;

    public CourseDTO() {
    }

    public CourseDTO(Integer courseId, String courseName, int courseLength, String description, String category) {
        this.courseId = courseId;
        this.courseName = courseName;
        this.courseLength = courseLength;
        this.description = description;
        this.category = category;
    }

    public CourseDTO(Integer id, String name) {
    }

    public CourseDTO(Integer id, String courseName, int length, String description, String category, Integer id1, boolean systemCourse) {
        this.courseId = id;
        this.courseName = courseName;
        this.courseLength = length;
        this.description = description;
        this.category = category;
        this.creatorId = String.valueOf(id1);
        this.systemCourse = systemCourse;
    }

    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }

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

    public String getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(String creatorId) {
        this.creatorId = creatorId;
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
        return "CourseDTO{" +
                "courseId=" + courseId +
                ", courseName='" + courseName + '\'' +
                ", courseLength=" + courseLength +
                ", description='" + description + '\'' +
                ", category='" + category + '\'' +
                '}';
    }
}