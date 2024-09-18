package programming.tutorial.dto;

public class LessonFeedbackRequestDTO {
    private Integer lessonId;
    private Integer userId;
    private String feedback;
    public LessonFeedbackRequestDTO() {
    }
    public LessonFeedbackRequestDTO(Integer lessonId, Integer userId, String feedback) {
        this.lessonId = lessonId;
        this.userId = userId;
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

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }
}
