package programming.tutorial.controller;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CheckoutController {

    @Value("${stripe.api.key}")
    private String stripeSecretKey;

    @Value("${stripe.success.url}")
    private String successUrl;

    @Value("${stripe.cancel.url}")
    private String cancelUrl;

    @Value("${stripe.price.professional}")
    private String professionalPriceId;

    @Value("${stripe.price.ultimate}")
    private String ultimatePriceId;

    @PostMapping("/create-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody Map<String, String> request) {
        Stripe.apiKey = stripeSecretKey;

        String tier = request.get("tier");
        String priceId;
        String auth0Id = request.get("auth0Id");

        if ("Professional".equalsIgnoreCase(tier)) {
            priceId = professionalPriceId;
        } else if ("Ultimate".equalsIgnoreCase(tier)) {
            priceId = ultimatePriceId;
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid tier"));
        }
        System.out.println("authid: " + auth0Id);
        try {
            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                    .setSuccessUrl(successUrl + "?session_id={CHECKOUT_SESSION_ID}")
                    .setCancelUrl(cancelUrl)
                    .putMetadata("auth0Id", auth0Id)
                    .addExpand("line_items.data.price")
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setPrice(priceId)
                                    .setQuantity(1L)
                                    .build()
                    )
                    .build();

            Session session = Session.create(params);

            Map<String, String> responseData = new HashMap<>();
            responseData.put("sessionId", session.getId());
            responseData.put("url", session.getUrl());

            return ResponseEntity.ok(responseData);

        } catch (StripeException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Stripe API error: " + e.getMessage()));
        }
    }
}