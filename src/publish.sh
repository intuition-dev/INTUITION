# zip up the sample apps, update Base.js version
ncu -a
tsc
ts-node mbake.ts
npm publish
#sudo npm i -g mbake --unsafe-perm=true --allow-root
sudo yarn global add mbake
mbake
