#!/bin/sh
#
# ENVIRONMENT
#
VERSION=$1
HEADER="// Quantum ${VERSION} | Copyright © 2017-$(date +'%Y') Daniele Veneroni | Released under MIT License (X11 License)"
#HEADER="// Quantum ${VERSION} | Copyright © 2017-$(date +'%Y') Daniele Veneroni | Released under MIT License (X11 License)"
#
# CLEANUP
#
echo "Cleanup started."
find . -type f -name *.min.js -exec rm {} \;
find . -type f -name *.map -exec rm {} \;
echo "Cleanup completed."
#
# BUILD
#
echo "Build started."
for FILE in "quantum" "quantum.table" "quantum.blackgate"; do
	uglifyjs ${FILE}.js --output ${FILE}.min.js --screw-ie8 --mangle --prefix relative --source-map ${FILE}.min.js.map --source-map-include-sources --preamble ${HEADER}
	if ! [ $? -eq 0 ]; then
		echo "Error while building ${FILE}.js"
		exit 1
	else
		echo "Successfully builded ${FILE}.js"
	fi
done
echo "Build completed."
