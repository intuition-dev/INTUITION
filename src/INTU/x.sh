mbake .
mbake -t .
mbake -s admin/assets
mbake -s edit/assets

find . -name *.min.js -delete

#mbakex -w .