# API Specification

## Authentication Endpoints

### POST /auth/signup
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here"
}
```

### POST /auth/login
Authenticate a user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here"
}
```

### POST /auth/logout
Log out a user (client-side only).

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

## Post Endpoints

### POST /posts
Create a new post (requires authentication).

**Request Body:**
```json
{
  "title": "Post Title",
  "body": "Post content here",
  "tags": ["tag1", "tag2"],
  "isPublic": true
}
```

**Response:**
```json
{
  "_id": "post_id",
  "title": "Post Title",
  "body": "Post content here",
  "tags": ["tag1", "tag2"],
  "isPublic": true,
  "authorId": "user_id",
  "createdAt": "2024-03-14T12:00:00.000Z",
  "updatedAt": "2024-03-14T12:00:00.000Z"
}
```

### GET /posts
Get a list of posts with optional filters.

**Query Parameters:**
- `tag`: Filter by tag
- `author`: Filter by author ID
- `title`: Search by title
- `isPublic`: Filter by public status

**Response:**
```json
[
  {
    "_id": "post_id",
    "title": "Post Title",
    "body": "Post content here",
    "tags": ["tag1", "tag2"],
    "isPublic": true,
    "authorId": {
      "_id": "user_id",
      "email": "user@example.com"
    },
    "createdAt": "2024-03-14T12:00:00.000Z",
    "updatedAt": "2024-03-14T12:00:00.000Z"
  }
]
```

### GET /posts/:id
Get a single post by ID.

**Response:**
```json
{
  "_id": "post_id",
  "title": "Post Title",
  "body": "Post content here",
  "tags": ["tag1", "tag2"],
  "isPublic": true,
  "authorId": {
    "_id": "user_id",
    "email": "user@example.com"
  },
  "createdAt": "2024-03-14T12:00:00.000Z",
  "updatedAt": "2024-03-14T12:00:00.000Z"
}
```

### PUT /posts/:id
Update a post (requires authentication and ownership).

**Request Body:**
```json
{
  "title": "Updated Title",
  "body": "Updated content",
  "tags": ["tag1", "tag3"],
  "isPublic": false
}
```

**Response:**
```json
{
  "_id": "post_id",
  "title": "Updated Title",
  "body": "Updated content",
  "tags": ["tag1", "tag3"],
  "isPublic": false,
  "authorId": "user_id",
  "createdAt": "2024-03-14T12:00:00.000Z",
  "updatedAt": "2024-03-14T12:30:00.000Z"
}
```

### DELETE /posts/:id
Delete a post (requires authentication and ownership).

**Response:**
```json
{
  "message": "Post deleted"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Error message here"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Server Error
```json
{
  "error": "Server error"
}
``` 