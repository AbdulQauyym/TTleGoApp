package com.ttelgo.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ttelgo.dto.CreateOrderRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * Service that wraps calls to the eSIM Go API v2.4.
 * Docs: https://docs.esim-go.com/api/v2_4/ ([Reference](https://docs.esim-go.com/api/v2_4/))
 */
@Service
public class EsimGoService {

    private static final Logger log = LoggerFactory.getLogger(EsimGoService.class);

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${esimgo.api-key}")
    private String apiKey;

    public EsimGoService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private HttpHeaders defaultHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-API-Key", apiKey);
        return headers;
    }

    /**
     * Create order via eSIM Go API v2.4.
     * Maps to POST /orders (Create orders).
     */
    public String createOrder(CreateOrderRequest request) {
        Map<String, Object> body = new HashMap<>();

        Map<String, Object> orderItem = new HashMap<>();
        orderItem.put("type", request.getType());
        orderItem.put("quantity", request.getQuantity());
        orderItem.put("item", request.getBundleName());
        orderItem.put("assign", request.isAssign());

        body.put("orderItems", new Object[]{orderItem});

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, defaultHeaders());

        try {
            ResponseEntity<String> response =
                    restTemplate.exchange("/orders", HttpMethod.POST, entity, String.class);
            return response.getBody();
        } catch (HttpStatusCodeException e) {
            log.error("Error creating order: status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString());
            throw e;
        }
    }

    /**
     * Get order detail from eSIM Go.
     * Maps to GET /orders/{reference} (Get order detail).
     */
    public String getOrderDetail(String reference) {
        HttpEntity<Void> entity = new HttpEntity<>(defaultHeaders());
        try {
            ResponseEntity<String> response =
                    restTemplate.exchange("/orders/" + reference, HttpMethod.GET, entity, String.class);
            return response.getBody();
        } catch (HttpStatusCodeException e) {
            log.error("Error fetching order: status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString());
            throw e;
        }
    }

    /**
     * Convenience method to extract orderReference from a create-order response.
     */
    public String extractOrderReference(String orderResponseJson) {
        try {
            JsonNode node = objectMapper.readTree(orderResponseJson);
            if (node.has("orderReference")) {
                return node.get("orderReference").asText();
            }
            if (node.has("reference")) {
                return node.get("reference").asText();
            }
            return null;
        } catch (Exception e) {
            log.error("Failed to parse order response JSON", e);
            return null;
        }
    }
}












