package programming.tutorial.dto;
public class UserProgressDTO {
    private Integer userId;
    private Integer courseId;
    private LessonDTO currentLesson;

    public UserProgressDTO() {
    }

    public UserProgressDTO(Integer userId, Integer courseId, LessonDTO currentLesson) {
        this.userId = userId;
        this.courseId = courseId;
        this.currentLesson = currentLesson;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }

    public LessonDTO getCurrentLesson() {
        return currentLesson;
    }

    public void setCurrentLesson(LessonDTO currentLesson) {
        this.currentLesson = currentLesson;
    }
}
