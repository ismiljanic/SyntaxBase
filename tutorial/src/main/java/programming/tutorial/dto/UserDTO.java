package programming.tutorial.dto;

public class UserDTO {
    public Integer id;
    public String name;
    public String surname;
    public String password;
    public String username;

    public UserDTO(Integer id, String name, String surname, String password, String username) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.password = password;
        this.username = username;
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

    @Override
    public String toString() {
        return "UserDTO{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", surname='" + surname + '\'' +
                ", password='" + password + '\'' +
                ", username='" + username + '\'' +
                '}';
    }
}
