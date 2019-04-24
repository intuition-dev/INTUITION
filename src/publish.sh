# zip up the sample apps, update Base.ts version
# ncu -u
echo 'Make sure WebAdmin secrets are not in zip'
tsc
node mbake.js
npm publish
#sudo npm i -g mbake --unsafe-perm=true --allow-root
# if changed node version do this:
# sudo yarn global remove mbake
sudo yarn global add mbake
mbakeX

# find . -type f -name 'package-lock.json' 