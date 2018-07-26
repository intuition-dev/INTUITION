cls
rem ma-client-services js ver, admin.yaml mounts, package-lock remove in admin, package.json 2x, zip admin
call tsc
call ts-node mbake.ts
call npm publish
call npm -g i mbake
call mbake
