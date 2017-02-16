#!/bin/sh
#
# ENVIRONMENT
#
VERSION=$1
echo "// Quantum ${VERSION} | Copyright © 2017 Daniele Veneroni | Released under MIT License (X11 License)" > header
#
# BUILD
#
uglifyjs quantum.js -o tmp -m -c --screw-ie8
cat header tmp > quantum-${VERSION}.min.js

uglifyjs quantum.table.js -o tmp -m -c --screw-ie8
cat header tmp > quantum-${VERSION}.min.js

uglifyjs quantum.blackgate.js -o tmp -m -c --screw-ie8
cat header tmp > quantum-${VERSION}.min.js
#
# CLEANUP
#
rm header tmp
