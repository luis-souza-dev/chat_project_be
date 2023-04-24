#!/bin/sh

npx sequelize-cli db:migrate

npm run start-watch