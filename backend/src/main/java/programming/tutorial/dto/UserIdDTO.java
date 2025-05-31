package programming.tutorial.dto;

public class UserIdDTO {
    private String auth0id;

    public UserIdDTO(String auth0id) {
        this.auth0id = auth0id;
    }

    public String getAuth0id() {
        return auth0id;
    }

    public void setAuth0id(String auth0id) {
        this.auth0id = auth0id;
    }
}