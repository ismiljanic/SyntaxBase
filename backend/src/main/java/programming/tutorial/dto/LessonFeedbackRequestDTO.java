package programming.tutorial.dto;

public class LessonFeedbackRequestDTO {
    private Integer lessonId;
    private String feedback;
    public LessonFeedbackRequestDTO() {
    }
    public LessonFeedbackRequestDTO(Integer lessonId, String feedback) {
        this.lessonId = lessonId;
        this.feedback = feedback;
    }
    public Integer getLessonId() {
        return lessonId;
    }

    public void setLessonId(Integer lessonId) {
        this.lessonId = lessonId;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

}
