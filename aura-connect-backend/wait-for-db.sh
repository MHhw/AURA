#!/bin/sh
set -e

url="${SPRING_DATASOURCE_URL:-}"
user="${SPRING_DATASOURCE_USERNAME:-postgres}"
password="${SPRING_DATASOURCE_PASSWORD:-}"

if [ -z "$url" ]; then
  echo "SPRING_DATASOURCE_URL is not set."
  exit 1
fi

rest="${url#*//}"
host_port_path="${rest%%/*}"
host="${host_port_path%%:*}"
port="${host_port_path#*:}"
[ "$port" = "$host_port_path" ] && port=5432

export PGPASSWORD="$password"

echo "Waiting for database at ${host}:${port}..."
until pg_isready -h "$host" -p "$port" -U "$user" >/dev/null 2>&1; do
  sleep 1
done

echo "Database is ready. Starting application..."
exec "$@"
