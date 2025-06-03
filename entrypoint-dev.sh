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
  cp /var/www/.env.dev /var/www/.env
fi

# 3. Vérification de APP_KEY et génération si nécessaire
if [ -z "$APP_KEY" ]; then
  php artisan key:generate
fi

# 4. Installation des dépendances si nécessaire (pour le watch mode)
if [ ! -d "/var/www/vendor" ] || [ ! -d "/var/www/node_modules" ]; then
  echo "Installation des dépendances..."
  composer install
  npm ci
fi

# 5. Migrations
echo "Exécution des migrations..."
php artisan migrate --seed --force -n
echo "Migrations effectuées !"

php artisan storage:link

# 6. Permissions
echo "Mise à jour des permissions..."
chown -R www-data:www-data storage bootstrap/cache || true
chmod -R 775 storage bootstrap/cache || true

echo "Création du lien symbolique storage..."
rm -rf /var/www/public/storage
php artisan storage:link

# 7. Démarrage des serveurs de développement en arrière-plan
echo "Démarrage du serveur Laravel..."
php artisan serve --host=0.0.0.0 --port=8000 &

echo "Démarrage du serveur Vite..."
npm run dev -- --host 0.0.0.0 --port 5173 &

# 8. Maintenir le conteneur en vie
wait