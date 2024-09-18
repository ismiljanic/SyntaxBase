package programming.tutorial.dto;

public class LessonDTO {
    private Integer id;
    private String lessonName;

    private Integer courseId;

    public LessonDTO() {
    }

    public LessonDTO(Integer id, String lessonName, Integer courseId) {
        this.id = id;
        this.lessonName = lessonName;
        this.courseId = courseId;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getLessonName() {
        return lessonName;
    }

    public void setLessonName(String lessonName) {
        this.lessonName = lessonName;
    }

    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }
}
