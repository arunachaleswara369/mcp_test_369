# DocHub - Modern Document Management System

A full-fledged document management website built with a modern tech stack.

## Tech Stack

### Frontend
- Next.js 14 (App Router)
- TypeScript
- React
- Tailwind CSS
- shadcn/ui components
- Aceternity UI for animations and effects
- Tanstack Query for data fetching

### Backend
- Django 4.2
- Django REST Framework
- PostgreSQL
- JWT Authentication

## Project Structure

```
mcp_test_369/
├── frontend/                # Next.js frontend application
│   ├── src/
│   │   ├── app/             # Next.js app router
│   │   ├── components/      # React components
│   │   ├── lib/             # Utility functions
│   │   ├── hooks/           # Custom React hooks
│   │   ├── types/           # TypeScript type definitions
│   │   └── styles/          # Global styles
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   └── tsconfig.json        # TypeScript configuration
│
├── backend/                 # Django backend application
│   ├── dochub/              # Main Django project
│   │   ├── settings.py      # Django settings
│   │   ├── urls.py          # URL routing
│   │   └── wsgi.py          # WSGI configuration
│   ├── documents/           # Documents app
│   ├── users/               # User management app
│   ├── api/                 # API app
│   ├── requirements.txt     # Backend dependencies
│   └── manage.py            # Django management script
│
└── docker/                  # Docker configuration
    ├── docker-compose.yml   # Docker Compose configuration
    ├── Dockerfile.frontend  # Frontend Dockerfile
    └── Dockerfile.backend   # Backend Dockerfile
```

## Features

- **User Authentication**: Sign up, login, password reset
- **Document Management**: Upload, view, edit, delete, and share documents
- **Document Versioning**: Track changes and maintain document history
- **Search Functionality**: Full-text search across documents
- **Collaborative Editing**: Real-time collaborative document editing
- **Access Control**: Fine-grained permissions for documents
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark Mode**: Toggle between light and dark themes

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL
- Docker (optional)

### Development Setup

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Docker Setup
```bash
docker-compose up
```

## API Documentation

API documentation is available at `/api/docs/` when running the backend server.

## License

This project is licensed under the MIT License - see the LICENSE file for details.