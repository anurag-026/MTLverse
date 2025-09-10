# MTLverse Deployment Guide

## Prerequisites

### System Requirements
- **OS**: Linux (Ubuntu 20.04+), macOS, or Windows with WSL2
- **RAM**: Minimum 8GB, Recommended 16GB+
- **Storage**: Minimum 50GB free space
- **CPU**: 4+ cores recommended

### Required Software
- Docker 20.10+
- Docker Compose 2.0+
- Node.js 18+
- Java 17+
- Python 3.9+
- Flutter 3.0+
- PostgreSQL 14+ (for local development)
- Redis 6+

## Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-username/MTLverse.git
cd MTLverse
```

### 2. Environment Configuration
```bash
# Copy environment template
cp env.example .env

# Edit environment variables
nano .env
```

### 3. Start Infrastructure Services
```bash
# Start databases and supporting services
docker-compose up -d postgres redis rabbitmq elasticsearch minio

# Wait for services to be ready (about 2-3 minutes)
docker-compose logs -f
```

### 4. Database Setup
```bash
# Run database migrations
cd backend
./mvnw flyway:migrate

# Or using Docker
docker-compose exec backend ./mvnw flyway:migrate
```

### 5. Start Application Services

#### Backend Service
```bash
cd backend
./mvnw spring-boot:run
```

#### ML Service
```bash
cd ml-services
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Service
```bash
cd frontend
npm install
npm start
```

#### Mobile Development
```bash
cd mobile
flutter pub get
flutter run
```

## Production Deployment

### 1. Docker Production Build

#### Build Images
```bash
# Build all services
docker-compose -f docker-compose.prod.yml build

# Or build individual services
docker-compose build backend
docker-compose build frontend
docker-compose build ml-service
```

#### Production Environment
```bash
# Start production environment
docker-compose -f docker-compose.prod.yml up -d
```

### 2. Kubernetes Deployment

#### Prerequisites
- Kubernetes cluster (1.20+)
- kubectl configured
- Helm 3.0+

#### Deploy with Helm
```bash
# Add Helm repository
helm repo add stable https://charts.helm.sh/stable

# Install PostgreSQL
helm install postgresql stable/postgresql \
  --set postgresqlDatabase=mtlverse \
  --set postgresqlUsername=mtlverse_user \
  --set postgresqlPassword=mtlverse_password

# Install Redis
helm install redis stable/redis

# Deploy MTLverse
helm install mtlverse ./deployment/helm/mtlverse
```

#### Manual Kubernetes Deployment
```bash
# Apply configurations
kubectl apply -f deployment/kubernetes/namespace.yaml
kubectl apply -f deployment/kubernetes/configmap.yaml
kubectl apply -f deployment/kubernetes/secrets.yaml
kubectl apply -f deployment/kubernetes/postgres.yaml
kubectl apply -f deployment/kubernetes/redis.yaml
kubectl apply -f deployment/kubernetes/backend.yaml
kubectl apply -f deployment/kubernetes/frontend.yaml
kubectl apply -f deployment/kubernetes/ml-service.yaml
kubectl apply -f deployment/kubernetes/ingress.yaml
```

### 3. Cloud Deployment

#### AWS Deployment
```bash
# Using AWS CDK
cd deployment/aws
npm install
cdk bootstrap
cdk deploy MTLverseStack

# Using Terraform
cd deployment/terraform
terraform init
terraform plan
terraform apply
```

#### Google Cloud Deployment
```bash
# Using gcloud CLI
gcloud container clusters create mtlverse-cluster \
  --num-nodes=3 \
  --machine-type=e2-medium \
  --zone=us-central1-a

# Deploy to GKE
kubectl apply -f deployment/gcp/
```

## Environment-Specific Configurations

### Development
- Hot reload enabled
- Debug logging
- Local database instances
- Mock external APIs

### Staging
- Production-like environment
- Limited external API calls
- Performance monitoring
- Automated testing

### Production
- Optimized performance
- Full monitoring stack
- High availability setup
- Security hardening

## Monitoring Setup

### 1. Prometheus + Grafana
```bash
# Deploy monitoring stack
docker-compose -f docker-compose.monitoring.yml up -d

# Access Grafana
open http://localhost:3001
# Default credentials: admin/admin
```

### 2. ELK Stack
```bash
# Deploy logging stack
docker-compose -f docker-compose.logging.yml up -d

# Access Kibana
open http://localhost:5601
```

### 3. Health Checks
```bash
# Check service health
curl http://localhost:8080/actuator/health
curl http://localhost:3000/health
curl http://localhost:8000/health
```

## Database Management

### Migrations
```bash
# Run migrations
cd backend
./mvnw flyway:migrate

# Rollback migration
./mvnw flyway:repair
```

### Backup
```bash
# Create backup
pg_dump -h localhost -U mtlverse_user mtlverse > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
psql -h localhost -U mtlverse_user mtlverse < backup_file.sql
```

### Redis Management
```bash
# Connect to Redis
redis-cli -h localhost -p 6379

# Clear cache
redis-cli FLUSHALL
```

## Security Configuration

### SSL/TLS Setup
```bash
# Generate SSL certificates
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Configure nginx with SSL
cp nginx/nginx-ssl.conf /etc/nginx/sites-available/mtlverse
ln -s /etc/nginx/sites-available/mtlverse /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### Firewall Configuration
```bash
# UFW configuration
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 8080/tcp  # Backend API
ufw enable
```

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check PostgreSQL status
docker-compose logs postgres

# Test connection
psql -h localhost -U mtlverse_user -d mtlverse
```

#### Redis Connection Issues
```bash
# Check Redis status
docker-compose logs redis

# Test connection
redis-cli -h localhost -p 6379 ping
```

#### Service Startup Issues
```bash
# Check service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs ml-service

# Restart services
docker-compose restart backend
```

### Performance Issues

#### Database Performance
```bash
# Check slow queries
docker-compose exec postgres psql -U mtlverse_user -d mtlverse -c "
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;"
```

#### Memory Usage
```bash
# Check container resource usage
docker stats

# Check specific service
docker stats mtlverse_backend
```

## Scaling

### Horizontal Scaling
```bash
# Scale backend service
docker-compose up -d --scale backend=3

# Scale with Kubernetes
kubectl scale deployment backend --replicas=5
```

### Database Scaling
```bash
# Add read replicas
kubectl apply -f deployment/kubernetes/postgres-read-replica.yaml

# Configure connection pooling
kubectl apply -f deployment/kubernetes/pgpool.yaml
```

## Maintenance

### Regular Tasks
- Database backups (daily)
- Log rotation (weekly)
- Security updates (monthly)
- Performance monitoring (continuous)

### Update Procedures
```bash
# Update application
git pull origin main
docker-compose build
docker-compose up -d

# Update with zero downtime
kubectl rolling-update backend --image=mtlverse/backend:latest
```

## Disaster Recovery

### Backup Strategy
- Database: Daily automated backups
- Files: S3 versioning enabled
- Configuration: Git repository
- Monitoring: Centralized logging

### Recovery Procedures
1. Restore database from backup
2. Redeploy application containers
3. Verify service health
4. Update DNS if needed
5. Monitor for issues
