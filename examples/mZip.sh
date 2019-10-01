# make new release of example apps
rm *.zip
rm *.sqlite

rm -rf ./examples/CRUD/node_modules
rm -rf ./examples/CMS/node_modules

zip -r ./CRUD.zip ./examples/CRUD
zip -r ./CMS.zip ./examples/CMS
