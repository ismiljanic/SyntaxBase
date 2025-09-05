package programming.tutorial.domain;

import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "badge")
public class Badge {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(nullable = false, name = "badge_type")
    private String type; //COURSE_COMPLETION, FORUM_ACTIVITY

    @Column(columnDefinition = "text")
    private String criteria;

    @Column(name = "status")
    private boolean permanent = true;

    public Badge() {
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCriteria() {
        return criteria;
    }

    public void setCriteria(String criteria) {
        this.criteria = criteria;
    }

    public boolean isPermanent() {
        return permanent;
    }

    public void setPermanent(boolean permanent) {
        this.permanent = permanent;
    }
}
