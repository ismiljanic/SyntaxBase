package programming.tutorial.controller;

import com.auth0.jwt.exceptions.SignatureVerificationException;
import com.nimbusds.jose.shaded.gson.JsonObject;
import com.nimbusds.jose.shaded.gson.JsonParser;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionRetrieveParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import programming.tutorial.config.StripePriceConfig;
import programming.tutorial.domain.Tier;
import programming.tutorial.services.UserService;

@RestController
@RequestMapping("/api/stripe")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class StripeWebhookController {

    @Value("${stripe.api.key}")
    private String stripeSecretKey;

    @Value("${stripe.webhook.secret}")
    private String endpointSecret;

    @Autowired
    private UserService userService;
    @Autowired
    private StripePriceConfig stripePriceConfig;

    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeEvent(@RequestBody String payload,
                                                    @RequestHeader("Stripe-Signature") String sigHeader) {

        Stripe.apiKey = stripeSecretKey;

        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (SignatureVerificationException | com.stripe.exception.SignatureVerificationException e) {
            return ResponseEntity.status(400).body("Webhook error: " + e.getMessage());
        }

        if ("checkout.session.completed".equals(event.getType())) {
            var objectDeserializer = event.getDataObjectDeserializer();

            if (objectDeserializer.getObject().isPresent()) {
                Session sessionStub = (Session) objectDeserializer.getObject().get();
                String sessionId = sessionStub.getId();

                try {
                    Session session = Session.retrieve(sessionId,
                            SessionRetrieveParams.builder()
                                    .addExpand("line_items")
                                    .addExpand("line_items.data.price")
                                    .build(),
                            null
                    );

                    String priceId = session.getLineItems().getData().get(0).getPrice().getId();
                    String auth0Id = session.getMetadata().get("auth0Id");

                    Tier newTier = mapPriceIdToTier(priceId);
                    userService.upgradeTier(auth0Id, newTier);

                } catch (StripeException e) {
                    e.printStackTrace();
                }

            } else {
                try {
                    JsonObject json = JsonParser.parseString(payload).getAsJsonObject();
                    String sessionId = json.getAsJsonObject("data").getAsJsonObject("object").get("id").getAsString();

                    Session session = Session.retrieve(sessionId,
                            SessionRetrieveParams.builder()
                                    .addExpand("line_items")
                                    .addExpand("line_items.data.price")
                                    .build(),
                            null
                    );

                    String priceId = session.getLineItems().getData().get(0).getPrice().getId();
                    String auth0Id = session.getMetadata().get("auth0Id");

                    Tier newTier = mapPriceIdToTier(priceId);
                    userService.upgradeTier(auth0Id, newTier);

                } catch (Exception e) {
                    e.printStackTrace();
                    return ResponseEntity.status(500).body("Failed to process webhook.");
                }
            }
        }

        return ResponseEntity.ok("Webhook processed");
    }

    private Tier mapPriceIdToTier(String priceId) {
        if (priceId.equals(stripePriceConfig.getProfessional())) {
            return Tier.PROFESSIONAL;
        }
        if (priceId.equals(stripePriceConfig.getUltimate())) {
            return Tier.ULTIMATE;
        }
        throw new IllegalArgumentException("Unknown priceId: " + priceId);
    }
}
