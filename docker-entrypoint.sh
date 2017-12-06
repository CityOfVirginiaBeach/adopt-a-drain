#!/bin/sh
set -e

# run default entrypoint
#/usr/local/bin/docker-php-entrypoint


# cleanup old pid file if bind-mounting source locally
[ -f ./tmp/pids/server.pid ] && rm ./tmp/pids/server.pid

# if secret file exists, pass it to envvar
if [ -z "$DATABASE_URL" ] 
then 
  export DATABASE_URL=$(cat /run/secrets/DATABASE_URL) 
fi

# if maps api key file exists, pass it to envvar
if [ -z "$GOOGLE_MAPS_JAVASCRIPT_API_KEY" ]
then
    export GOOGLE_MAPS_JAVASCRIPT_API_KEY=$(cat /run/secrets/GOOGLE_MAPS_JAVASCRIPT_API_KEY)
fi

# if skylight auth file exists, pass it to envvar
if [ -z "$SKYLIGHT_AUTHENTICATION" ]
then
    export SKYLIGHT_AUTHENTICATION=$(cat /run/secrets/SKYLIGHT_AUTHENTICATION)
fi

# if smtp username file exists, pass it to envvar
if [ -z "$SES_SMTP_USERNAME" ]
then
    export SES_SMTP_USERNAME=$(cat /run/secrets/SES_SMTP_USERNAME)
fi

# if maps api key file exists, pass it to envvar
if [ -z "$SES_SMTP_PASSWORD" ]
then
    export SES_SMTP_PASSWORD=$(cat /run/secrets/SES_SMTP_PASSWORD)
fi




# pass execution to the CMD value
exec "$@"
