package programming.tutorial.dto;

import java.util.List;

public class UserAccountDTO {
    private String name;
    private String surname;
    private String username;
    private String dateCreated;
    private List<PostDTO> userPosts;
    private List<PostDTO> deletedPosts;

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
