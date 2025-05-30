package programming.tutorial.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long courseId;
    private String auth0UserId;
    private int rating;

    public Rating() {
    }

    public Rating(Long id, Long courseId, String auth0UserId, int rating) {
        this.id = id;
        this.courseId = courseId;
        this.auth0UserId = auth0UserId;
        this.rating = rating;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getAuth0UserId() {
        return auth0UserId;
    }

    public void setAuth0UserId(String userId) {
        this.auth0UserId = userId;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    @Override
    public String toString() {
        return "Rating{" +
                "id=" + id +
                ", courseId=" + courseId +
                ", userId=" + auth0UserId +
                ", rating=" + rating +
                '}';
    }
}