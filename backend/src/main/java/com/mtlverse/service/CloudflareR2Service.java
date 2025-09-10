package com.mtlverse.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

/**
 * Cloudflare R2 Storage Service
 * Free tier: 10GB storage, 1M requests/month
 */
@Service
public class CloudflareR2Service {
    
    private static final Logger logger = LoggerFactory.getLogger(CloudflareR2Service.class);
    
    @Value("${app.storage.r2.account-id:}")
    private String accountId;
    
    @Value("${app.storage.r2.access-key:}")
    private String accessKey;
    
    @Value("${app.storage.r2.secret-key:}")
    private String secretKey;
    
    @Value("${app.storage.r2.bucket-name:mtlverse}")
    private String bucketName;
    
    @Value("${app.storage.r2.public-url:}")
    private String publicUrl;
    
    private S3Client s3Client;
    
    /**
     * Initialize S3 client for Cloudflare R2
     */
    private S3Client getS3Client() {
        if (s3Client == null) {
            AwsBasicCredentials credentials = AwsBasicCredentials.create(accessKey, secretKey);
            
            s3Client = S3Client.builder()
                    .region(Region.US_EAST_1) // R2 uses us-east-1
                    .credentialsProvider(StaticCredentialsProvider.create(credentials))
                    .endpointOverride(java.net.URI.create("https://" + accountId + ".r2.cloudflarestorage.com"))
                    .build();
        }
        return s3Client;
    }
    
    /**
     * Upload file to Cloudflare R2
     */
    public String uploadFile(MultipartFile file, String subdirectory) throws IOException {
        validateFile(file);
        
        // Generate file path
        String datePath = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
        String filename = UUID.randomUUID().toString() + getFileExtension(file.getOriginalFilename());
        String key = subdirectory + "/" + datePath + "/" + filename;
        
        // Upload to R2
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(file.getContentType())
                .contentLength(file.getSize())
                .build();
        
        getS3Client().putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
        
        // Return public URL
        String publicFileUrl = publicUrl + "/" + key;
        logger.info("File uploaded to R2: {}", publicFileUrl);
        
        return publicFileUrl;
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
     * Delete file from R2
     */
    public boolean deleteFile(String fileUrl) {
        try {
            String key = extractKeyFromUrl(fileUrl);
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            
            getS3Client().deleteObject(deleteObjectRequest);
            logger.info("File deleted from R2: {}", fileUrl);
            return true;
        } catch (Exception e) {
            logger.error("Error deleting file from R2: {}", fileUrl, e);
            return false;
        }
    }
    
    /**
     * Check if file exists in R2
     */
    public boolean fileExists(String fileUrl) {
        try {
            String key = extractKeyFromUrl(fileUrl);
            HeadObjectRequest headObjectRequest = HeadObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            
            getS3Client().headObject(headObjectRequest);
            return true;
        } catch (NoSuchKeyException e) {
            return false;
        } catch (Exception e) {
            logger.error("Error checking file existence in R2: {}", fileUrl, e);
            return false;
        }
    }
    
    /**
     * Get file size from R2
     */
    public long getFileSize(String fileUrl) {
        try {
            String key = extractKeyFromUrl(fileUrl);
            HeadObjectRequest headObjectRequest = HeadObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();
            
            HeadObjectResponse response = getS3Client().headObject(headObjectRequest);
            return response.contentLength();
        } catch (Exception e) {
            logger.error("Error getting file size from R2: {}", fileUrl, e);
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
        
        if (file.getSize() > 10 * 1024 * 1024) { // 10MB max for R2
            throw new IllegalArgumentException("File size exceeds maximum allowed size: 10MB");
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
     * Extract S3 key from public URL
     */
    private String extractKeyFromUrl(String fileUrl) {
        return fileUrl.replace(publicUrl + "/", "");
    }
}
