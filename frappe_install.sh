# Use default environments
bench init --skip-redis-config-generation --frappe-branch version-14 frappe-bench
# Or set environment versions explicitly
nvm use v16
PYENV_VERSION=3.10.5 bench init --skip-redis-config-generation --frappe-branch version-14 frappe-bench
# Switch directory
cd frappe-bench

# Setup hosts
bench set-config -g db_host mariadb
bench set-config -g redis_cache redis://redis-cache:6379
bench set-config -g redis_queue redis://redis-queue:6379
bench set-config -g redis_socketio redis://redis-socketio:6379

# Create bench site
bench new-site health.localhost --mariadb-root-password 123 --admin-password admin --no-mariadb-socket

# Enable developer mode
bench --site health.localhost set-config developer_mode 1
bench --site health.localhost clear-cache

# Pull and install ERPNext
bench get-app --branch version-14 --resolve-deps erpnext
bench --site health.localhost install-app erpnext

# Pull and install Healthcare app
bench get-app healthcare
bench --site health.localhost install-app healthcare

# Pull and install Gutachtenpraxis App
bench get-app https://github.com/aronjanosch/frappe-gutachtenpraxis.git
bench --site health.localhost install-app health_gutachtenpraxis