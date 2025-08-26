package programming.tutorial.dto;

public class RatingDTO {
    private Integer id;
    private Integer courseId;
    private int rating;

    public RatingDTO(Integer id, Integer courseId, int rating) {
        this.id = id;
        this.courseId = courseId;
        this.rating = rating;
    }

    public RatingDTO(Integer courseId, int rating) {
        this.courseId = courseId;
        this.rating = rating;
    }

    public RatingDTO() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }
}
