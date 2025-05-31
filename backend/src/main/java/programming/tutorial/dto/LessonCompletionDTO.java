package programming.tutorial.dto;

public class LessonCompletionDTO {
    private Integer lessonId;
    public LessonCompletionDTO() {
    }

    public LessonCompletionDTO(Integer lessonId) {
        this.lessonId = lessonId;
    }

    public Integer getLessonId() {
        return lessonId;
    }

    public void setLessonId(Integer lessonId) {
        this.lessonId = lessonId;
    }

}
