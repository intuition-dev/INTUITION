# make new release of example apps
rm *.zip

rm -rf ./examples/CRUD/node_modules
rm -rf ./examples/intu4S_S/node_modules

zip -r ./CRUD.zip ./examples/CRUD
zip -r ./intu4SS.zip ./examples/intu4S_S

