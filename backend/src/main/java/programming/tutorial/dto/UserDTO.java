package programming.tutorial.dto;

import programming.tutorial.domain.Role;

import java.time.LocalDateTime;

public class UserDTO {
    public Integer id;
    public String name;
    public String surname;
    public String password;
    public String username;
    public Role role;
    public String email;
    public LocalDateTime dateCreated;
    public boolean active;
    public String auth0UserId;

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

    public UserDTO(String auth0UserId, String username, Role role, boolean active) {
        this.auth0UserId = auth0UserId;
        this.username = username;
        this.role = role;
        this.active = active;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public UserDTO() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
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

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getAuth0UserId() {
        return auth0UserId;
    }

    public void setAuth0UserId(String auth0UserId) {
        this.auth0UserId = auth0UserId;
    }

    @Override
    public String toString() {
        return "UserDTO{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", surname='" + surname + '\'' +
                ", password='" + password + '\'' +
                ", username='" + username + '\'' +
                ", role=" + role +
                ", email='" + email + '\'' +
                ", dateCreated=" + dateCreated +
                ", active=" + active +
                ", auth0UserId='" + auth0UserId + '\'' +
                '}';
    }
}
