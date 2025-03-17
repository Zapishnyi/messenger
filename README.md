# Meduzzen test task: messenger

Back end - developed in Nest, Front end - React

Database - PostgresSQL

Developed as per technical assignment

### Running DEV mode

1. Install latest supported version of Node.js
2. Install Docker
3. Install all Node dependencies

   front:

   > cd front

   > npm i

   back: Dependencies will be installed automatically during building back application

4. Build up Docker container for Nest application:

   > docker-compose build

5. Start Nest application and PostgresSQL database in Docker container:

   > docker-compose up

6. To build up initial migration

   > npm run migration:generate -name=[name of file / table change indication]

7. To run migration

   > npm run migration:run

8. Start React app:

   > cd front

   > npm run dev

### Swagger

1. Swagger is available on URL:

   > http://localhost:5000/api-docs
