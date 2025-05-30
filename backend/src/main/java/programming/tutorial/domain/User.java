package programming.tutorial.domain;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "userID", nullable = false)
    private Integer id;
    @Column(name = "auth0user_id", nullable = false)
    private String auth0UserId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "surname", nullable = false)
    private String surname;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "username", nullable = false)
    private String username;
    @Column(name = "dateCreated", nullable = false)
    public LocalDateTime dateCreated;

    @Enumerated(EnumType.STRING)
    private Role role;

    @ManyToMany
    @JoinTable(
            name = "user_courses",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "course_id")
    )
    private Set<Course> myCourses;

    public User() {
    }

    public User(Integer id, String name, String surname, String password, String username, LocalDateTime dateCreated, Set<Course> myCourses) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.password = password;
        this.username = username;
        this.dateCreated = dateCreated;
        this.myCourses = myCourses;
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


    public Set<Course> getMyCourses() {
        return myCourses;
    }

    public void setMyCourses(Set<Course> myCourses) {
        this.myCourses = myCourses;
    }

    public LocalDateTime getDateCreated() {
        return dateCreated;
    }

    public void setDateCreated(LocalDateTime dateCreated) {
        this.dateCreated = dateCreated;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getAuth0UserId() {
        return auth0UserId;
    }

    public void setAuth0UserId(String auth0UserId) {
        this.auth0UserId = auth0UserId;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", surname='" + surname + '\'' +
                ", password='" + password + '\'' +
                ", username='" + username + '\'' +
                ", dateCreated=" + dateCreated +
                ", role=" + role +
                ", myCourses=" + myCourses +
                '}';
    }
}
