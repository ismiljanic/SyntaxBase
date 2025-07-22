package programming.tutorial.dto;

public class CourseCompletionDTO {
    private Integer courseId;
    private String courseName;
    private Long totalEnrolled;
    private Long completedCount;
    private Double completionRate;

    public CourseCompletionDTO(Integer courseId, String courseName, Long totalEnrolled, Long completedCount, Double completionRate) {
        this.courseId = courseId;
        this.courseName = courseName;
        this.totalEnrolled = totalEnrolled;
        this.completedCount = completedCount;
        this.completionRate = completionRate;
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

    public Long getTotalEnrolled() {
        return totalEnrolled;
    }

    public void setTotalEnrolled(Long totalEnrolled) {
        this.totalEnrolled = totalEnrolled;
    }

    public Long getCompletedCount() {
        return completedCount;
    }

    public void setCompletedCount(Long completedCount) {
        this.completedCount = completedCount;
    }

    public Double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(Double completionRate) {
        this.completionRate = completionRate;
    }
}
