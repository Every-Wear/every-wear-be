#!/bin/bash

docker compose -f ./docker-compose-prod.yml -p every-wear-app stop
docker compose -f ./docker-compose-prod.yml -p every-wear-app down
docker compose -f ./docker-compose-prod.yml -p every-wear-app up -d

sleep 1

docker compose -f ./docker-compose-prod.yml -p every-wear-app logs -f