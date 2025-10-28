# Seed Data Setup Guide

This guide explains how to set up the seed data script to populate your database.

## 📋 Prerequisites

1. **jaayvee-world API Running**: The main jaayvee-world API server must be running
2. **Database Access**: Ensure jaayvee-world has Supabase credentials configured
3. **Environment Variables**: Set up the jaayvee-world API URL

## 🔧 Configuration

### 1. Set jaayvee-world API URL

The seed script calls the jaayvee-world registration API (defaults to production):

```bash
export JAAYVEE_API_BASE_URL=https://talaash.thejaayveeworld.com
```

Or add it to your `.env` file:

```
JAAYVEE_API_BASE_URL=https://talaash.thejaayveeworld.com
```

**Default**: The script uses `https://talaash.thejaayveeworld.com` if no environment variable is set.

### 2. jaayvee-world API Integration

The seed script calls the existing jaayvee-world `/api/auth/register` endpoint, which:
- Creates users in the Supabase database
- Assigns appropriate roles
- Returns user data with IDs

## 🚀 Usage

### Generate and Register Seed Data

```bash
npm run seed
```

This will:
1. ✅ Generate seed-data.json with test data
2. ✅ Register influencers via jaayvee-world API
3. ✅ Save registration-results.json with detailed results

### Generated Files

- **seed-data.json**: Complete test data for all entities
- **registration-results.json**: Detailed registration results for each influencer

## 📝 Registration Results

The script will show:

```
📊 Registration Summary:
   ✅ Successful: 5
   ❌ Failed: 0
```

If any registrations fail, details will be displayed:

```
⚠️ Failed Registrations:
   - Sarah Johnson: User with this email already exists
```

## 🔐 Test Credentials

After seeding, you can use these credentials to test:

| Email | Password | Name | Tier |
|-------|----------|------|------|
| sarah.johnson@example.com | Password123! | Sarah Johnson | Gold |
| mike.chen@example.com | Password123! | Mike Chen | Platinum |
| emma.davis@example.com | Password123! | Emma Davis | Silver |
| alex.rivera@example.com | Password123! | Alex Rivera | Platinum |
| lisa.wang@example.com | Password123! | Lisa Wang | Gold |

## 🎯 Next Steps

1. **Start jaayvee-world API**: Ensure the main API server is running
2. **Verify Database**: Check that Supabase tables exist (users, roles, etc.)
3. **Test Authentication**: Verify the registered users can log in
4. **Check Roles**: Ensure influencer roles are configured in jaayvee-world

## 🛠️ Customization

You can modify the seed script to:

- Add more influencers or campaigns
- Change data values
- Add new data types
- Adjust registration logic

Edit `scripts/seed.ts` to customize the seed data generation.

## 🔧 Troubleshooting

### API Connection Issues

If you see errors like "Unexpected token '<', "<!DOCTYPE "... is not valid JSON":

1. **Check jaayvee-world API is accessible**:
   ```bash
   curl https://talaash.thejaayveeworld.com/api/auth/register
   ```

2. **Use local development if needed**:
   ```bash
   export JAAYVEE_API_BASE_URL=http://localhost:3000
   ```

3. **Check API endpoint exists**: Ensure `/api/auth/register` is available in jaayvee-world

### Common Issues

- **API not running**: Start the jaayvee-world development server first
- **Wrong port**: Check which port jaayvee-world is running on
- **CORS issues**: The API might need CORS configuration for cross-origin requests
- **Database connection**: Ensure jaayvee-world can connect to Supabase

## 📞 Support

For issues or questions:
1. Check the registration-results.json for detailed error messages
2. Verify jaayvee-world API is running and accessible
3. Ensure database tables are properly configured
4. Review the console output for specific errors
5. Test the API endpoint manually with curl or Postman
