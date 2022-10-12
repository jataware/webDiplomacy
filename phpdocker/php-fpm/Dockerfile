FROM phpdockerio/php:7.4-fpm
WORKDIR "/application"

RUN apt-get update; \
    apt-get -y --no-install-recommends install \
        git \
        nodejs=18.7.0 \
        npm=8.15.0 \
        php7.4-gd \
        php7.4-memcached \
        php7.4-mysql \
        php7.4-xdebug \
        mariadb-client; \
    apt-get clean; \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*
