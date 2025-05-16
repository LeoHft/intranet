FROM php:8.3-rc-fpm

WORKDIR /var/www

COPY . .

# Installation de NodeJS et des dépendances
RUN apt-get update \
  && apt-get install -y build-essential libpng-dev libjpeg-dev libonig-dev \
     libxml2-dev libzip-dev pkg-config zip unzip curl gnupg netcat-openbsd \
  && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
  && apt-get install -y nodejs

# Installation de composer
RUN curl -sLS https://getcomposer.org/installer | php -- --install-dir=/usr/bin/ --filename=composer \
  && docker-php-ext-configure intl \
  && docker-php-ext-install intl mbstring dom gd zip bcmath opcache pdo \
  && docker-php-ext-install mysqli pdo_mysql \
  && apt-get -y autoremove  \
  && apt-get clean  \
  && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN composer install --no-dev --optimize-autoloader \
  && npm ci

RUN npm run build

# Entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["php-fpm"]