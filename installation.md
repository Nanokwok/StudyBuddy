# StudyBuddy Installation Guide

A comprehensive guide to set up the StudyBuddy platform on your local machine.

## Prerequisites

Before beginning the installation, ensure you have the following installed:

- Node.js and npm
- Python 3.8+
- PostgreSQL
- React Native environment

## Installation Steps

### Clone Repository

```bash
git clone https://github.com/nanokwok/StudyBuddy.git
```

```bash
cd StudyBuddy
```

### Backend Setup

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment:

```bash
# On macOS/Linux
source venv/bin/activate
```

```bash
# On Windows
venv\Scripts\activate
```

Install backend dependencies:

```bash
cd backend
```

```bash
pip install -r requirements.txt
```

Configure environment variables:

```bash
cp .env.sample .env
# Edit .env with your configuration
```

Start the backend server:

```bash
python manage.py runserver
```

For device simulation:

```bash
python manage.py runserver 0.0.0.0:8000
```

### Frontend Setup

Navigate to the frontend directory:

```bash
cd ../frontend
```

Install frontend dependencies:

```bash
npm install
```

Start the application:

```bash
npx expo start
```

## Troubleshooting

- If you encounter database connection issues, verify your PostgreSQL credentials in the `.env` file
- For React Native errors, ensure your development environment is properly configured
- Check firewall settings if experiencing connection problems with the development server

## Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
