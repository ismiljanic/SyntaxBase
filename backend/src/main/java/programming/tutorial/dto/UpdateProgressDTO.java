package programming.tutorial.dto;

public class UpdateProgressDTO {
    private Integer userId;
    private Integer courseId;
    private Integer lessonId;

    public UpdateProgressDTO() {
    }

    public UpdateProgressDTO(Integer userId, Integer courseId, Integer lessonId) {
        this.userId = userId;
        this.courseId = courseId;
        this.lessonId = lessonId;
    }

    public Integer getUserId() {
        return userId;
    }

    public Integer getCourseId() {
        return courseId;
    }

    public Integer getLessonId() {
        return lessonId;
    }
}
