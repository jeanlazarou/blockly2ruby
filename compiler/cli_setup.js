fs = require('fs');
system = require('system');

/*
 * outputs the message to the console with a usage message
 * stop execution if exitOnError is true (default)
 */
var reportError = function (message, exitOnError) {
  
  var exitCode = 3;
  
  if (exitOnError === undefined) exitOnError = true;
  
  if (message != undefined) {
    console.error(message);
    exitCode = 0;
  }
  
  console.info("Usage: " + system.args[0] + " [switches] input1.xml [input2.xml ...] ouptput-dir");
  console.info("");
  console.info("Compile the given input Blockly XML file(s) to the given");
  console.info("output direcotry.");
  console.info("");
  console.info("Example:");
  console.info("   compile.sh tests/generators/*.xml generated/");
  console.info("");
  console.info("Where switches are:");
  console.info("   -h, --help            display this message and exit");
  console.info("   -v, --verbose         run in a verbose mode");
  
  if (exitOnError) phantom.exit(exitCode);
  
}

CLI = {};

CLI.checkEnvironment = function () {
  
  var envOk = true;
  
  if (system.env['BLOCKLY_DIR'] == undefined) {
    envOk = false;
    console.error("Missing BLOCKLY_DIR environment variable");
  }
  
  if (system.env['CLOSURE_LIB_DIR'] == undefined) {
    envOk = false;
    console.error("Missing CLOSURE_LIB_DIR environment variable");
  }
  
  return envOk;
  
};

CLI.validateOptions = function() {
  
  if (this.outputDir === undefined || this.inputFiles.length === 0) {
    reportError("Missing arguments");
  }
  
  if (!fs.isDirectory(this.outputDir)) {
    reportError("Invalid output directory '" + this.outputDir + "'");
  }
  
  if (this.outputDir[this.outputDir.length - 1] != fs.separator) {
    this.outputDir = this.outputDir  + fs.separator;
  }
  
  this.inputFiles.forEach(function (file) {
    
    if (!fs.isFile(file)) {
      reportError("File '" + file + "' not found.");
    }
    
  });
  
};

CLI.retrieveOptions = function () {

  if (!this.checkEnvironment()) {
    phantom.exit(3);
  }

  window.BLOCKLY_DIR = system.env['BLOCKLY_DIR'];
  window.CLOSURE_LIB_DIR = system.env['CLOSURE_LIB_DIR'] + '/closure/goog';

  var rest = [];
  var verbose = false;
  var displayHelp = false;

  system.args.forEach(function (arg, i) {
    
    if (i == 0) return;
    
    if (arg === '-h' || arg === '--help') {
      displayHelp = true;
    } else if (arg === '-v' || arg === '--verbose') {
      verbose = true;
    } else {
      rest.push(arg);
    }
    
  });

  this.verbose = verbose;
  
  if (displayHelp) {
    reportError();
  }
  
  this.inputFiles = rest;

  this.outputDir = this.inputFiles.pop();

  this.validateOptions();
  
};

CLI.outputFile = function(file) {
  
  var path = fs.absolute(file).split(fs.separator);
  
  var outputFile = this.outputDir + path[path.length - 1];
  
  return outputFile.replace(/\.xml$/i, ".rb");

}
