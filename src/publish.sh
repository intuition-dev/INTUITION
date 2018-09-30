#cls
#rem ma-client-services js ver, admin.yaml mounts, package-lock remove in admin, package.json 2x, zip admin
tsc
ts-node mbake.ts
npm publish
sudo npm i -g mbake --unsafe-perm=true --allow-root
mbake
