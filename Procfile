web: gunicorn invsys.wsgi --log-file -
heroku ps:scale web=1
python3 manage.py collectstatic
python3 manage.py migrate
heroku config:set WKHTMLTOPDF_BINARY=wkhtmltopdf-pack