package br.unipar.loja.config;

import java.util.List;

import io.swagger.v3.oas.models.security.SecurityRequirement;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {
    @Bean
    OpenApiCustomizer bearerAuthentication() {
        return openApi -> {
            openApi.addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
            openApi.getPaths().get("/auth/login").getPost().setSecurity(List.of());
            openApi.getPaths().get("/usuarios").getPost().setSecurity(List.of());
        };
    }
}
