FROM phpdockerio/php:7.4-fpm
WORKDIR "/application"

RUN apt-get update; \
    apt-get -y --no-install-recommends install \
        git \
        php7.4-gd \
        php7.4-memcached \
        php7.4-mysql \
        php7.4-xdebug \
        mariadb-client;

RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -;

RUN apt-get install -y nodejs;

RUN apt-get clean; \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/share/doc/*;
