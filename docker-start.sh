#!/bin/bash

docker compose -f docker-compose.yml -p every-wear-app stop
docker compose -f docker-compose.yml -p every-wear-app down
docker compose -f docker-compose.yml -p every-wear-app up -d
