package com.mtlverse.service;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    
    /**
     * Store uploaded file and return public URL
     */
    String storeFile(MultipartFile file, String subdirectory) throws Exception;
    
    /**
     * Store webtoon page image
     */
    String storeWebtoonPage(MultipartFile file, String webtoonId, String chapterId) throws Exception;
    
    /**
     * Store user avatar
     */
    String storeUserAvatar(MultipartFile file, String userId) throws Exception;
    
    /**
     * Store webtoon cover image
     */
    String storeWebtoonCover(MultipartFile file, String webtoonId) throws Exception;
    
    /**
     * Delete file by URL
     */
    boolean deleteFile(String fileUrl);
    
    /**
     * Check if file exists
     */
    boolean fileExists(String fileUrl);
    
    /**
     * Get file size
     */
    long getFileSize(String fileUrl);
}
