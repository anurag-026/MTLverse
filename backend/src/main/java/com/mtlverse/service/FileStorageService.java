package com.mtlverse.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
public class FileStorageService {
    
    private static final Logger logger = LoggerFactory.getLogger(FileStorageService.class);
    
    @Value("${app.file.storage-path:/uploads}")
    private String storagePath;
    
    @Value("${app.file.storage-url:http://localhost:8081}")
    private String storageUrl;
    
    @Value("${app.file.max-size:10485760}")
    private long maxFileSize;
    
    @Value("${app.file.allowed-types:image/jpeg,image/png,image/webp}")
    private String[] allowedTypes;
    
    /**
     * Store uploaded file and return public URL
     */
    public String storeFile(MultipartFile file, String subdirectory) throws IOException {
        validateFile(file);
        
        // Create directory structure: /uploads/year/month/day/subdirectory/
        String datePath = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
        Path targetDir = Paths.get(storagePath, datePath, subdirectory);
        Files.createDirectories(targetDir);
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);
        String filename = UUID.randomUUID().toString() + extension;
        
        // Save file
        Path targetPath = targetDir.resolve(filename);
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        
        // Return public URL
        String publicUrl = storageUrl + "/files/" + datePath + "/" + subdirectory + "/" + filename;
        logger.info("File stored successfully: {}", publicUrl);
        
        return publicUrl;
    }
    
    /**
     * Store webtoon page image
     */
    public String storeWebtoonPage(MultipartFile file, String webtoonId, String chapterId) throws IOException {
        return storeFile(file, "webtoons/" + webtoonId + "/chapters/" + chapterId);
    }
    
    /**
     * Store user avatar
     */
    public String storeUserAvatar(MultipartFile file, String userId) throws IOException {
        return storeFile(file, "avatars/" + userId);
    }
    
    /**
     * Store webtoon cover image
     */
    public String storeWebtoonCover(MultipartFile file, String webtoonId) throws IOException {
        return storeFile(file, "webtoons/" + webtoonId + "/covers");
    }
    
    /**
     * Delete file by URL
     */
    public boolean deleteFile(String fileUrl) {
        try {
            // Extract file path from URL
            String filePath = fileUrl.replace(storageUrl + "/files/", "");
            Path targetPath = Paths.get(storagePath, filePath);
            
            if (Files.exists(targetPath)) {
                Files.delete(targetPath);
                logger.info("File deleted successfully: {}", fileUrl);
                return true;
            }
            return false;
        } catch (IOException e) {
            logger.error("Error deleting file: {}", fileUrl, e);
            return false;
        }
    }
    
    /**
     * Get file size
     */
    public long getFileSize(String fileUrl) {
        try {
            String filePath = fileUrl.replace(storageUrl + "/files/", "");
            Path targetPath = Paths.get(storagePath, filePath);
            return Files.size(targetPath);
        } catch (IOException e) {
            logger.error("Error getting file size: {}", fileUrl, e);
            return 0;
        }
    }
    
    /**
     * Check if file exists
     */
    public boolean fileExists(String fileUrl) {
        try {
            String filePath = fileUrl.replace(storageUrl + "/files/", "");
            Path targetPath = Paths.get(storagePath, filePath);
            return Files.exists(targetPath);
        } catch (Exception e) {
            logger.error("Error checking file existence: {}", fileUrl, e);
            return false;
        }
    }
    
    /**
     * Validate uploaded file
     */
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        
        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException("File size exceeds maximum allowed size: " + maxFileSize);
        }
        
        String contentType = file.getContentType();
        boolean isAllowed = false;
        for (String allowedType : allowedTypes) {
            if (contentType != null && contentType.startsWith(allowedType)) {
                isAllowed = true;
                break;
            }
        }
        
        if (!isAllowed) {
            throw new IllegalArgumentException("File type not allowed: " + contentType);
        }
    }
    
    /**
     * Get file extension from filename
     */
    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf("."));
    }
}
