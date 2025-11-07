package com.NacaoInvencivel.RallyDasEquipes.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Configuração para o path exato das imagens
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "OPTIONS")
                .allowedHeaders("*")
                .exposedHeaders("*");
    }
}