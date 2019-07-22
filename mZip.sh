# make new release of example apps

rm -rf ./CRUD/node_modules
rm -rf ./intu4SS/node_modules

zip -r ./CRUD.zip CRUD
zip -r ./intu4SS.zip intu4SS

