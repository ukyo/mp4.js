#!/usr/bin/env python

import os
import sys

TEMPORARY_FILE_PATH = "tmp.js"
COMPILER_PATH = "../../compiler.jar"
REPOSITORY_NAME = "mp4.js"
REPOSITORY_URL = "http://github.com/ukyo/mp4.js" 
OUTPUT_NAME = "mp4.min.js"

JS_FILES = (
    "../src/mp4.js",
    "../src/mp4.utils.js",
    "../src/mp4.descr.js",
    "../src/mp4.box.js",
    "../src/mp4.main.js",
)



def main(compiler_path):
    os.system("java -jar %s --js %s --js_output_file %s" % (compiler_path, ' '.join(JS_FILES), TEMPORARY_FILE_PATH))
    f = open(OUTPUT_NAME, "w")
    f.write("// %s %s\n" % (REPOSITORY_NAME, REPOSITORY_URL))
    f.write(open(TEMPORARY_FILE_PATH, "r").read())
    f.close()
    os.remove(TEMPORARY_FILE_PATH)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        main(sys.argv[1])
    else:
        main(COMPILER_PATH)