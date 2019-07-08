cd admin/
mbake .
cd assets/
mbake -s . && mbake -t .
cd ../../editors/
mbake .
cd assets/
mbake -s . && mbake -t .
cd ../../setup/
mbake .
cd assets/
mbake -s . && mbake -t .
cd ../..
yarn && tsc && ts-node index.ts