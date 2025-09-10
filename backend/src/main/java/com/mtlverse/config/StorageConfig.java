package com.mtlverse.config;

import com.mtlverse.service.CloudflareR2Service;
import com.mtlverse.service.FileStorageService;
import com.mtlverse.service.SupabaseStorageService;
import com.mtlverse.service.StorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class StorageConfig {
    
    @Value("${app.storage.provider:local}")
    private String storageProvider;
    
    @Bean
    @Primary
    public StorageService storageService(
            FileStorageService localStorageService,
            CloudflareR2Service r2StorageService,
            SupabaseStorageService supabaseStorageService) {
        
        return switch (storageProvider.toLowerCase()) {
            case "r2" -> new StorageServiceWrapper(r2StorageService);
            case "supabase" -> new StorageServiceWrapper(supabaseStorageService);
            case "local" -> new StorageServiceWrapper(localStorageService);
            default -> new StorageServiceWrapper(localStorageService);
        };
    }
    
    /**
     * Wrapper class to provide a common interface for all storage services
     */
    public static class StorageServiceWrapper implements StorageService {
        
        private final Object storageService;
        
        public StorageServiceWrapper(Object storageService) {
            this.storageService = storageService;
        }
        
        @Override
        public String storeFile(org.springframework.web.multipart.MultipartFile file, String subdirectory) throws Exception {
            if (storageService instanceof FileStorageService) {
                return ((FileStorageService) storageService).storeFile(file, subdirectory);
            } else if (storageService instanceof CloudflareR2Service) {
                return ((CloudflareR2Service) storageService).uploadFile(file, subdirectory);
            } else if (storageService instanceof SupabaseStorageService) {
                return ((SupabaseStorageService) storageService).uploadFile(file, subdirectory);
            }
            throw new UnsupportedOperationException("Unsupported storage service");
        }
        
        @Override
        public String storeWebtoonPage(org.springframework.web.multipart.MultipartFile file, String webtoonId, String chapterId) throws Exception {
            if (storageService instanceof FileStorageService) {
                return ((FileStorageService) storageService).storeWebtoonPage(file, webtoonId, chapterId);
            } else if (storageService instanceof CloudflareR2Service) {
                return ((CloudflareR2Service) storageService).uploadWebtoonPage(file, webtoonId, chapterId);
            } else if (storageService instanceof SupabaseStorageService) {
                return ((SupabaseStorageService) storageService).uploadWebtoonPage(file, webtoonId, chapterId);
            }
            throw new UnsupportedOperationException("Unsupported storage service");
        }
        
        @Override
        public String storeUserAvatar(org.springframework.web.multipart.MultipartFile file, String userId) throws Exception {
            if (storageService instanceof FileStorageService) {
                return ((FileStorageService) storageService).storeUserAvatar(file, userId);
            } else if (storageService instanceof CloudflareR2Service) {
                return ((CloudflareR2Service) storageService).uploadUserAvatar(file, userId);
            } else if (storageService instanceof SupabaseStorageService) {
                return ((SupabaseStorageService) storageService).uploadUserAvatar(file, userId);
            }
            throw new UnsupportedOperationException("Unsupported storage service");
        }
        
        @Override
        public String storeWebtoonCover(org.springframework.web.multipart.MultipartFile file, String webtoonId) throws Exception {
            if (storageService instanceof FileStorageService) {
                return ((FileStorageService) storageService).storeWebtoonCover(file, webtoonId);
            } else if (storageService instanceof CloudflareR2Service) {
                return ((CloudflareR2Service) storageService).uploadWebtoonCover(file, webtoonId);
            } else if (storageService instanceof SupabaseStorageService) {
                return ((SupabaseStorageService) storageService).uploadWebtoonCover(file, webtoonId);
            }
            throw new UnsupportedOperationException("Unsupported storage service");
        }
        
        @Override
        public boolean deleteFile(String fileUrl) {
            if (storageService instanceof FileStorageService) {
                return ((FileStorageService) storageService).deleteFile(fileUrl);
            } else if (storageService instanceof CloudflareR2Service) {
                return ((CloudflareR2Service) storageService).deleteFile(fileUrl);
            } else if (storageService instanceof SupabaseStorageService) {
                return ((SupabaseStorageService) storageService).deleteFile(fileUrl);
            }
            return false;
        }
        
        @Override
        public boolean fileExists(String fileUrl) {
            if (storageService instanceof FileStorageService) {
                return ((FileStorageService) storageService).fileExists(fileUrl);
            } else if (storageService instanceof CloudflareR2Service) {
                return ((CloudflareR2Service) storageService).fileExists(fileUrl);
            } else if (storageService instanceof SupabaseStorageService) {
                return ((SupabaseStorageService) storageService).fileExists(fileUrl);
            }
            return false;
        }
        
        @Override
        public long getFileSize(String fileUrl) {
            if (storageService instanceof FileStorageService) {
                return ((FileStorageService) storageService).getFileSize(fileUrl);
            } else if (storageService instanceof CloudflareR2Service) {
                return ((CloudflareR2Service) storageService).getFileSize(fileUrl);
            } else if (storageService instanceof SupabaseStorageService) {
                return ((SupabaseStorageService) storageService).getFileSize(fileUrl);
            }
            return 0;
        }
    }
}
