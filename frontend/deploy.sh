echo "Switching to branch main"
git checkout main

echo "Pulling latest changes from main"
git pull origin main

echo "Cleaning directory"
yarn cache clean
rm -rf node_modules dist
yarn install

echo "Building app"
yarn build

echo "Deploying files to the server"
scp -r dist/* lf@69.62.70.91:/var/www/leagueforecaster/

echo "Done"