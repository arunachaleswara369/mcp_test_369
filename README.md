# DocHub - Modern Document Management System

DocHub is a comprehensive, full-stack document management system built with modern web technologies. It provides a robust platform for storing, sharing, and collaborating on documents with a sleek, responsive user interface.

## 🚀 Features

- **User Authentication**
  - Email-based authentication
  - JWT token-based security
  - User profiles with customizable settings

- **Document Management**
  - Upload and store documents
  - Version control and history tracking
  - Document metadata and categorization
  - Advanced search capabilities

- **Collaboration Tools**
  - Document sharing with customizable permissions
  - Real-time commenting
  - Activity tracking
  - Notification system

- **Modern UI/UX**
  - Responsive design for all devices
  - Dark/light mode support
  - Interactive animations and transitions
  - Intuitive navigation and workflows

## 🔧 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui, Aceternity UI
- **State Management**: React Hooks
- **Animation**: Framer Motion

### Backend
- **Framework**: Django 4.2
- **API**: Django REST Framework
- **Database**: PostgreSQL
- **Authentication**: JWT-based auth
- **Documentation**: Swagger/ReDoc

## 📂 Project Structure

```
dochub/
├── frontend/           # Next.js frontend application
│   ├── public/         # Static assets
│   ├── src/            # Source code
│   │   ├── app/        # Next.js app router
│   │   ├── components/ # React components
│   │   ├── lib/        # Utility functions
│   │   └── styles/     # Global styles
│   ├── package.json    # Frontend dependencies
│   └── README.md       # Frontend documentation
│
├── backend/            # Django backend application
│   ├── dochub/         # Main Django project
│   ├── api/            # API endpoints
│   ├── users/          # User management app
│   ├── documents/      # Document management app
│   ├── requirements.txt # Backend dependencies
│   └── README.md       # Backend documentation
│
└── README.md           # Main project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.9+
- PostgreSQL

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Backend Setup
1. Navigate to the backend directory:
   ```
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

9. The API will be available at [http://localhost:8000/api/](http://localhost:8000/api/)

## 📱 Key Application Pages

- **Home**: Landing page with feature highlights
- **Login/Register**: User authentication
- **Dashboard**: Document management interface
- **Document Viewer**: View and interact with documents
- **User Profile**: Manage user settings and preferences

## 🔒 Security Features

- JWT-based authentication
- Password hashing and validation
- Permission-based access control
- CSRF protection
- Secure file handling

## 🌙 Dark Mode Support

DocHub includes a built-in theme switcher that allows users to toggle between light and dark modes based on their preference.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Django](https://www.djangoproject.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Django REST Framework](https://www.django-rest-framework.org/)