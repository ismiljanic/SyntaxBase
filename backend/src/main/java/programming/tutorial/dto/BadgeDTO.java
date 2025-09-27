package programming.tutorial.dto;

import java.util.UUID;

public class BadgeDTO {
    private UUID id;

    private String name;

    private String description;

    private String type;

    private String criteria;

    private boolean permanent = true;

    public BadgeDTO() {
    }

    public BadgeDTO(UUID id, String name, String description, String type, String criteria, boolean permanent) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.type = type;
        this.criteria = criteria;
        this.permanent = permanent;
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
