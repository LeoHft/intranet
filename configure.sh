#!/bin/bash

ENV_FILE=".env.example"


echo "Fichier .env.example déjà existant, avec une configuration pour y accéder en http://127.0.0.1"
read -p "Souhaites-tu le reconfigurer pour y accéder avec une autre addresse (ex : https://subdomain.domain.com) ? (o/N) : " RECONFIGURE
if [[ ! "$RECONFIGURE" =~ ^[OoYy]$ ]]; then
  echo "Configuration annulée, on continue avec la configuration existante."
  echo
  docker compose up --build
  exit 0
fi


read -p "Quel est le domaine de l'application (ex: intranet.local) ? " DOMAIN
read -p "Utiliser HTTPS ? (o/N) : " USE_HTTPS

if [[ "$USE_HTTPS" =~ ^[OoYy]$ ]]; then
  PROTOCOL="https"
else
  PROTOCOL="http"
fi

# Remplacements
sed -i "s|^APP_DOMAIN=.*|APP_DOMAIN=$DOMAIN|" .env.example
sed -i "s|^PROTOCOL=.*|PROTOCOL=$PROTOCOL|" .env.example


if [[ "$PROTOCOL" == "https" ]]; then
    sed -i "s|^APP_URL=.*|APP_URL=${PROTOCOL}://$DOMAIN|" .env.example
    sed -i "s|^FRONTEND_URL=.*|FRONTEND_URL=${PROTOCOL}://$DOMAIN|" .env.example
    sed -i "s|^CORS_ALLOWED_ORIGINS=.*|CORS_ALLOWED_ORIGINS=${PROTOCOL}://$DOMAIN|" .env.example
    sed -i "s|^SANCTUM_STATEFUL_DOMAINS=.*|SANCTUM_STATEFUL_DOMAINS=$DOMAIN|" .env.example
else
    sed -i "s|^APP_URL=.*|APP_URL=${PROTOCOL}://$DOMAIN:8088|" .env.example
    sed -i "s|^FRONTEND_URL=.*|FRONTEND_URL=${PROTOCOL}://$DOMAIN:8088|" .env.example
    sed -i "s|^CORS_ALLOWED_ORIGINS=.*|CORS_ALLOWED_ORIGINS=${PROTOCOL}://$DOMAIN:8088|" .env.example
    sed -i "s|^SANCTUM_STATEFUL_DOMAINS=.*|SANCTUM_STATEFUL_DOMAINS=$DOMAIN:8088|" .env.example
fi
sed -i "s|^SANCTUM_DOMAIN=.*|SANCTUM_DOMAIN=$DOMAIN|" .env.example


# Secure cookie
if [[ "$PROTOCOL" == "http" ]]; then
  sed -i "s|^SESSION_SECURE_COOKIE=.*|SESSION_SECURE_COOKIE=false|" .env.example
else
  sed -i "s|^SESSION_SECURE_COOKIE=.*|SESSION_SECURE_COOKIE=true|" .env.example
fi

echo ".env.example configuré. Lancement de docker-compose up --build"
docker compose up --build

