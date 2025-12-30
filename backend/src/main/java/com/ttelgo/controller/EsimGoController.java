package com.ttelgo.controller;

import com.ttelgo.dto.CreateOrderRequest;
import com.ttelgo.service.EsimGoService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller exposing simple endpoints that wrap the eSIM Go API v2.4.
 *
 * You can call these endpoints from Postman instead of calling eSIM Go directly.
 * The backend will forward the requests to eSIM Go with the correct headers.
 *
 * Docs: https://docs.esim-go.com/api/v2_4/ ([Reference](https://docs.esim-go.com/api/v2_4/))
 */
@RestController
@RequestMapping("/api/esimgo")
public class EsimGoController {

    private final EsimGoService esimGoService;

    public EsimGoController(EsimGoService esimGoService) {
        this.esimGoService = esimGoService;
    }

    /**
     * Create order (POST /orders).
     *
     * Example Postman request:
     * POST http://localhost:8080/api/esimgo/orders
     * Body (JSON):
     * {
     *   "bundleName": "esim_1GB_7D_GB_V2",
     *   "quantity": 1,
     *   "assign": true,
     *   "type": "transaction"
     * }
     */
    @PostMapping(value = "/orders", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        String responseJson = esimGoService.createOrder(request);
        return ResponseEntity.ok(responseJson);
    }

    /**
     * Get order detail (GET /orders/{reference}).
     *
     * Example Postman request:
     * GET http://localhost:8080/api/esimgo/orders/58e07076-8213-4e56-8788-142a9d6381aa
     */
    @GetMapping(value = "/orders/{reference}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> getOrderDetail(@PathVariable String reference) {
        String responseJson = esimGoService.getOrderDetail(reference);
        return ResponseEntity.ok(responseJson);
    }
}





