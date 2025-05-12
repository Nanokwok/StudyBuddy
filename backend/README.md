# Welcome to Django REST API 👋

This is a [Django REST Framework](https://www.django-rest-framework.org/) backend for the StudyBuddy application.

## Get started

1. Create and activate a virtual environment (If not done)

   ```bash
   python -m venv venv

   # On macOS/Linux
   source venv/bin/activate

   # On Windows
   venv\Scripts\activate
   ```

2. Install dependencies

   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment variables

   ```bash
   cp .env.sample .env
   # Edit .env with your database credentials and other settings
   ```

4. Run migrations

   ```bash
   python manage.py migrate
   ```

5. Create a superuser (optional)

   ```bash
   python manage.py createsuperuser
   ```

6. Start the development server

   ```bash
   python manage.py runserver

   # For network access (mobile testing)
   python manage.py runserver 0.0.0.0:8000
   ```

Once running, you can access:
- API endpoints at http://localhost:8000/api/
- Admin interface at http://localhost:8000/admin/

## Project Structure

```
backend/
├── api/                  # API application
│   ├── migrations/
│   ├── utils/
│   ├── admin.py
│   ├── models.py
│   ├── serializers.py
│   ├── urls.py
│   └── views.py
└── backend/              # Main project directory
    ├── settings.py
    ├── urls.py
    └── wsgi.py
```

## Development

### Code Linting

```bash
flake8
```

### Creating New Apps

```bash
python manage.py startapp new_app_name
```

## Learn more

To learn more about developing with Django REST Framework:

- [Django documentation](https://docs.djangoproject.com/)
- [Django REST Framework documentation](https://www.django-rest-framework.org/)
- [Django REST Framework tutorial](https://www.django-rest-framework.org/tutorial/quickstart/)

## Join the community

- [Django on GitHub](https://github.com/django/django)
- [Django REST Framework on GitHub](https://github.com/encode/django-rest-framework)
- [Django Forum](https://forum.djangoproject.com/)
- [Django REST Framework Discussion](https://groups.google.com/forum/#!forum/django-rest-framework)
