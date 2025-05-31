package programming.tutorial.dto;
public class UserProgressDTO {
    private String auth0UserId;
    private Integer courseId;
    private LessonDTO currentLesson;

    public UserProgressDTO() {
    }

    public UserProgressDTO(String auth0UserId, Integer courseId, LessonDTO currentLesson) {
        this.auth0UserId = auth0UserId;
        this.courseId = courseId;
        this.currentLesson = currentLesson;
    }

    public String getAuth0UserId() {
        return auth0UserId;
    }

    public void setAuth0UserId(String auth0UserId) {
        this.auth0UserId = auth0UserId;
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
