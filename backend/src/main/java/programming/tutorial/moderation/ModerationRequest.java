package programming.tutorial.moderation;

public class ModerationRequest {
    private String text;

    public ModerationRequest(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}