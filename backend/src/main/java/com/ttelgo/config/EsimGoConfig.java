package com.ttelgo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class EsimGoConfig {

    @Value("${esimgo.api-base-url:https://api.esim-go.com/v2.4}")
    private String apiBaseUrl;

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder
                .rootUri(apiBaseUrl)
                .build();
    }
}












