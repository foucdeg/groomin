#!/bin/sh
python manage.py collectstatic --noinput
python manage.py compilemessages
python manage.py migrate

gunicorn --workers=1 --threads=5 groomin.wsgi:application -b 0.0.0.0:9001
