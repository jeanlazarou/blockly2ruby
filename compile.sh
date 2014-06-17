export BLOCKLY_DIR=/home/lab/tools/blockly/blockly-read-only
export CLOSURE_LIB_DIR=/home/lab/tools/blockly/closure-library-read-only

phantomjs compiler/blockly_compiler.js $*
