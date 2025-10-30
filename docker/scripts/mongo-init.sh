#!/bin/bash
set -e

# MongoDB initialization script for production
# This script creates the application database and user

mongosh <<EOF
use admin
db.auth('${MONGO_ROOT_USERNAME}', '${MONGO_ROOT_PASSWORD}')

use stock-management
db.createUser({
  user: '${MONGO_APP_USERNAME:-appuser}',
  pwd: '${MONGO_APP_PASSWORD:-apppassword}',
  roles: [
    {
      role: 'readWrite',
      db: 'stock-management'
    }
  ]
})

db.createCollection('portfolios')
db.portfolios.createIndex({ symbol: 1 })
db.portfolios.createIndex({ createdAt: -1 })

print('MongoDB initialization completed')
EOF
