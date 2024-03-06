echo "DB_URL=$DB_URL" >> .env
npm install
npx prisma generate
npx prisma db push
npx prisma studio &
npx ts-node prisma/seed.ts
npm run start:dev