package programming.tutorial.dto;

import programming.tutorial.domain.Lesson;

public class LessonDTO {
    private Integer id;
    private String lessonName;
    private Integer courseId;
    private Integer userId;
    private boolean completed;
    private String content;
    private boolean editable;
    private boolean isFirst;
    private boolean isLast;
    private Integer lessonNumber;

    public LessonDTO() {
    }

    public LessonDTO(Integer id, String lessonName, Integer courseId, Integer userId, boolean editable, boolean completed) {
        this.id = id;
        this.lessonName = lessonName;
        this.courseId = courseId;
        this.userId = userId;
        this.editable = editable;
        this.completed = completed;
    }

    public LessonDTO(Integer id, String lessonName, Integer courseId, Integer userId, boolean completed) {
        this.id = id;
        this.lessonName = lessonName;
        this.courseId = courseId;
        this.userId = userId;
        this.completed = completed;
    }

    public LessonDTO(Integer id, String lessonName, Integer lessonNumber) {
        this.id = id;
        this.lessonName = lessonName;
        this.lessonNumber = lessonNumber;
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

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public boolean getCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public boolean isEditable() {
        return editable;
    }

    public void setEditable(boolean editable) {
        this.editable = editable;
    }

    public boolean isFirst() {
        return isFirst;
    }

    public void setFirst(boolean isFirst) {
        this.isFirst = isFirst;
    }

    public boolean isLast() {
        return isLast;
    }

    public void setLast(boolean isLast) {
        this.isLast = isLast;
    }

    public boolean isCompleted() {
        return completed;
    }

    public Integer getLessonNumber() {
        return lessonNumber;
    }

    public void setLessonNumber(Integer lessonNumber) {
        this.lessonNumber = lessonNumber;
    }

    public static LessonDTO fromEntity(Lesson lesson) {
        LessonDTO dto = new LessonDTO();
        dto.setId(lesson.getId());
        dto.setLessonName(lesson.getLessonName());
        dto.setCourseId(lesson.getCourse().getId());
        dto.setUserId(lesson.getUser().getId());
        dto.setCompleted(lesson.isCompleted());
        dto.setContent(lesson.getContent());
        dto.setEditable(lesson.isEditable());
        dto.setLessonNumber(lesson.getLessonNumber());
        return dto;
    }

    @Override
    public String toString() {
        return "LessonDTO{" +
                "id=" + id +
                ", lessonName='" + lessonName + '\'' +
                ", courseId=" + courseId +
                ", userId=" + userId +
                ", completed=" + completed +
                ", content='" + content + '\'' +
                ", editable=" + editable +
                ", isFirst=" + isFirst +
                ", isLast=" + isLast +
                ", lessonNumber=" + lessonNumber +
                '}';
    }
}
