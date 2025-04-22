FROM php:8.2-fpm

# 1. Dépendances système + Node.js
RUN apt-get update \
  && apt-get install -y build-essential libpng-dev libjpeg-dev libonig-dev \
     libxml2-dev zip unzip curl git gnupg netcat-openbsd \
  && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
  && apt-get install -y nodejs \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www

# 2. Extensions PHP & Composer
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# 3. Copier uniquement le code
COPY . .

# 4. Entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["php-fpm"]
