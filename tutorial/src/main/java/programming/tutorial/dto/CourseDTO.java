package programming.tutorial.dto;

public class CourseDTO {

    private Integer courseId;
    private String courseName;
    private int courseLength;
    private String description;
    private String category;

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