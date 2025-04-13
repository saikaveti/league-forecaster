echo "Switching to branch main"
git checkout main

echo "Pulling latest changes from main"
git pull origin main

echo "Deploying files to the server"
scp -r src babel.config.cjs jest.config.js package.json setupTests.js yarn.lock ca.crt ca.key cert.crt cert.key lf@192.168.0.113:/home/lf/node-server/

echo "Done"