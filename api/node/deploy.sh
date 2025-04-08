echo "Switching to branch main"
git checkout main

echo "Pulling latest changes from main"
git pull origin main

echo "Building app"
yarn build

echo "Deploying files to the server"
scp -r * lf@192.168.0.113:/home/lf/node-server/

echo "Done"