STARTUP
{
    SETTUP -base dir
    {
        pip instal pipenv
        pipenv shell
    }
    BACKEND
    {
        python manage.py runserver
    }

    FRONTEND
    {
        npm i
        npm start
    }  
}

