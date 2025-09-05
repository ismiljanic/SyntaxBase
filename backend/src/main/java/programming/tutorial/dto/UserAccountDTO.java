package programming.tutorial.dto;

import programming.tutorial.domain.Role;
import programming.tutorial.domain.Tier;

import java.util.List;

public class UserAccountDTO {
    private String name;
    private String surname;
    private String username;
    private String dateCreated;
    private List<PostDTO> userPosts;
    private List<PostDTO> deletedPosts;
    private List<CourseProgressDTO> courses;
    private Role role;
    private boolean active;
    private Tier tier;
    private List<CertificateDTO> certificates;
    private List<UserBadgeDTO> badges;

    public UserAccountDTO() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(String dateCreated) {
        this.dateCreated = dateCreated;
    }

    public List<PostDTO> getUserPosts() {
        return userPosts;
    }

    public void setUserPosts(List<PostDTO> userPosts) {
        this.userPosts = userPosts;
    }

    public List<PostDTO> getDeletedPosts() {
        return deletedPosts;
    }

    public void setDeletedPosts(List<PostDTO> deletedPosts) {
        this.deletedPosts = deletedPosts;
    }

    public List<CourseProgressDTO> getCourses() {
        return courses;
    }

    public void setCourses(List<CourseProgressDTO> courses) {
        this.courses = courses;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Tier getTier() {
        return tier;
    }

    public void setTier(Tier tier) {
        this.tier = tier;
    }

    public List<CertificateDTO> getCertificates() {
        return certificates;
    }

    public void setCertificates(List<CertificateDTO> certificates) {
        this.certificates = certificates;
    }

    public List<UserBadgeDTO> getBadges() {
        return badges;
    }

    public void setBadges(List<UserBadgeDTO> badges) {
        this.badges = badges;
    }

    @Override
    public String toString() {
        return "UserAccountDTO{" +
                "name='" + name + '\'' +
                ", surname='" + surname + '\'' +
                ", username='" + username + '\'' +
                ", dateCreated='" + dateCreated + '\'' +
                ", userPosts=" + userPosts +
                ", deletedPosts=" + deletedPosts +
                '}';
    }
}
