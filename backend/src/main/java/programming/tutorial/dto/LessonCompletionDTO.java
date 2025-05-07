package programming.tutorial.dto;

public class LessonCompletionDTO {
    private Integer lessonId;
    private Integer userId;

    public LessonCompletionDTO() {
    }

    public LessonCompletionDTO(Integer lessonId, Integer userId) {
        this.lessonId = lessonId;
        this.userId = userId;
    }

    public Integer getLessonId() {
        return lessonId;
    }

    public void setLessonId(Integer lessonId) {
        this.lessonId = lessonId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}
