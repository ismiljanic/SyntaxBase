package programming.tutorial.domain;

public class InviteResponse {
    private Integer courseId;
    private Integer lessonId;

    public InviteResponse(Integer courseId, Integer lessonId) {
        this.courseId = courseId;
        this.lessonId = lessonId;
    }

    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }

    public Integer getLessonId() {
        return lessonId;
    }

    public void setLessonId(Integer lessonId) {
        this.lessonId = lessonId;
    }
}
