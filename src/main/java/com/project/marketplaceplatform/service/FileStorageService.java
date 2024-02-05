package com.project.marketplaceplatform.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String storeFile(MultipartFile file) throws IOException {
        try {
            // Create unique file name using UUID
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

            // Resolve the file path
            Path targetLocation = Paths.get(uploadDir).resolve(fileName);

            // Copy the file to the target location
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException ex) {
            throw new IOException("Could not store file " + file.getOriginalFilename() + ". Please try again!", ex);
        }
    }
}
