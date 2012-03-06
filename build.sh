#!/bin/sh
#minify with Closure Compiler.
#http://code.google.com/p/closure-compiler/
java -jar compiler.jar\
  --js=src/mp4.js\
  --js=src/mp4.utils.js\
  --js=src/mp4.descr.js\
  --js=src/mp4.box.js\
  --js=src/mp4.main.js\
  --js_output_file=bin/mp4.min.js