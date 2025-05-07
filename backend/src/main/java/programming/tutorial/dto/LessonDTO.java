package programming.tutorial.dto;

public class LessonDTO {
    private Integer id;
    private String lessonName;

    private Integer courseId;
    private Integer userId;
    private String completed;

    public LessonDTO() {
    }

    public LessonDTO(Integer id, String lessonName, Integer courseId, Integer userId, String completed) {
        this.id = id;
        this.lessonName = lessonName;
        this.courseId = courseId;
        this.userId = userId;
        this.completed = completed;
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

    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }

    public Integer getUserId() {
        return userId;
    }
    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public String getCompleted() {
        return completed;
    }

    public void setCompleted(String completed) {
        this.completed = completed;
    }
}
