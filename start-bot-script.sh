mkdir /usr/src/app/audios; rm -rf /usr/src/app/node_modules/; npm install; npx prisma migrate deploy; npx prisma generate; rm -rf dist; npm run start-bot
