package com.NacaoInvencivel.RallyDasEquipes.Controller;

import java.io.IOException;
import java.nio.file.Files;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/imagem")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET})
public class ImagemController {

    @GetMapping("/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            // Sanitize filename to prevent path traversal
            filename = filename.replaceAll("[^a-zA-Z0-9.-]", "");
            
            // Tentar encontrar o arquivo em diferentes locais
            Resource resource;
            try {
                // Primeiro tenta como um recurso do classpath
                resource = new ClassPathResource("static/imagem/" + filename);
                if (!resource.exists()) {
                    // Tenta como caminho relativo
                    resource = new ClassPathResource("imagem/" + filename);
                }
            } catch (Exception e) {
                System.err.println("Erro ao buscar imagem: " + e.getMessage());
                return ResponseEntity.notFound().build();
            }
            
            if (!resource.exists()) {
                System.err.println("Imagem não encontrada: " + filename);
                return ResponseEntity.notFound().build();
            }
            
            byte[] imageBytes = Files.readAllBytes(resource.getFile().toPath());
            String contentType = determineContentType(filename);
            
            return ResponseEntity
                .ok()
                .header("Access-Control-Allow-Origin", "*")
                .header("Access-Control-Allow-Methods", "GET")
                .header("Access-Control-Allow-Headers", "*")
                .header("Cache-Control", "public, max-age=31536000")
                .header("Access-Control-Expose-Headers", "Content-Length")
                .contentType(MediaType.parseMediaType(contentType))
                .body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    private String determineContentType(String filename) {
        filename = filename.toLowerCase();
        if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
            return MediaType.IMAGE_JPEG_VALUE;
        } else if (filename.endsWith(".png")) {
            return MediaType.IMAGE_PNG_VALUE;
        } else if (filename.endsWith(".gif")) {
            return MediaType.IMAGE_GIF_VALUE;
        }
        return MediaType.IMAGE_JPEG_VALUE; // default to JPEG
    }

    @RequestMapping(method = RequestMethod.OPTIONS)
    public ResponseEntity<?> options() {
        return ResponseEntity
            .ok()
            .header("Access-Control-Allow-Origin", "*")
            .header("Access-Control-Allow-Methods", "GET")
            .header("Access-Control-Allow-Headers", "*")
            .header("Access-Control-Max-Age", "3600")
            .build();
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception e) {
        return ResponseEntity
            .status(500)
            .header("Access-Control-Allow-Origin", "*")
            .body("Error processing image: " + e.getMessage());
    }
}