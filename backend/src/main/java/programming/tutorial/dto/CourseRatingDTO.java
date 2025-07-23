package programming.tutorial.dto;

public class CourseRatingDTO {

    private Integer courseId;
    private String courseName;
    private Double averageRating;

    public CourseRatingDTO(Integer courseId, String courseName, Double averageRating) {
        this.courseId = courseId;
        this.courseName = courseName;
        this.averageRating = averageRating;
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

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }
}
