#!/usr/bin/env bash 
aws cognito-idp list-users --user-pool-id $COGNITO_USER_POOL_ID
