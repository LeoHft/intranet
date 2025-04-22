#!/bin/bash
set -e

# 1. Attente de la BDD
until nc -z $DB_HOST $DB_PORT; do
  echo "MariaDB n'est pas encore prêt, attente..."
  sleep 2
done
echo "MariaDB disponible !"

# 2. .env et APP_KEY
if [ ! -f /var/www/.env ]; then
  cp /var/www/.env.example /var/www/.env
fi

if [ -z "$APP_KEY" ]; then
  php artisan key:generate --force
fi

# 3. Install PHP dependencies
echo "Installation des dépendances PHP..."
composer install --no-dev --optimize-autoloader --prefer-dist --no-interaction

# 4. Install JS dependencies & build assets
echo "Installation des dépendances JS et build des assets..."
npm ci
npm run build

# 5. Migrations
echo "Exécution des migrations..."
php artisan migrate --seed --force
echo "Migrations effectuées !"

php artisan storage:link

# 6. Permissions
echo "Mise à jour des permissions..."
chown -R www-data:www-data storage bootstrap/cache public/build
chmod -R 775 storage bootstrap/cache public/build

# 7. Démarrage de PHP-FPM
exec php-fpm
