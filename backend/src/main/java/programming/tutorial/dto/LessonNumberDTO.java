package programming.tutorial.dto;

public class LessonNumberDTO {
    private Integer lessonNumber;

    public LessonNumberDTO(Integer lessonNumber) {
        this.lessonNumber = lessonNumber;
    }

    public Integer getLessonNumber() {
        return lessonNumber;
    }

    public void setLessonNumber(Integer lessonNumber) {
        this.lessonNumber = lessonNumber;
    }
}
