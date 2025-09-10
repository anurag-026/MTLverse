package com.mtlverse.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.UUID;

/**
 * Supabase Storage Service
 * Free tier: 1GB storage, 2GB bandwidth/month
 */
@Service
public class SupabaseStorageService {
    
    private static final Logger logger = LoggerFactory.getLogger(SupabaseStorageService.class);
    
    @Value("${app.storage.supabase.url:}")
    private String supabaseUrl;
    
    @Value("${app.storage.supabase.anon-key:}")
    private String anonKey;
    
    @Value("${app.storage.supabase.bucket-name:mtlverse}")
    private String bucketName;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    /**
     * Upload file to Supabase Storage
     */
    public String uploadFile(MultipartFile file, String subdirectory) throws IOException {
        validateFile(file);
        
        // Generate file path
        String datePath = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
        String filename = UUID.randomUUID().toString() + getFileExtension(file.getOriginalFilename());
        String filePath = subdirectory + "/" + datePath + "/" + filename;
        
        // Prepare headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.set("Authorization", "Bearer " + anonKey);
        headers.set("apikey", anonKey);
        
        // Upload file
        String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + filePath;
        
        HttpEntity<byte[]> request = new HttpEntity<>(file.getBytes(), headers);
        ResponseEntity<String> response = restTemplate.exchange(
                uploadUrl, 
                HttpMethod.POST, 
                request, 
                String.class
        );
        
        if (response.getStatusCode().is2xxSuccessful()) {
            String publicUrl = supabaseUrl + "/storage/v1/object/public/" + bucketName + "/" + filePath;
            logger.info("File uploaded to Supabase: {}", publicUrl);
            return publicUrl;
        } else {
            throw new IOException("Failed to upload file to Supabase: " + response.getBody());
        }
    }
    
    /**
     * Upload webtoon page image
     */
    public String uploadWebtoonPage(MultipartFile file, String webtoonId, String chapterId) throws IOException {
        return uploadFile(file, "webtoons/" + webtoonId + "/chapters/" + chapterId);
    }
    
    /**
     * Upload user avatar
     */
    public String uploadUserAvatar(MultipartFile file, String userId) throws IOException {
        return uploadFile(file, "avatars/" + userId);
    }
    
    /**
     * Upload webtoon cover
     */
    public String uploadWebtoonCover(MultipartFile file, String webtoonId) throws IOException {
        return uploadFile(file, "webtoons/" + webtoonId + "/covers");
    }
    
    /**
     * Delete file from Supabase Storage
     */
    public boolean deleteFile(String fileUrl) {
        try {
            String filePath = extractPathFromUrl(fileUrl);
            String deleteUrl = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + filePath;
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + anonKey);
            headers.set("apikey", anonKey);
            
            HttpEntity<String> request = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(
                    deleteUrl, 
                    HttpMethod.DELETE, 
                    request, 
                    String.class
            );
            
            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("File deleted from Supabase: {}", fileUrl);
                return true;
            }
            return false;
        } catch (Exception e) {
            logger.error("Error deleting file from Supabase: {}", fileUrl, e);
            return false;
        }
    }
    
    /**
     * Check if file exists in Supabase Storage
     */
    public boolean fileExists(String fileUrl) {
        try {
            String filePath = extractPathFromUrl(fileUrl);
            String checkUrl = supabaseUrl + "/storage/v1/object/" + bucketName + "/" + filePath;
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + anonKey);
            headers.set("apikey", anonKey);
            
            HttpEntity<String> request = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(
                    checkUrl, 
                    HttpMethod.HEAD, 
                    request, 
                    String.class
            );
            
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            logger.error("Error checking file existence in Supabase: {}", fileUrl, e);
            return false;
        }
    }
    
    /**
     * Get file size from Supabase Storage
     */
    public long getFileSize(String fileUrl) {
        try {
            String filePath = extractPathFromUrl(fileUrl);
            String infoUrl = supabaseUrl + "/storage/v1/object/info/" + bucketName + "/" + filePath;
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + anonKey);
            headers.set("apikey", anonKey);
            
            HttpEntity<String> request = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(
                    infoUrl, 
                    HttpMethod.GET, 
                    request, 
                    String.class
            );
            
            if (response.getStatusCode().is2xxSuccessful()) {
                // Parse JSON response to get file size
                // This is a simplified version - you might want to use a proper JSON parser
                String body = response.getBody();
                if (body != null && body.contains("\"size\"")) {
                    // Extract size from JSON (simplified)
                    String sizeStr = body.substring(body.indexOf("\"size\":") + 7);
                    sizeStr = sizeStr.substring(0, sizeStr.indexOf(","));
                    return Long.parseLong(sizeStr.trim());
                }
            }
            return 0;
        } catch (Exception e) {
            logger.error("Error getting file size from Supabase: {}", fileUrl, e);
            return 0;
        }
    }
    
    /**
     * Validate uploaded file
     */
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }
        
        if (file.getSize() > 5 * 1024 * 1024) { // 5MB max for Supabase
            throw new IllegalArgumentException("File size exceeds maximum allowed size: 5MB");
        }
        
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
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
    
    /**
     * Extract file path from Supabase public URL
     */
    private String extractPathFromUrl(String fileUrl) {
        String prefix = supabaseUrl + "/storage/v1/object/public/" + bucketName + "/";
        return fileUrl.replace(prefix, "");
    }
}
