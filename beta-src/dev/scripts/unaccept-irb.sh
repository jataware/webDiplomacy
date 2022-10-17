aws cognito-idp admin-update-user-attributes --user-pool-id $COGNITO_USER_POOL_ID --username $1 --user-attributes Name="custom:accepted-terms-at",Value=""
