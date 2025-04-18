# DocHub Backend

This is the backend API for the DocHub document management system built with Django and Django REST Framework.

## Features

- RESTful API with Django REST Framework
- JWT Authentication
- Custom User model with email-based authentication
- Document management with versioning
- Document sharing with different permission levels
- Comments on documents
- API documentation with Swagger/ReDoc

## Tech Stack

- Django 4.2
- Django REST Framework
- PostgreSQL
- JWT Authentication
- Swagger/ReDoc for API documentation

## Setup Instructions

### Prerequisites

- Python 3.9+
- PostgreSQL

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows:
     ```
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```
   Then edit the `.env` file with your specific configuration.

6. Run migrations:
   ```
   python manage.py migrate
   ```

7. Create a superuser:
   ```
   python manage.py createsuperuser
   ```

8. Run the development server:
   ```
   python manage.py runserver
   ```

## API Endpoints

### Authentication

- `POST /api/auth/token/`: Obtain JWT token
- `POST /api/auth/token/refresh/`: Refresh JWT token
- `POST /api/auth/token/verify/`: Verify JWT token

### Users

- `GET /api/users/`: List all users
- `POST /api/users/`: Create a new user
- `GET /api/users/{id}/`: Retrieve a user
- `PUT /api/users/{id}/`: Update a user
- `DELETE /api/users/{id}/`: Delete a user
- `GET /api/users/me/`: Get current user
- `PUT /api/users/change_password/`: Change password
- `PUT /api/users/update_profile/`: Update profile

### Documents

- `GET /api/documents/`: List all accessible documents
- `POST /api/documents/`: Create a new document
- `GET /api/documents/{slug}/`: Retrieve a document
- `PUT /api/documents/{slug}/`: Update a document
- `DELETE /api/documents/{slug}/`: Delete a document
- `GET /api/documents/my_documents/`: List user's documents
- `GET /api/documents/shared_with_me/`: List documents shared with user
- `GET /api/documents/{slug}/comments/`: List comments for a document
- `GET /api/documents/{slug}/versions/`: List versions for a document
- `GET /api/documents/{slug}/shares/`: List shares for a document
- `POST /api/documents/{slug}/add_version/`: Add a new version
- `POST /api/documents/{slug}/share/`: Share a document

### Comments

- `GET /api/comments/`: List all accessible comments
- `POST /api/comments/`: Create a new comment
- `GET /api/comments/{id}/`: Retrieve a comment
- `PUT /api/comments/{id}/`: Update a comment
- `DELETE /api/comments/{id}/`: Delete a comment

### Shares

- `GET /api/shares/`: List all shares
- `POST /api/shares/`: Create a new share
- `GET /api/shares/{id}/`: Retrieve a share
- `PUT /api/shares/{id}/`: Update a share
- `DELETE /api/shares/{id}/`: Delete a share

### Versions

- `GET /api/versions/`: List all accessible versions
- `GET /api/versions/{id}/`: Retrieve a version

## API Documentation

Once the server is running, you can access the API documentation at:

- Swagger UI: `/api/docs/`
- ReDoc: `/api/redoc/`

## Development

### Running Tests

```
python manage.py test
```

### Code Formatting

This project uses Black for code formatting:

```
black .
```

## License

MIT