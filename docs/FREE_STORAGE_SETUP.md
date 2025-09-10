# Free File Storage Setup Guide for MTLverse

This guide explains how to set up free file storage solutions for MTLverse, replacing paid services like AWS S3 and MinIO.

## 🆓 Available Free Storage Options

### 1. **Local File Storage** (Recommended for Development)
- **Cost**: Completely FREE
- **Storage**: Unlimited (limited by your server disk space)
- **Bandwidth**: Unlimited
- **Setup**: Easy, no external accounts needed

### 2. **Cloudflare R2** (Recommended for Production)
- **Cost**: FREE tier - 10GB storage, 1M requests/month
- **Storage**: 10GB free, then $0.015/GB/month
- **Bandwidth**: 10GB free, then $0.09/GB
- **Setup**: Requires Cloudflare account

### 3. **Supabase Storage** (Good for Small Projects)
- **Cost**: FREE tier - 1GB storage, 2GB bandwidth/month
- **Storage**: 1GB free, then $0.021/GB/month
- **Bandwidth**: 2GB free, then $0.09/GB
- **Setup**: Requires Supabase account

## 🚀 Quick Setup

### Option 1: Local File Storage (Default)

This is already configured and ready to use!

```bash
# Start the development environment
docker-compose up -d

# Files will be stored in ./uploads directory
# Access via: http://localhost:8081/files/
```

### Option 2: Cloudflare R2 Setup

1. **Create Cloudflare Account**
   - Go to [cloudflare.com](https://cloudflare.com)
   - Sign up for a free account

2. **Enable R2 Storage**
   - Go to R2 Object Storage in your dashboard
   - Create a new bucket named `mtlverse`
   - Note your Account ID

3. **Create API Token**
   - Go to "My Profile" → "API Tokens"
   - Create token with R2 permissions
   - Note your Access Key ID and Secret Access Key

4. **Configure Environment**
   ```bash
   # Edit .env file
   STORAGE_PROVIDER=r2
   R2_ACCOUNT_ID=your-account-id
   R2_ACCESS_KEY=your-access-key
   R2_SECRET_KEY=your-secret-key
   R2_BUCKET_NAME=mtlverse
   R2_PUBLIC_URL=https://your-bucket.your-account.r2.cloudflarestorage.com
   ```

5. **Add R2 Dependencies**
   ```xml
   <!-- Add to backend/pom.xml -->
   <dependency>
       <groupId>software.amazon.awssdk</groupId>
       <artifactId>s3</artifactId>
       <version>2.20.56</version>
   </dependency>
   ```

### Option 3: Supabase Storage Setup

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up for a free account

2. **Create New Project**
   - Create a new project
   - Note your project URL and anon key

3. **Enable Storage**
   - Go to Storage in your project dashboard
   - Create a new bucket named `mtlverse`
   - Set it to public

4. **Configure Environment**
   ```bash
   # Edit .env file
   STORAGE_PROVIDER=supabase
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_BUCKET_NAME=mtlverse
   ```

## 🔧 Configuration Details

### Environment Variables

```bash
# Storage Provider Selection
STORAGE_PROVIDER=local  # Options: local, r2, supabase

# Local Storage (Default)
FILE_STORAGE_URL=http://localhost:8081
FILE_STORAGE_PATH=./uploads

# Cloudflare R2
R2_ACCOUNT_ID=your-cloudflare-account-id
R2_ACCESS_KEY=your-r2-access-key
R2_SECRET_KEY=your-r2-secret-key
R2_BUCKET_NAME=mtlverse
R2_PUBLIC_URL=https://your-bucket.your-account.r2.cloudflarestorage.com

# Supabase Storage
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_BUCKET_NAME=mtlverse
```

### File Structure

```
uploads/
├── webtoons/
│   ├── {webtoon-id}/
│   │   ├── covers/
│   │   └── chapters/
│   │       └── {chapter-id}/
│   │           └── {page-images}
├── avatars/
│   └── {user-id}/
│       └── {avatar-images}
└── temp/
    └── {temporary-files}
```

## 📊 Storage Comparison

| Feature | Local Storage | Cloudflare R2 | Supabase |
|---------|---------------|---------------|----------|
| **Cost** | FREE | 10GB free | 1GB free |
| **Setup** | ✅ Easy | ⚠️ Medium | ⚠️ Medium |
| **Scalability** | ❌ Limited | ✅ High | ⚠️ Medium |
| **CDN** | ❌ No | ✅ Yes | ✅ Yes |
| **Backup** | ❌ Manual | ✅ Automatic | ✅ Automatic |
| **Global Access** | ❌ No | ✅ Yes | ✅ Yes |
| **Bandwidth** | Unlimited | 10GB free | 2GB free |

## 🎯 Recommendations

### For Development
- **Use Local Storage**: Simple, fast, no external dependencies
- **Perfect for**: Testing, local development, small projects

### For Production (Small Scale)
- **Use Supabase**: 1GB free, easy setup, good for MVP
- **Perfect for**: Small projects, prototypes, limited content

### For Production (Large Scale)
- **Use Cloudflare R2**: 10GB free, excellent performance, global CDN
- **Perfect for**: Production apps, high traffic, global users

## 🔄 Switching Storage Providers

You can easily switch between storage providers by changing one environment variable:

```bash
# Switch to local storage
STORAGE_PROVIDER=local

# Switch to Cloudflare R2
STORAGE_PROVIDER=r2

# Switch to Supabase
STORAGE_PROVIDER=supabase
```

No code changes required! The application will automatically use the configured storage provider.

## 🛠️ Advanced Configuration

### Custom File Naming
Files are automatically organized by date and type:
- Format: `{type}/{year}/{month}/{day}/{uuid}.{extension}`
- Example: `webtoons/2024/01/15/abc123-def456.jpg`

### File Validation
All storage providers include:
- File type validation (images only)
- File size limits (configurable)
- Security checks
- Duplicate prevention

### Error Handling
- Automatic retry on upload failures
- Graceful fallback to local storage
- Comprehensive logging
- Health checks

## 📈 Monitoring Storage Usage

### Local Storage
```bash
# Check disk usage
df -h ./uploads

# Count files
find ./uploads -type f | wc -l
```

### Cloudflare R2
- Monitor usage in Cloudflare dashboard
- Set up billing alerts
- Track API requests

### Supabase
- Monitor usage in Supabase dashboard
- Check storage metrics
- Set up usage alerts

## 🚨 Troubleshooting

### Common Issues

1. **File Upload Fails**
   - Check file size limits
   - Verify file type is allowed
   - Ensure storage service is running

2. **Images Not Loading**
   - Check CORS configuration
   - Verify public URL is correct
   - Ensure file exists in storage

3. **Storage Quota Exceeded**
   - Clean up old files
   - Upgrade storage plan
   - Switch to different provider

### Debug Commands

```bash
# Check storage service health
curl http://localhost:8081/health

# Test file upload
curl -X POST -F "file=@test.jpg" http://localhost:8080/api/upload

# Check storage configuration
docker-compose logs file-server
```

## 💡 Tips for Cost Optimization

1. **Image Compression**: Compress images before upload
2. **CDN Usage**: Use Cloudflare's free CDN
3. **Cleanup**: Regularly delete unused files
4. **Monitoring**: Set up usage alerts
5. **Caching**: Implement proper caching strategies

## 🔐 Security Considerations

1. **File Validation**: Always validate file types and sizes
2. **Access Control**: Implement proper authentication
3. **CORS**: Configure CORS properly
4. **HTTPS**: Use HTTPS in production
5. **Backup**: Regular backups of important files

---

**Need Help?** Check the main documentation or create an issue on GitHub!
