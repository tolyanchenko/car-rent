## Installation

yarn

## Create local DB

docker-compose up

## Setting up .env

create .env at /env

## Connect to local db

- Add this text into .env

  - POSTGRES_HOST=0.0.0.0

  - POSTGRES_PORT=5432

  - POSTGRES_USER=root

  - POSTGRES_PASSWORD=root

  - POSTGRES_DB=postgres

## Running the app

yarn start:dev

## Tetsing the app

http://localhost:3000/api
