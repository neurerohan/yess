# Sanity CORS Configuration Instructions

1. Go to your Sanity project dashboard: https://www.sanity.io/manage

2. Select your project 'omn0qhtn'

3. Navigate to 'API' tab

4. Under 'CORS origins', click 'Add CORS origin'

5. Add your frontend URL:
   - Development: http://localhost:3001
   - Production: https://yourdomain.com (replace with your actual domain)

6. Make sure to check 'Allow credentials' if your application needs to send credentials

7. Save your changes

Your Sanity client is now configured to use:
- Project ID: omn0qhtn
- Dataset: blogs
- Document types: blogPost (instead of post)

If you need to make authenticated requests, you'll also need to add a token in your .env file:
```
VITE_SANITY_TOKEN=your_token_here
```

You can generate a token in the Sanity dashboard under API > Tokens.
