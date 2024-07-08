echo "Deploying application ..."

git reset --hard origin/main

git pull origin main

npm install

pm2 stop app-1

npm run build

pm2 restart app-1