#!/bin/bash
java -jar ~/.local/share/closure-compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS --js src/lib/*.js src/script.js --js_output_file dist/dist.js
advzip -4 -a dist.zip dist/*
