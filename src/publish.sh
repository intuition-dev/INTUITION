# must remove sql db
ncu
npm update
cd node-srv
rm *.sql
tsc
cd ..
cd WWW 
mbake .
cd ..
npm publish