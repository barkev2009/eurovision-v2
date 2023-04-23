cd client
echo "Installing client deps..."
npm i
npm run build
nohup serve -s build -l 3001 &