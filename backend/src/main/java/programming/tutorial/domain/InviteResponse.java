package programming.tutorial.domain;

public class InviteResponse {
    private Integer courseId;
    private Integer lessonNumber;

    public InviteResponse(Integer courseId, Integer lessonNumber) {
        this.courseId = courseId;
        this.lessonNumber = lessonNumber;
    }

    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }

    public Integer getLessonNumber() {
        return lessonNumber;
    }

    public void setLessonNumber(Integer lessonNumber) {
        this.lessonNumber = lessonNumber;
    }
}
