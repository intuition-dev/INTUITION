# make new release of example apps

rm -rf ./examples/CRUD/node_modules
rm -rf ./examples/intu4SS/node_modules

zip -r ./examples/CRUD.zip CRUD
zip -r ./examples/intu4SS.zip intu4SS

