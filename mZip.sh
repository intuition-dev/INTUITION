# make new release of example apps

rm -rf ./CRUD/node_modules
rm -rf ./intu4SS/node_modules

rm ./docs/*.zip

zip -r ./docs/CRUD.zip CRUD
zip -r ./docs/intu4SS.zip intu4SS

