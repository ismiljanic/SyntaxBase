package programming.tutorial.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue
    @Column(name = "userID", nullable = false)
    private Integer id;
    @Column(name = "name", nullable = false)
    public String name;
    @Column(name = "surname", nullable = false)
    public String surname;
    @Column(name = "password", nullable = false)
    public String password;
    @Column(name = "username", nullable = false)
    public String username;

    public User() {
    }

    public User(String name, String surname, String password, String username) {
        this.name = name;
        this.surname = surname;
        this.password = password;
        this.username = username;
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

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", surname='" + surname + '\'' +
                ", password='" + password + '\'' +
                ", username='" + username + '\'' +
                '}';
    }
}
