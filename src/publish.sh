# zip up the sample apps, update Base.ts version
# ncu -u
echo 'Make sure WebAdmin secrets are not in zip'
tsc
node mbake.js
npm publish
#sudo npm i -g mbake --unsafe-perm=true --allow-root
#sudo yarn global remove mbake
sudo yarn global add mbake
mbakeX
#yarn global upgrade 

# find . -type f -name 'package-lock.json' 