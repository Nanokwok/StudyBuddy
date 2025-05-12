# StudyBuddy

A platform connecting students with similar academic interests for collaborative learning.

![image](https://github.com/user-attachments/assets/526d923c-22c5-49c3-ab69-60fd0a94b647)

## Features
- **User Authentication**: Secure sign-up/login
- **Profile Management**: Customizable academic profiles
- **Study Sessions**: Schedule and track study meetings
- **Networking**: Connect with peers by courses and subjects
- **Social Integration**: Link your social profiles

## Tech Stack
- Frontend: React Native
- Backend: Django REST Framework
- Database: PostgreSQL

## Setup Instructions

### Prerequisites
- Node.js and npm
- Python 3.8+
- PostgreSQL
- React Native environment

### Installation

Clone repository:
```bash
git clone https://github.com/nanokwok/StudyBuddy.git
```

Navigate to project folder:
```bash
cd StudyBuddy
```

### Backend Setup

Create virtual environment:
```bash
python -m venv venv
```

Activate virtual environment:
```bash
# On macOS/Linux
source venv/bin/activate

# On Windows
venv\Scripts\activate
```

Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

Configure environment:
```bash
cp .env.sample .env
# Edit .env with your configuration
```

Start backend server:
```bash
python manage.py runserver
```

For phone simulation:
```bash
python manage.py runserver 0.0.0.0:8000
```

### Frontend Setup

Navigate to frontend directory:
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

## License  
This project is licensed under the [MIT License](LICENSE).
