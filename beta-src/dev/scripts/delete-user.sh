#!/usr/bin/env bash 
aws cognito-idp admin-delete-user --user-pool-id $COGNITO_USER_POOL_ID --username $1
