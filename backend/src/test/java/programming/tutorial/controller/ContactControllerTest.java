package programming.tutorial.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import programming.tutorial.domain.ContactForm;
import programming.tutorial.services.EmailService;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.doNothing;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ContactController.class)
class ContactControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private EmailService emailService;

    @Test
    @WithMockUser
    void handleContactForm_shouldReturnSuccessMessage_whenEmailSent() throws Exception {
        ContactForm contactForm = new ContactForm();
        contactForm.setName("John Doe");
        contactForm.setEmail("john@example.com");
        contactForm.setMessage("Hello!");

        doNothing().when(emailService).sendContactEmail(contactForm);

        mockMvc.perform(post("/api/contact/email")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(contactForm)))
                .andExpect(status().isOk())
                .andExpect(content().string("Feedback submitted successfully!"));
    }

    @Test
    @WithMockUser
    void handleContactForm_shouldReturnFailureMessage_whenEmailServiceThrows() throws Exception {
        ContactForm contactForm = new ContactForm();
        contactForm.setName("John Doe");
        contactForm.setEmail("john@example.com");
        contactForm.setMessage("Hello!");

        doThrow(new RuntimeException("Email sending failed"))
                .when(emailService).sendContactEmail(any(ContactForm.class));

        mockMvc.perform(post("/api/contact/email")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(contactForm)))
                .andExpect(status().isOk())
                .andExpect(content().string("Failed to submit feedback. Please try again."));
    }
}