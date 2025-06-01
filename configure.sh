#!/bin/bash

db_connection_var="mysql"
db_host_var="intranet-db"
db_port_var="3306"
db_database_var="intranet"
db_username_var="root"
db_password_var="secret"

rm -f .env
rm -f .env.preprod
clear

echo ""
echo "========================================================================"
echo "               Configuration de l'application Intranet                  "
echo "========================================================================"
echo ""

echo "Ce script vous guide dans la configuration de l'environnement :"
echo ""
echo -n "=> Mode "
echo "developpement (sans Docker)"
echo "  - PHP, Composer, Node.js et MariaDB doivent être installés localement."
echo ""
echo -n "=> Mode "
echo "production (avec Docker)"
echo "  - Requiert Docker et Docker Compose installés sur votre machine."
echo ""
echo -n "Souhaitez-vous démarrer en mode developpement (sans Docker) ? (o/N) : "
read devMode

if [[ "$devMode" =~ ^[oOyY]$ ]]; then
    cp .env.example .env
    envFile=".env"

    sed -i \
        -e 's/^VITE_DEV_SERVER=.*/VITE_DEV_SERVER=true/' \
        -e 's/^APP_ENV=.*/APP_ENV=local/' \
        -e 's/^APP_DEBUG=.*/APP_DEBUG=true/' \
        -e 's/^APP_URL=.*/APP_URL=http:\/\/127.0.0.1:8000/' \
        -e 's/^FRONTEND_URL=.*/FRONTEND_URL=http:\/\/127.0.0.1:8000/' \
        -e 's/^CORS_ALLOWED_ORIGINS=.*/CORS_ALLOWED_ORIGINS=http:\/\/127.0.0.1:8000/' \
        -e 's/^SANCTUM_STATEFUL_DOMAINS=.*/SANCTUM_STATEFUL_DOMAINS=127.0.0.1:8000/' \
        -e 's/^SESSION_DOMAIN=.*/SESSION_DOMAIN=127.0.0.1/' \
        -e 's/^SESSION_SECURE_COOKIE=.*/SESSION_SECURE_COOKIE=false/' \
        -e "s/^DB_CONNECTION=.*/DB_CONNECTION=$db_connection_var/" \
        -e "s/^DB_HOST=.*/DB_HOST=localhost/" \
        -e "s/^DB_PORT=.*/DB_PORT=$db_port_var/" \
        -e "s/^DB_DATABASE=.*/DB_DATABASE=$db_database_var/" \
        -e "s/^DB_USERNAME=.*/DB_USERNAME=$db_username_var/" \
        "$envFile"

    echo -e "\nInstallation des dépendances PHP"
    composer install --no-interaction --optimize-autoloader
    echo -e "\nInstallation des dépendances NPM"
    npm ci
    echo -e "\nGénération de la clé d'application"
    php artisan key:generate
    echo -e "\nMigration de la base de données"
    php artisan migrate --seed --force -n
    echo -e "\nPublication des assets"
    php artisan storage:link
    echo -e "\nLancement en mode développement sans Docker..."
    x-terminal-emulator -e php artisan serve &
    x-terminal-emulator -e npm run dev &
else
    [ -f .env ] && rm -f .env
    cp .env.example .env.preprod
    envFile=".env.preprod"
    echo -e "\nFichier .env.example déjà existant, avec une configuration pour http://127.0.0.1"
    echo -n "Souhaitez-vous le reconfigurer pour un autre domaine ? (o/N) : "
    read reconfigure

    if [[ ! "$reconfigure" =~ ^[oOyY]$ ]]; then
        sed -i \
            -e "s/^DB_CONNECTION=.*/DB_CONNECTION=$db_connection_var/" \
            -e "s/^DB_HOST=.*/DB_HOST=$db_host_var/" \
            -e "s/^DB_PORT=.*/DB_PORT=$db_port_var/" \
            -e "s/^DB_DATABASE=.*/DB_DATABASE=$db_database_var/" \
            -e "s/^DB_USERNAME=.*/DB_USERNAME=$db_username_var/" \
            -e "s/^DB_PASSWORD=.*/DB_PASSWORD=$db_password_var/" \
            "$envFile"

        docker compose up --build
        exit 0
    fi

    echo -n "Quel est le domaine de l'application (ex: intranet.local) ? : "
    read domain
    echo -n "Utiliser HTTPS ? (o/N) : "
    read useHttps

    if [[ "$useHttps" =~ ^[oOyY]$ ]]; then
        protocol="https"
    else
        protocol="http"
    fi

    sed -i \
        -e "s/^APP_DOMAIN=.*/APP_DOMAIN=$domain/" \
        -e "s/^PROTOCOL=.*/PROTOCOL=$protocol/" \
        "$envFile"

    if [[ "$protocol" == "https" ]]; then
        sed -i \
            -e "s/^APP_URL=.*/APP_URL=${protocol}:\/\/${domain}/" \
            -e "s/^FRONTEND_URL=.*/FRONTEND_URL=${protocol}:\/\/${domain}/" \
            -e "s/^CORS_ALLOWED_ORIGINS=.*/CORS_ALLOWED_ORIGINS=${protocol}:\/\/${domain}/" \
            -e "s/^SANCTUM_STATEFUL_DOMAINS=.*/SANCTUM_STATEFUL_DOMAINS=${domain}/" \
            "$envFile"
    else
        sed -i \
            -e "s/^APP_URL=.*/APP_URL=${protocol}:\/\/${domain}:8088/" \
            -e "s/^FRONTEND_URL=.*/FRONTEND_URL=${protocol}:\/\/${domain}:8088/" \
            -e "s/^CORS_ALLOWED_ORIGINS=.*/CORS_ALLOWED_ORIGINS=${protocol}:\/\/${domain}:8088/" \
            -e "s/^SANCTUM_STATEFUL_DOMAINS=.*/SANCTUM_STATEFUL_DOMAINS=${domain}:8088/" \
            "$envFile"
    fi

    sed -i \
        -e "s/^SESSION_DOMAIN=.*/SESSION_DOMAIN=${domain}/" \
        -e "s/^DB_CONNECTION=.*/DB_CONNECTION=$db_connection_var/" \
        -e "s/^DB_HOST=.*/DB_HOST=$db_host_var/" \
        -e "s/^DB_PORT=.*/DB_PORT=$db_port_var/" \
        -e "s/^DB_DATABASE=.*/DB_DATABASE=$db_database_var/" \
        -e "s/^DB_USERNAME=.*/DB_USERNAME=$db_username_var/" \
        -e "s/^DB_PASSWORD=.*/DB_PASSWORD=$db_password_var/" \
        "$envFile"

    if [[ "$protocol" == "http" ]]; then
        sed -i 's/^SESSION_SECURE_COOKIE=.*/SESSION_SECURE_COOKIE=false/' "$envFile"
    else
        sed -i 's/^SESSION_SECURE_COOKIE=.*/SESSION_SECURE_COOKIE=true/' "$envFile"
    fi

    echo -e "\n.env.example configuré. Lancement de docker compose up --build..."
    docker compose up --build
fi
