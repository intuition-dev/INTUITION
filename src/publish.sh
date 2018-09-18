#cls
#rem ma-client-services js ver, admin.yaml mounts, package-lock remove in admin, package.json 2x, zip admin
tsc
ts-node mbake.ts
npm publish
sudo npm -g i mbake
mbake
