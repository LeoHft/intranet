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
  php artisan key:generate
fi

# 5. Migrations
echo "Exécution des migrations..."
php artisan migrate --seed --force -n
echo "Migrations effectuées !"

php artisan storage:link

# 6. Permissions
echo "Mise à jour des permissions..."
chown -R www-data:www-data storage bootstrap/cache public/build
chmod -R 775 storage bootstrap/cache public/build

echo "Création du lien symbolique storage..."
rm -rf /var/www/public/storage
php artisan storage:link

# 7. Démarrage de PHP-FPM
exec php-fpm