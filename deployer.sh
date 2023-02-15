echo "Deploying application ..."

git reset --hard origin/main

git pull origin main

npm install

pm2 stop mainstack-assess

npm run build

pm2 restart mainstack-assess
