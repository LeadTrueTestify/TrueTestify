# TrueTestify MVP - Video Testimonial Platform

A lightweight, video-first SaaS platform designed to collect, display, and manage video testimonials, optimized for ease of use, fast embeds, and emotional trust-building.

## 🎯 Core Purpose

TrueTestify leverages the power of video to build trust through authentic, human-centered testimonials. Faces convey credibility and emotion far beyond stars or text, making video the cornerstone of our platform.

## 🏗️ Project Structure

```
TrueTestify/
├── backend/        # NestJS API server
├── frontend/       # React frontend application
└── README.md       # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js**: Version 18 or higher
- **PostgreSQL**: Database for storing user and review data
- **Redis**: Optional, for caching
- **AWS S3**: Account for video and audio storage
- **Stripe**: Account for billing and subscription management

### Backend Setup

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your credentials:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/truetestify?schema=public"

   # JWT
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="7d"

   # Server
   PORT=3000
   NODE_ENV="development"

   # Frontend URL for CORS
   FRONTEND_URL="http://localhost:5173"

   # AWS S3 Configuration
   AWS_ACCESS_KEY_ID="your-aws-access-key"
   AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
   AWS_REGION="us-east-1"
   AWS_S3_BUCKET="truetestify-videos"

   # Stripe Configuration
   STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
   STRIPE_WEBHOOK_SECRET="whsec_your-stripe-webhook-secret"

   # Redis (optional, for caching)
   REDIS_URL="redis://localhost:6379"
   ```

4. **Set up database:**

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start the development server:**

   ```bash
   npm run start:dev
   ```

   The backend will be available at `http://localhost:3000`.  
   API documentation is accessible at `http://localhost:3000/api-docs`.

### Frontend Setup

1. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file:

   ```env
   VITE_BASE_URL="http://localhost:3000"
   VITE_S3_BASE_URL="https://truetestify-videos.s3.us-east-1.amazonaws.com/"
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`.

## 🔑 Core Features

### ✅ 1. Video Review Collection
- Record or upload testimonials directly in-browser or on mobile.
- Maximum duration: 60 seconds.
- Auto-compression to 720p for optimal storage and playback.
- Preview functionality before submission.

### ✅ 2. Public Review Page
- Custom URL: `truetestify.com/yourbusiness`.
- Displays a hero video gallery with customizable layouts.
- Supports business branding (logo, colors).
- Includes a prominent "Leave a Review" CTA button.

### ✅ 3. Embeddable Widget
- Auto-generated widget code for easy integration.
- Layout options: Grid, Carousel, Spotlight, Floating Bubble.
- Responsive design with consistent card sizes (`480px` height, `560px` on medium screens).
- Color accents: Orange (video), Purple (audio), Green (text).

### ✅ 4. Moderation System
- Admin dashboard to approve, reject, or reorder reviews.
- Toggle visibility for individual reviews.
- Supports video, audio, and text reviews with consistent layouts.

### ✅ 5. Storage-Based Billing
- Stripe integration for seamless payments.
- Pricing tiers based on gigabytes of video storage.
- Automatic widget hiding on payment failure.

### ✅ 6. Basic Analytics
- Tracks videos collected, widget views, and storage usage.
- Accessible via admin dashboard.

### ✅ 7. Privacy & Legal Compliance
- Consent checkbox required before recording.
- GDPR and CCPA compliant.
- Supports user right-to-delete requests.

## 🎨 Branding and Colors

- **Blue**: Represents trust, reliability, and professionalism (`#1e3a8a` for logo, `#3b82f6` for SaaS elements).
- **Orange**: Conveys energy, friendliness, and calls-to-action (`#ef7c00` for CTAs, `#fed7aa` for highlights).
- **Widget Accents**:
  - Video: Orange (`bg-orange-100`, `text-orange-600`).
  - Audio: Purple (`bg-purple-100`, `text-purple-600`).
  - Text: Green (`bg-green-100`, `text-green-600`).
- **Typography**: Clean, modern fonts (`font-bold` for titles, `font-medium` for details).

## 📝 Documentation

Additional project documentation, including detailed API specifications, design notes, and collaboration guidelines, is available in our [Google Docs](https://docs.google.com/document/d/PLACEHOLDER_DOCUMENT_ID/edit). Replace `PLACEHOLDER_DOCUMENT_ID` with the actual Google Docs ID provided by the project team.

## 🔌 API Endpoints

Below is a detailed list of all API endpoints, including their purpose, request/response formats, and testing instructions.

### Authentication

#### `POST /api/v1/auth/login`
- **Description**: Authenticates a user and returns a JWT token.
- **Request**:
  - **Body**:
    ```json
    {
      "email": "user@example.com",
      "password": "securepassword123"
    }
    ```
- **Response**:
  - **Success (200)**:
    ```json
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
  - **Error (401)**:
    ```json
    {
      "statusCode": 401,
      "message": "Invalid credentials"
    }
    ```
- **Testing**:
  1. Start the backend (`npm run start:dev`).
  2. Use cURL:
     ```bash
     curl -X POST http://localhost:3000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com","password":"securepassword123"}'
     ```
  3. Or use Postman:
     - Set method to `POST`, URL to `http://localhost:3000/api/v1/auth/login`.
     - Add JSON body as above.
     - Send and verify the `accessToken` in the response.

#### `POST /api/v1/auth/register`
- **Description**: Registers a new user and creates a tenant.
- **Request**:
  - **Body**:
    ```json
    {
      "email": "newuser@example.com",
      "password": "securepassword123",
      "name": "John Doe",
      "tenantName": "MyBusiness",
      "tenantSlug": "mybusiness"
    }
    ```
- **Response**:
  - **Success (201)**:
    ```json
    {
      "user": {
        "id": "uuid",
        "email": "newuser@example.com",
        "name": "John Doe"
      },
      "tenant": {
        "id": "uuid",
        "slug": "mybusiness",
        "name": "MyBusiness"
      },
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
  - **Error (400)**:
    ```json
    {
      "statusCode": 400,
      "message": "Email already exists"
    }
    ```
- **Testing**:
  1. Start the backend.
  2. Use cURL:
     ```bash
     curl -X POST http://localhost:3000/api/v1/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"newuser@example.com","password":"securepassword123","name":"John Doe","tenantName":"MyBusiness","tenantSlug":"mybusiness"}'
     ```
  3. Or use Postman:
     - Set method to `POST`, URL to `http://localhost:3000/api/v1/auth/register`.
     - Add JSON body as above.
     - Verify the response contains `user`, `tenant`, and `accessToken`.

#### `GET /api/v1/users/:id`
- **Description**: Retrieves user information (requires JWT).
- **Request**:
  - **Path Parameter**: `id` (UUID of the user).
  - **Headers**: `Authorization: Bearer <accessToken>`.
- **Response**:
  - **Success (200)**:
    ```json
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "tenantId": "uuid",
      "createdAt": "2025-09-05T12:00:00Z",
      "updatedAt": "2025-09-05T12:00:00Z"
    }
    ```
  - **Error (401)**:
    ```json
    {
      "statusCode": 401,
      "message": "Unauthorized"
    }
    ```
- **Testing**:
  1. Obtain an `accessToken` from `/auth/login`.
  2. Use cURL:
     ```bash
     curl -X GET http://localhost:3000/api/v1/users/<user-id> \
     -H "Authorization: Bearer <accessToken>"
     ```
  3. Or use Postman:
     - Set method to `GET`, URL to `http://localhost:3000/api/v1/users/<user-id>`.
     - Add `Authorization` header with `Bearer <accessToken>`.
     - Verify user details in the response.

### Tenants

#### `GET /api/v1/tenants/:slug`
- **Description**: Retrieves tenant details by slug (public endpoint).
- **Request**:
  - **Path Parameter**: `slug` (tenant’s unique slug, e.g., `mybusiness`).
- **Response**:
  - **Success (200)**:
    ```json
    {
      "id": "uuid",
      "slug": "mybusiness",
      "name": "MyBusiness",
      "logoUrl": "https://truetestify-videos.s3.us-east-1.amazonaws.com/logo.png",
      "primaryColor": "#ef7c00",
      "createdAt": "2025-09-05T12:00:00Z",
      "updatedAt": "2025-09-05T12:00:00Z"
    }
    ```
  - **Error (404)**:
    ```json
    {
      "statusCode": 404,
      "message": "Tenant not found"
    }
    ```
- **Testing**:
  1. Start the backend.
  2. Use cURL:
     ```bash
     curl -X GET http://localhost:3000/api/v1/tenants/mybusiness
     ```
  3. Or use Postman:
     - Set method to `GET`, URL to `http://localhost:3000/api/v1/tenants/mybusiness`.
     - Verify tenant details in the response.

#### `GET /api/v1/tenants/slug/:slug`
- **Description**: Alternative endpoint to retrieve tenant details by slug.
- **Request**:
  - **Path Parameter**: `slug` (tenant’s unique slug).
- **Response**: Same as `GET /api/v1/tenants/:slug`.
- **Testing**: Same as `GET /api/v1/tenants/:slug`.

#### `PATCH /api/v1/tenants/:id`
- **Description**: Updates tenant details (requires JWT).
- **Request**:
  - **Path Parameter**: `id` (UUID of the tenant).
  - **Headers**: `Authorization: Bearer <accessToken>`.
  - **Body**:
    ```json
    {
      "name": "Updated Business",
      "logoUrl": "https://truetestify-videos.s3.us-east-1.amazonaws.com/new-logo.png",
      "primaryColor": "#3b82f6"
    }
    ```
- **Response**:
  - **Success (200)**:
    ```json
    {
      "id": "uuid",
      "slug": "mybusiness",
      "name": "Updated Business",
      "logoUrl": "https://truetestify-videos.s3.us-east-1.amazonaws.com/new-logo.png",
      "primaryColor": "#3b82f6",
      "createdAt": "2025-09-05T12:00:00Z",
      "updatedAt": "2025-09-06T12:00:00Z"
    }
    ```
  - **Error (401)**:
    ```json
    {
      "statusCode": 401,
      "message": "Unauthorized"
    }
    ```
- **Testing**:
  1. Obtain an `accessToken` from `/auth/login`.
  2. Use cURL:
     ```bash
     curl -X PATCH http://localhost:3000/api/v1/tenants/<tenant-id> \
     -H "Authorization: Bearer <accessToken>" \
     -H "Content-Type: application/json" \
     -d '{"name":"Updated Business","logoUrl":"https://truetestify-videos.s3.us-east-1.amazonaws.com/new-logo.png","primaryColor":"#3b82f6"}'
     ```
  3. Or use Postman:
     - Set method to `PATCH`, URL to `http://localhost:3000/api/v1/tenants/<tenant-id>`.
     - Add `Authorization` header and JSON body.
     - Verify updated tenant details.

### Reviews

#### `POST /api/v1/reviews/:tenantSlug`
- **Description**: Submits a new review (public endpoint).
- **Request**:
  - **Path Parameter**: `tenantSlug` (tenant’s slug).
  - **Body**:
    ```json
    {
      "type": "video",
      "title": "Great Service",
      "bodyText": "This product transformed my business!",
      "rating": 5,
      "reviewerName": "John Doe",
      "mediaAssets": [
        {
          "s3Key": "glambeauty/reviews/video/video-uuid.webm",
          "fileType": "video/mp4",
          "fileSize": 5242880
        }
      ]
    }
    ```
- **Response**:
  - **Success (201)**:
    ```json
    {
      "id": "uuid",
      "tenantId": "uuid",
      "type": "video",
      "title": "Great Service",
      "bodyText": "This product transformed my business!",
      "rating": 5,
      "reviewerName": "John Doe",
      "submittedAt": "2025-09-05T12:00:00Z",
      "status": "pending",
      "createdAt": "2025-09-05T12:00:00Z",
      "updatedAt": "2025-09-05T12:00:00Z"
    }
    ```
  - **Error (400)**:
    ```json
    {
      "statusCode": 400,
      "message": "Invalid review type"
    }
    ```
- **Testing**:
  1. Ensure S3 bucket is configured (`AWS_S3_BUCKET` in `.env`).
  2. Use cURL:
     ```bash
     curl -X POST http://localhost:3000/api/v1/reviews/mybusiness \
     -H "Content-Type: application/json" \
     -d '{"type":"video","title":"Great Service","bodyText":"This product transformed my business!","rating":5,"reviewerName":"John Doe","mediaAssets":[{"s3Key":"glambeauty/reviews/video/video-uuid.webm","fileType":"video/mp4","fileSize":5242880}]}'
     ```
  3. Or use Postman:
     - Set method to `POST`, URL to `http://localhost:3000/api/v1/reviews/mybusiness`.
     - Add JSON body as above.
     - Verify the review is created with `status: "pending"`.

#### `GET /api/v1/reviews/tenant/:tenantId`
- **Description**: Retrieves approved reviews for a tenant (public endpoint).
- **Request**:
  - **Path Parameter**: `tenantId` (UUID of the tenant).
- **Response**:
  - **Success (200)**:
    ```json
    [
      {
        "id": "uuid",
        "type": "video",
        "title": "Great Service",
        "rating": 5,
        "reviewerName": "John Doe",
        "submittedAt": "2025-09-05T12:00:00Z",
        "status": "approved",
        "mediaAssets": [
          {
            "s3Key": "glambeauty/reviews/video/video-uuid.webm",
            "fileType": "video/mp4",
            "fileSize": 5242880
          }
        ]
      }
    ]
    ```
  - **Error (404)**:
    ```json
    {
      "statusCode": 404,
      "message": "Tenant not found"
    }
    ```
- **Testing**:
  1. Use cURL:
     ```bash
     curl -X GET http://localhost:3000/api/v1/reviews/tenant/<tenant-id>
     ```
  2. Or use Postman:
     - Set method to `GET`, URL to `http://localhost:3000/api/v1/reviews/tenant/<tenant-id>`.
     - Verify the response contains approved reviews.

#### `GET /api/v1/reviews/:id`
- **Description**: Retrieves a specific review by ID.
- **Request**:
  - **Path Parameter**: `id` (UUID of the review).
- **Response**:
  - **Success (200)**:
    ```json
    {
      "id": "uuid",
      "type": "video",
      "title": "Great Service",
      "bodyText": "This product transformed my business!",
      "rating": 5,
      "reviewerName": "John Doe",
      "submittedAt": "2025-09-05T12:00:00Z",
      "status": "approved",
      "mediaAssets": [
        {
          "s3Key": "glambeauty/reviews/video/video-uuid.webm",
          "fileType": "video/mp4",
          "fileSize": 5242880
        }
      ]
    }
    ```
  - **Error (404)**:
    ```json
    {
      "statusCode": 404,
      "message": "Review not found"
    }
    ```
- **Testing**:
  1. Use cURL:
     ```bash
     curl -X GET http://localhost:3000/api/v1/reviews/<review-id>
     ```
  2. Or use Postman:
     - Set method to `GET`, URL to `http://localhost:3000/api/v1/reviews/<review-id>`.
     - Verify review details.

#### `PATCH /api/v1/reviews/:id/approve`
- **Description**: Approves a review (requires JWT).
- **Request**:
  - **Path Parameter**: `id` (UUID of the review).
  - **Headers**: `Authorization: Bearer <accessToken>`.
- **Response**:
  - **Success (200)**:
    ```json
    {
      "id": "uuid",
      "status": "approved",
      "updatedAt": "2025-09-06T12:00:00Z"
    }
    ```
  - **Error (401)**:
    ```json
    {
      "statusCode": 401,
      "message": "Unauthorized"
    }
    ```
- **Testing**:
  1. Obtain an `accessToken` from `/auth/login`.
  2. Use cURL:
     ```bash
     curl -X PATCH http://localhost:3000/api/v1/reviews/<review-id>/approve \
     -H "Authorization: Bearer <accessToken>"
     ```
  3. Or use Postman:
     - Set method to `PATCH`, URL to `http://localhost:3000/api/v1/reviews/<review-id>/approve`.
     - Add `Authorization` header.
     - Verify `status: "approved"`.

#### `PATCH /api/v1/reviews/:id/reject`
- **Description**: Rejects a review (requires JWT).
- **Request**:
  - **Path Parameter**: `id` (UUID of the review).
  - **Headers**: `Authorization: Bearer <accessToken>`.
- **Response**:
  - **Success (200)**:
    ```json
    {
      "id": "uuid",
      "status": "rejected",
      "updatedAt": "2025-09-06T12:00:00Z"
    }
    ```
  - **Error (401)**:
    ```json
    {
      "statusCode": 401,
      "message": "Unauthorized"
    }
    ```
- **Testing**:
  1. Obtain an `accessToken`.
  2. Use cURL:
     ```bash
     curl -X PATCH http://localhost:3000/api/v1/reviews/<review-id>/reject \
     -H "Authorization: Bearer <accessToken>"
     ```
  3. Or use Postman:
     - Set method to `PATCH`, URL to `http://localhost:3000/api/v1/reviews/<review-id>/reject`.
     - Add `Authorization` header.
     - Verify `status: "rejected"`.

#### `PATCH /api/v1/reviews/:id/hide`
- **Description**: Hides a review (requires JWT).
- **Request**:
  - **Path Parameter**: `id` (UUID of the review).
  - **Headers**: `Authorization: Bearer <accessToken>`.
- **Response**:
  - **Success (200)**:
    ```json
    {
      "id": "uuid",
      "status": "hidden",
      "updatedAt": "2025-09-06T12:00:00Z"
    }
    ```
  - **Error (401)**:
    ```json
    {
      "statusCode": 401,
      "message": "Unauthorized"
    }
    ```
- **Testing**:
  1. Obtain an `accessToken`.
  2. Use cURL:
     ```bash
     curl -X PATCH http://localhost:3000/api/v1/reviews/<review-id>/hide \
     -H "Authorization: Bearer <accessToken>"
     ```
  3. Or use Postman:
     - Set method to `PATCH`, URL to `http://localhost:3000/api/v1/reviews/<review-id>/hide`.
     - Add `Authorization` header.
     - Verify `status: "hidden"`.

### Widgets

#### `POST /api/v1/widgets`
- **Description**: Creates a new widget (requires JWT).
- **Request**:
  - **Headers**: `Authorization: Bearer <accessToken>`.
  - **Body**:
    ```json
    {
      "tenantId": "uuid",
      "type": "grid",
      "name": "Main Widget",
      "settings": {
        "layout": "grid",
        "columns": 3,
        "primaryColor": "#ef7c00"
      }
    }
    ```
- **Response**:
  - **Success (201)**:
    ```json
    {
      "id": "uuid",
      "tenantId": "uuid",
      "type": "grid",
      "name": "Main Widget",
      "settings": {
        "layout": "grid",
        "columns": 3,
        "primaryColor": "#ef7c00"
      },
      "createdAt": "2025-09-05T12:00:00Z",
      "updatedAt": "2025-09-05T12:00:00Z"
    }
    ```
  - **Error (401)**:
    ```json
    {
      "statusCode": 401,
      "message": "Unauthorized"
    }
    ```
- **Testing**:
  1. Obtain an `accessToken`.
  2. Use cURL:
     ```bash
     curl -X POST http://localhost:3000/api/v1/widgets \
     -H "Authorization: Bearer <accessToken>" \
     -H "Content-Type: application/json" \
     -d '{"tenantId":"uuid","type":"grid","name":"Main Widget","settings":{"layout":"grid","columns":3,"primaryColor":"#ef7c00"}}'
     ```
  3. Or use Postman:
     - Set method to `POST`, URL to `http://localhost:3000/api/v1/widgets`.
     - Add `Authorization` header and JSON body.
     - Verify widget creation.

#### `GET /api/v1/widgets/tenant/:tenantId`
- **Description**: Retrieves widgets for a tenant (requires JWT).
- **Request**:
  - **Path Parameter**: `tenantId` (UUID of the tenant).
  - **Headers**: `Authorization: Bearer <accessToken>`.
- **Response**:
  - **Success (200)**:
    ```json
    [
      {
        "id": "uuid",
        "tenantId": "uuid",
        "type": "grid",
        "name": "Main Widget",
        "settings": {
          "layout": "grid",
          "columns": 3,
          "primaryColor": "#ef7c00"
        },
        "createdAt": "2025-09-05T12:00:00Z",
        "updatedAt": "2025-09-05T12:00:00Z"
      }
    ]
    ```
  - **Error (401)**:
    ```json
    {
      "statusCode": 401,
      "message": "Unauthorized"
    }
    ```
- **Testing**:
  1. Obtain an `accessToken`.
  2. Use cURL:
     ```bash
     curl -X GET http://localhost:3000/api/v1/widgets/tenant/<tenant-id> \
     -H "Authorization: Bearer <accessToken>"
     ```
  3. Or use Postman:
     - Set method to `GET`, URL to `http://localhost:3000/api/v1/widgets/tenant/<tenant-id>`.
     - Add `Authorization` header.
     - Verify widget list.

#### `GET /api/v1/widgets/:id`
- **Description**: Retrieves a specific widget by ID (requires JWT).
- **Request**:
  - **Path Parameter**: `id` (UUID of the widget).
  - **Headers**: `Authorization: Bearer <accessToken>`.
- **Response**:
  - **Success (200)**:
    ```json
    {
      "id": "uuid",
      "tenantId": "uuid",
      "type": "grid",
      "name": "Main Widget",
      "settings": {
        "layout": "grid",
        "columns": 3,
        "primaryColor": "#ef7c00"
      },
      "createdAt": "2025-09-05T12:00:00Z",
      "updatedAt": "2025-09-05T12:00:00Z"
    }
    ```
  - **Error (404)**:
    ```json
    {
      "statusCode": 404,
      "message": "Widget not found"
    }
    ```
- **Testing**:
  1. Obtain an `accessToken`.
  2. Use cURL:
     ```bash
     curl -X GET http://localhost:3000/api/v1/widgets/<widget-id> \
     -H "Authorization: Bearer <accessToken>"
     ```
  3. Or use Postman:
     - Set method to `GET`, URL to `http://localhost:3000/api/v1/widgets/<widget-id>`.
     - Add `Authorization` header.
     - Verify widget details.

#### `PATCH /api/v1/widgets/:id`
- **Description**: Updates a widget’s settings (requires JWT).
- **Request**:
  - **Path Parameter**: `id` (UUID of the widget).
  - **Headers**: `Authorization: Bearer <accessToken>`.
  - **Body**:
    ```json
    {
      "name": "Updated Widget",
      "settings": {
        "layout": "carousel",
        "columns": 2,
        "primaryColor": "#3b82f6"
      }
    }
    ```
- **Response**:
  - **Success (200)**:
    ```json
    {
      "id": "uuid",
      "tenantId": "uuid",
      "type": "carousel",
      "name": "Updated Widget",
      "settings": {
        "layout": "carousel",
        "columns": 2,
        "primaryColor": "#3b82f6"
      },
      "createdAt": "2025-09-05T12:00:00Z",
      "updatedAt": "2025-09-06T12:00:00Z"
    }
    ```
  - **Error (401)**:
    ```json
    {
      "statusCode": 401,
      "message": "Unauthorized"
    }
    ```
- **Testing**:
  1. Obtain an `accessToken`.
  2. Use cURL:
     ```bash
     curl -X PATCH http://localhost:3000/api/v1/widgets/<widget-id> \
     -H "Authorization: Bearer <accessToken>" \
     -H "Content-Type: application/json" \
     -d '{"name":"Updated Widget","settings":{"layout":"carousel","columns":2,"primaryColor":"#3b82f6"}}'
     ```
  3. Or use Postman:
     - Set method to `PATCH`, URL to `http://localhost:3000/api/v1/widgets/<widget-id>`.
     - Add `Authorization` header and JSON body.
     - Verify updated widget details.

### Analytics

#### `GET /api/v1/analytics/tenant/:tenantId`
- **Description**: Retrieves analytics for a tenant (requires JWT).
- **Request**:
  - **Path Parameter**: `tenantId` (UUID of the tenant).
  - **Headers**: `Authorization: Bearer <accessToken>`.
- **Response**:
  - **Success (200)**:
    ```json
    {
      "tenantId": "uuid",
      "videosCollected": 10,
      "widgetViews": 1000,
      "storageUsed": 5,
      "storageLimit": 50
    }
    ```
  - **Error (401)**:
    ```json
    {
      "statusCode": 401,
      "message": "Unauthorized"
    }
    ```
- **Testing**:
  1. Obtain an `accessToken`.
  2. Use cURL:
     ```bash
     curl -X GET http://localhost:3000/api/v1/analytics/tenant/<tenant-id> \
     -H "Authorization: Bearer <accessToken>"
     ```
  3. Or use Postman:
     - Set method to `GET`, URL to `http://localhost:3000/api/v1/analytics/tenant/<tenant-id>`.
     - Add `Authorization` header.
     - Verify analytics data.

#### `GET /api/v1/analytics/widget/:widgetId/views`
- **Description**: Retrieves view counts for a specific widget (requires JWT).
- **Request**:
  - **Path Parameter**: `widgetId` (UUID of the widget).
  - **Headers**: `Authorization: Bearer <accessToken>`.
- **Response**:
  - **Success (200)**:
    ```json
    {
      "widgetId": "uuid",
      "views": 500
    }
    ```
  - **Error (404)**:
    ```json
    {
      "statusCode": 404,
      "message": "Widget not found"
    }
    ```
- **Testing**:
  1. Obtain an `accessToken`.
  2. Use cURL:
     ```bash
     curl -X GET http://localhost:3000/api/v1/analytics/widget/<widget-id>/views \
     -H "Authorization: Bearer <accessToken>"
     ```
  3. Or use Postman:
     - Set method to `GET`, URL to `http://localhost:3000/api/v1/analytics/widget/<widget-id>/views`.
     - Add `Authorization` header.
     - Verify view count.

### Billing

#### `GET /api/v1/billing/tenant/:tenantId`
- **Description**: Retrieves billing account details for a tenant (requires JWT).
- **Request**:
  - **Path Parameter**: `tenantId` (UUID of the tenant).
  - **Headers**: `Authorization: Bearer <accessToken>`.
- **Response**:
  - **Success (200)**:
    ```json
    {
      "id": "uuid",
      "tenantId": "uuid",
      "stripeCustomerId": "cus_xxx",
      "subscriptionId": "sub_xxx",
      "storageLimit": 50,
      "storageUsed": 5,
      "createdAt": "2025-09-05T12:00:00Z",
      "updatedAt": "2025-09-05T12:00:00Z"
    }
    ```
  - **Error (401)**:
    ```json
    {
      "statusCode": 401,
      "message": "Unauthorized"
    }
    ```
- **Testing**:
  1. Obtain an `accessToken`.
  2. Use cURL:
     ```bash
     curl -X GET http://localhost:3000/api/v1/billing/tenant/<tenant-id> \
     -H "Authorization: Bearer <accessToken>"
     ```
  3. Or use Postman:
     - Set method to `GET`, URL to `http://localhost:3000/api/v1/billing/tenant/<tenant-id>`.
     - Add `Authorization` header.
     - Verify billing details.

#### `POST /api/v1/billing/checkout`
- **Description**: Creates a Stripe checkout session (requires JWT).
- **Request**:
  - **Headers**: `Authorization: Bearer <accessToken>`.
  - **Body**:
    ```json
    {
      "tenantId": "uuid",
      "planId": "price_xxx"
    }
    ```
- **Response**:
  - **Success (200)**:
    ```json
    {
      "sessionId": "cs_xxx",
      "url": "https://checkout.stripe.com/pay/cs_xxx"
    }
    ```
  - **Error (401)**:
    ```json
    {
      "statusCode": 401,
      "message": "Unauthorized"
    }
    ```
- **Testing**:
  1. Obtain an `accessToken`.
  2. Use cURL:
     ```bash
     curl -X POST http://localhost:3000/api/v1/billing/checkout \
     -H "Authorization: Bearer <accessToken>" \
     -H "Content-Type: application/json" \
     -d '{"tenantId":"uuid","planId":"price_xxx"}'
     ```
  3. Or use Postman:
     - Set method to `POST`, URL to `http://localhost:3000/api/v1/billing/checkout`.
     - Add `Authorization` header and JSON body.
     - Open the returned `url` in a browser to complete checkout.

#### `POST /api/v1/billing/portal`
- **Description**: Creates a Stripe billing portal session (requires JWT).
- **Request**:
  - **Headers**: `Authorization: Bearer <accessToken>`.
  - **Body**:
    ```json
    {
      "tenantId": "uuid"
    }
    ```
- **Response**:
  - **Success (200)**:
    ```json
    {
      "url": "https://billing.stripe.com/p/session/xxx"
    }
    ```
  - **Error (401)**:
    ```json
    {
      "statusCode": 401,
      "message": "Unauthorized"
    }
    ```
- **Testing**:
  1. Obtain an `accessToken`.
  2. Use cURL:
     ```bash
     curl -X POST http://localhost:3000/api/v1/billing/portal \
     -H "Authorization: Bearer <accessToken>" \
     -H "Content-Type: application/json" \
     -d '{"tenantId":"uuid"}'
     ```
  3. Or use Postman:
     - Set method to `POST`, URL to `http://localhost:3000/api/v1/billing/portal`.
     - Add `Authorization` header and JSON body.
     - Open the returned `url` in a browser to access the billing portal.

## 🛠️ Development

### Backend Development
- **Framework**: NestJS with TypeScript.
- **Database**: PostgreSQL with Prisma ORM.
- **Authentication**: JWT via Passport.
- **File Storage**: AWS S3 for video and audio assets.
- **Payment Processing**: Stripe for billing.
- **Caching**: Redis (optional).

### Frontend Development
- **Framework**: React 19 with Vite.
- **Styling**: Tailwind CSS for responsive, modern UI.
- **State Management**: React Context for lightweight state handling.
- **HTTP Client**: Axios for API requests.
- **Routing**: React Router DOM for navigation.
- **Animations**: Framer Motion for smooth transitions and modals.
- **Key Components**:
  - `ReviewCard.jsx`: Displays video, audio, or text reviews with uniform card sizes (`480px`/`560px` height), date in top-right, and type-specific styling (orange for video, purple for audio, green for text).
  - Modal for review preview with accessibility support (ARIA labels, keyboard navigation).

### Logging
For debugging, the frontend and backend include detailed logging. Key logs in `ReviewCard.jsx` include:

- **State Changes**:
  - `ReviewCard: isPopupOpen changed to <true/false> at <timestamp>` - Tracks modal open/close state.
- **Window Events**:
  - `ReviewCard: Window focused at <timestamp>` - Logs window focus.
  - `ReviewCard: Window blurred at <timestamp>` - Logs window blur.
- **User Interactions**:
  - `ReviewCard: Card clicked at <timestamp>` - Logs card click to open modal.
  - `ReviewCard: Enter/Space pressed at <timestamp>` - Logs keyboard interaction for accessibility.
  - `ReviewCard: Close button clicked at <timestamp>` - Logs modal close button click.
  - `ReviewCard: Background clicked at <timestamp>` - Logs modal close via background click.
- **Modal Rendering**:
  - `ReviewCard: Forcing modal check at <timestamp>` - Logs forced state update for modal rendering.
- **Media Errors**:
  - `ReviewCard: Video error at <timestamp>` - Logs video playback failure in card.
  - `ReviewCard: Video error in modal at <timestamp>` - Logs video failure in modal.
  - `ReviewCard: Audio error in modal at <timestamp>` - Logs audio failure in modal.

To view logs, open the browser console (F12) or check server logs in the terminal.

### Testing
- **Frontend**:
  - Run `npm run test` in the `frontend` directory.
  - Ensure `ReviewCard.jsx` renders correctly with sample data (video, audio, text reviews).
  - Verify uniform card sizes (`480px`/`560px`), date display in top-right, and `bodyText` only in text layout.
  - Test modal interactions and accessibility (keyboard navigation, ARIA labels).
- **Backend**:
  - Run `npm run test` in the `backend` directory.
  - Test API endpoints with Postman or cURL using the provided Swagger documentation (`http://localhost:3000/api-docs`).
- **Sample Review Data**:
  ```json
  [
    {
      "id": "1",
      "type": "video",
      "title": "Great Service",
      "rating": 5,
      "reviewerName": "John Doe",
      "submittedAt": "2025-09-05T12:00:00Z",
      "bodyText": "This product transformed my business!",
      "mediaAssets": [{ "s3Key": "glambeauty/reviews/video/video-uuid.webm" }]
    },
    {
      "id": "2",
      "type": "audio",
      "title": "Amazing Support",
      "rating": 4,
      "reviewerName": "Sarah Johnson",
      "submittedAt": "2025-09-04T10:00:00Z",
      "bodyText": "Outstanding customer service!",
      "mediaAssets": [{ "s3Key": "glambeauty/reviews/audio/audio-uuid.mp3" }]
    },
    {
      "id": "3",
      "type": "text",
      "title": "Highly Recommend",
      "rating": 5,
      "reviewerName": "Mike Chen",
      "submittedAt": "2025-09-03T08:00:00Z",
      "bodyText": "The product exceeded all expectations."
    }
  ]
  ```

## 📊 Database Schema

The application uses PostgreSQL with the following main entities. Below are the tables, their columns, data types, descriptions, and associated function names (API endpoints).

### Users
| Column Name      | Data Type    | Description                              | Function Names                          |
|------------------|--------------|------------------------------------------|-----------------------------------------|
| id               | UUID         | Unique identifier for the user           | `POST /api/v1/auth/register`, `GET /api/v1/users/:id` |
| email            | VARCHAR      | User's email address (unique)            | `POST /api/v1/auth/login`, `POST /api/v1/auth/register` |
| password         | VARCHAR      | Hashed password                          | `POST /api/v1/auth/login`, `POST /api/v1/auth/register` |
| name             | VARCHAR      | User's full name                         | `GET /api/v1/users/:id`, `PATCH /api/v1/users/:id` |
| createdAt        | TIMESTAMP    | Account creation timestamp               | `GET /api/v1/users/:id`                |
| updatedAt        | TIMESTAMP    | Last update timestamp                    | `GET /api/v1/users/:id`, `PATCH /api/v1/users/:id` |
| tenantId         | UUID         | Foreign key to Tenants table             | `GET /api/v1/users/:id`, `PATCH /api/v1/tenants/:id` |

### Tenants
| Column Name      | Data Type    | Description                              | Function Names                          |
|------------------|--------------|------------------------------------------|-----------------------------------------|
| id               | UUID         | Unique identifier for the tenant         | `GET /api/v1/tenants/:slug`, `PATCH /api/v1/tenants/:id` |
| slug             | VARCHAR      | Unique slug for public URL               | `GET /api/v1/tenants/:slug`, `GET /api/v1/tenants/slug/:slug` |
| name             | VARCHAR      | Business/organization name               | `PATCH /api/v1/tenants/:id`, `GET /api/v1/tenants/:slug` |
| logoUrl          | VARCHAR      | URL to tenant's logo (S3)                | `PATCH /api/v1/tenants/:id`, `GET /api/v1/tenants/:slug` |
| primaryColor     | VARCHAR      | Branding color (hex, e.g., `#ef7c00`)    | `PATCH /api/v1/tenants/:id`, `GET /api/v1/tenants/:slug` |
| createdAt        | TIMESTAMP    | Tenant creation timestamp                | `GET /api/v1/tenants/:slug`            |
| updatedAt        | TIMESTAMP    | Last update timestamp                    | `PATCH /api/v1/tenants/:id`, `GET /api/v1/tenants/:slug` |

### Reviews
| Column Name      | Data Type    | Description                              | Function Names                          |
|------------------|--------------|------------------------------------------|-----------------------------------------|
| id               | UUID         | Unique identifier for the review         | `POST /api/v1/reviews/:tenantSlug`, `GET /api/v1/reviews/:id` |
| tenantId         | UUID         | Foreign key to Tenants table             | `GET /api/v1/reviews/tenant/:tenantId` |
| type             | ENUM         | Review type (`video`, `audio`, `text`)   | `POST /api/v1/reviews/:tenantSlug`, `GET /api/v1/reviews/:id` |
| title            | VARCHAR      | Review title                             | `POST /api/v1/reviews/:tenantSlug`, `GET /api/v1/reviews/:id` |
| bodyText         | TEXT         | Review text content (text reviews only)  | `POST /api/v1/reviews/:tenantSlug`, `GET /api/v1/reviews/:id` |
| rating           | INTEGER      | Rating (1-5)                             | `POST /api/v1/reviews/:tenantSlug`, `GET /api/v1/reviews/:id` |
| reviewerName     | VARCHAR      | Name of the reviewer                     | `POST /api/v1/reviews/:tenantSlug`, `GET /api/v1/reviews/:id` |
| submittedAt      | TIMESTAMP    | Submission timestamp                     | `POST /api/v1/reviews/:tenantSlug`, `GET /api/v1/reviews/:id` |
| status           | ENUM         | Status (`pending`, `approved`, `rejected`, `hidden`) | `PATCH /api/v1/reviews/:id/approve`, `PATCH /api/v1/reviews/:id/reject`, `PATCH /api/v1/reviews/:id/hide` |
| createdAt        | TIMESTAMP    | Creation timestamp                       | `GET /api/v1/reviews/:id`              |
| updatedAt        | TIMESTAMP    | Last update timestamp                    | `PATCH /api/v1/reviews/:id/*`, `GET /api/v1/reviews/:id` |

### Widgets
| Column Name      | Data Type    | Description                              | Function Names                          |
|------------------|--------------|------------------------------------------|-----------------------------------------|
| id               | UUID         | Unique identifier for the widget         | `POST /api/v1/widgets`, `GET /api/v1/widgets/:id` |
| tenantId         | UUID         | Foreign key to Tenants table             | `GET /api/v1/widgets/tenant/:tenantId` |
| type             | ENUM         | Widget type (`grid`, `carousel`, `spotlight`, `floating`) | `POST /api/v1/widgets`, `PATCH /api/v1/widgets/:id` |
| name             | VARCHAR      | Widget name                              | `POST /api/v1/widgets`, `GET /api/v1/widgets/:id` |
| settings         | JSONB        | Configuration (e.g., layout, colors)     | `POST /api/v1/widgets`, `PATCH /api/v1/widgets/:id` |
| createdAt        | TIMESTAMP    | Creation timestamp                       | `GET /api/v1/widgets/:id`              |
| updatedAt        | TIMESTAMP    | Last update timestamp                    | `PATCH /api/v1/widgets/:id`, `GET /api/v1/widgets/:id` |

### BillingAccounts
| Column Name      | Data Type    | Description                              | Function Names                          |
|------------------|--------------|------------------------------------------|-----------------------------------------|
| id               | UUID         | Unique identifier for the billing account | `GET /api/v1/billing/tenant/:tenantId` |
| tenantId         | UUID         | Foreign key to Tenants table             | `GET /api/v1/billing/tenant/:tenantId` |
| stripeCustomerId | VARCHAR      | Stripe customer ID                       | `POST /api/v1/billing/checkout`, `POST /api/v1/billing/portal` |
| subscriptionId   | VARCHAR      | Stripe subscription ID                   | `POST /api/v1/billing/checkout`, `POST /api/v1/billing/portal` |
| storageLimit     | INTEGER      | Storage limit in GB                      | `GET /api/v1/billing/tenant/:tenantId` |
| storageUsed      | INTEGER      | Storage used in GB                       | `GET /api/v1/billing/tenant/:tenantId` |
| createdAt        | TIMESTAMP    | Creation timestamp                       | `GET /api/v1/billing/tenant/:tenantId` |
| updatedAt        | TIMESTAMP    | Last update timestamp                    | `POST /api/v1/billing/*`, `GET /api/v1/billing/tenant/:tenantId` |

### VideoAssets/AudioAssets
| Column Name      | Data Type    | Description                              | Function Names                          |
|------------------|--------------|------------------------------------------|-----------------------------------------|
| id               | UUID         | Unique identifier for the asset          | `POST /api/v1/reviews/:tenantSlug`     |
| reviewId         | UUID         | Foreign key to Reviews table             | `GET /api/v1/reviews/:id`              |
| s3Key            | VARCHAR      | S3 key for the media file                | `POST /api/v1/reviews/:tenantSlug`, `GET /api/v1/reviews/:id` |
| fileType         | VARCHAR      | File type (e.g., `video/mp4`, `audio/mp3`) | `POST /api/v1/reviews/:tenantSlug`, `GET /api/v1/reviews/:id` |
| fileSize         | INTEGER      | File size in bytes                       | `GET /api/v1/reviews/:id`              |
| createdAt        | TIMESTAMP    | Creation timestamp                       | `GET /api/v1/reviews/:id`              |
| updatedAt        | TIMESTAMP    | Last update timestamp                    | `GET /api/v1/reviews/:id`              |

### AnalyticsEvents
| Column Name      | Data Type    | Description                              | Function Names                          |
|------------------|--------------|------------------------------------------|-----------------------------------------|
| id               | UUID         | Unique identifier for the event          | `GET /api/v1/analytics/tenant/:tenantId` |
| tenantId         | UUID         | Foreign key to Tenants table             | `GET /api/v1/analytics/tenant/:tenantId` |
| widgetId         | UUID         | Foreign key to Widgets table (nullable)  | `GET /api/v1/analytics/widget/:widgetId/views` |
| eventType        | ENUM         | Event type (`view`, `click`, `submission`) | `GET /api/v1/analytics/*`              |
| createdAt        | TIMESTAMP    | Event timestamp                          | `GET /api/v1/analytics/*`              |

## 📱 Platform Integrations

### WordPress Plugin
- Lightweight plugin for embedding widgets.
- Shortcode: `[truetestify_widget type="carousel"]`.
- OAuth integration for seamless account connection.

### Shopify App
- Embedded app for Shopify stores.
- OAuth login flow.
- Widget placement on product pages and home page.
- QR code generation for packaging inserts.

## 🔒 Security Features
- JWT-based authentication for secure access.
- CORS configured for `FRONTEND_URL`.
- Input validation using `class-validator`.
- Helmet.js for secure HTTP headers.
- Rate limiting (optional, via middleware).
- CSRF protection for form submissions.

## 🚀 Deployment

### Backend Deployment
1. Build the application:
   ```bash
   npm run build
   ```
2. Set production environment variables in `.env`.
3. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```
4. Start the production server:
   ```bash
   npm run start:prod
   ```

### Frontend Deployment
1. Build the application:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to your hosting provider (e.g., Netlify, Vercel).
3. Set production environment variables in `.env`.

## 🤝 Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m "Add YourFeature"`).
4. Add tests if applicable.
5. Submit a pull request.

## 📄 License
This project is proprietary software. All rights reserved.

## 🆘 Support
For assistance, contact: [support@truetestify.com](mailto:support@truetestify.com).

## 🔍 Troubleshooting
- **Frontend Issues**:
  - **Cards not rendering correctly**: Verify `VITE_S3_BASE_URL` and review data. Clear cache (`npm run dev -- --force`) or test in incognito mode.
  - **Modal not opening**: Check console for logs (e.g., `ReviewCard: Card clicked at <timestamp>`). Ensure `Framer Motion` is installed.
  - **Inconsistent card sizes**: Inspect CSS in dev tools for conflicting styles (`grep -r "height" src/`).
- **Backend Issues**:
  - **API errors**: Validate `DATABASE_URL`, `AWS_S3_BUCKET`, and `STRIPE_SECRET_KEY` in `.env`. Check server logs for errors.
  - **CORS issues**: Ensure `FRONTEND_URL` matches the frontend’s origin (`http://localhost:5173`).
  - **Authentication errors**: Verify `JWT_SECRET` and obtain a valid `accessToken` from `/auth/login`.
- **Logs**: Check browser console or server terminal for debugging logs listed above.
- **API Testing**:
  - If endpoints return 500 errors, check database connectivity (`DATABASE_URL`) and Prisma migrations (`npx prisma migrate dev`).
  - For 403/401 errors, ensure the `Authorization` header includes a valid JWT.
  - For S3-related errors, verify `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_S3_BUCKET`.

---

**TrueTestify** - Building trust through authentic video testimonials, one face at a time.