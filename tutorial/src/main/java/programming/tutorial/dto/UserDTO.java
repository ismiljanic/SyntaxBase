package programming.tutorial.dto;

import java.time.LocalDateTime;

public class UserDTO {
    public String name;
    public String surname;
    public String password;
    public String username;
    public LocalDateTime dateCreated;

    public UserDTO(String name, String surname, String password, String username, LocalDateTime dateCreated) {
        this.name = name;
        this.surname = surname;
        this.password = password;
        this.username = username;
        this.dateCreated = dateCreated;
    }

    public UserDTO(String name, String surname, String username, LocalDateTime dateCreated) {
        this.name = name;
        this.surname = surname;
        this.username = username;
        this.dateCreated = dateCreated;
    }

    public UserDTO() {
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public LocalDateTime getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(LocalDateTime dateCreated) {
        this.dateCreated = dateCreated;
    }

    @Override
    public String toString() {
        return "UserDTO{" +
                ", name='" + name + '\'' +
                ", surname='" + surname + '\'' +
                ", password='" + password + '\'' +
                ", username='" + username + '\'' +
                ", dateCreated=" + dateCreated +
                '}';
    }
}
