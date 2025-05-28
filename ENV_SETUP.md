# Environment Setup Guide

This guide explains how to set up environment variables for development and Docker deployment.

## 🚀 Quick Setup Commands

### For Development with Docker Infrastructure
```bash
# 1. Copy server environment
cp apps/server/.env.example apps/server/.env

# 2. Copy web environment (optional)
cp apps/web/.env.example apps/web/.env.local

# 3. Edit the files with your settings
nano apps/server/.env
```

### For Full Docker Deployment
```bash
# 1. Copy root environment
cp .env.example .env

# 2. Edit with your production settings
nano .env
```

## 📁 Environment Files Overview

| File | Purpose | When to Use |
|------|---------|-------------|
| `.env.example` | Root template | Docker deployment reference |
| `apps/server/.env.example` | Server template | Local server development |
| `apps/web/.env.example` | Web template | Local web development |

## 🔧 Setup for Different Scenarios

### Scenario 1: Development (Recommended)
**Infrastructure in Docker + Apps running locally**

```bash
# Start infrastructure (Kafka only)
pnpm docker:dev

# Set up server environment
cp apps/server/.env.example apps/server/.env
# Edit apps/server/.env:
# - DATABASE_URL=postgresql://neondb_owner:npg_XWSql4CA5zOY@ep-frosty-boat-a53u4vht-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require
# - KAFKA_BROKER=localhost:9092

# Set up web environment
cp apps/web/.env.example apps/web/.env.local
# Edit apps/web/.env.local:
# - NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql

# Run applications
pnpm -C apps/server dev
pnpm -C apps/web dev
```

### Scenario 2: Full Docker Deployment
**Everything in Docker containers**

```bash
# Set up root environment
cp .env.example .env
# Edit .env:
# - Configure email settings
# - Update JWT secret if needed
# - Database is already configured with Neon

# Deploy
pnpm docker:deploy
```

## 🔐 Security Notes

### Development
- ✅ Database is managed by Neon (cloud PostgreSQL)
- ✅ Keep debug features enabled
- ✅ Use localhost URLs
- ✅ GraphQL Playground enabled for testing

### Docker Deployment
- ⚠️ **Use real email credentials for email functionality**
- ⚠️ **Generate secure JWT secret for better security**
- ⚠️ **Database connection is secure with SSL**

## 📧 Email Configuration

### Gmail Setup
1. Enable 2-Factor Authentication
2. Generate App Password:
   - Google Account → Security → App passwords
   - Select "Mail" and generate password
3. Use the generated password in `EMAIL_PASS`

### Other Email Providers
- **Outlook**: smtp-mail.outlook.com:587
- **Yahoo**: smtp.mail.yahoo.com:587
- **Custom SMTP**: Use your provider's settings

## 🔑 JWT Secret Generation

```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Example output:
# a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456789012345678901234567890abcdef1234567890abcdef
```

## 🐛 Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL format for Neon
- Check internet connectivity (Neon is cloud-based)
- Ensure SSL mode is set to 'require'

### Kafka Connection Issues
- Check if Kafka is running: `docker logs kafka`
- Verify KAFKA_BROKER address
- Ensure port 9092 is accessible

### Email Issues
- Verify email credentials
- Check if App Password is used (for Gmail)
- Test SMTP connection

### GraphQL Issues
- Verify server is running on correct port
- Check NEXT_PUBLIC_GRAPHQL_URL format
- Ensure CORS is configured properly
