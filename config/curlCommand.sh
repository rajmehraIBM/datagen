curl -vX POST http://rm1-datagen.mybluemix.net/api/generateData -d @specAddress.json \
--header "Content-Type: application/json" -o ./Address.csv

curl -vX POST http://rm1-datagen.mybluemix.net/api/generateData -d @specUser.json \
--header "Content-Type: application/json" -o ./User.csv

curl -vX POST http://rm1-datagen.mybluemix.net/api/generateData -d @specPartner.json \
--header "Content-Type: application/json" -o ./Partner.sql

curl -vX POST http://rm1-datagen.mybluemix.net/api/generateData -d @specPortalUser.json \
--header "Content-Type: application/json" -o ./PortalUser.sql

curl -vX POST http://rm1-datagen.mybluemix.net/api/generateData -d @specBillingEntity.json \
--header "Content-Type: application/json" -o ./BillingEntity.sql

curl -vX POST http://rm1-datagen.mybluemix.net/api/generateData -d @specSubscription.json \
--header "Content-Type: application/json" -o ./Subscription.sql