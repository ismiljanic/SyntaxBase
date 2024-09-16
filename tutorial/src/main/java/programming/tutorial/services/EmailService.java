package programming.tutorial.services;

import org.springframework.stereotype.Service;
import programming.tutorial.domain.ContactForm;
@Service
public interface EmailService {
    public void sendContactEmail(ContactForm contactForm);

}
