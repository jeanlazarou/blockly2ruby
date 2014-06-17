//TODO CLI: pass target language
//TODO compile only newer files

///TODO phantom.exit(code) does not return code value
///TODO phantom.injectJs or require??

require('./cli_setup.js');

CLI.retrieveOptions();

require('./dependencies.js');

//TODO quick and dirty workaround a 'Realtime' concept added since last sync w/ repository (next 2 lines)
Blockly.Realtime = {};
Blockly.Realtime.isEnabled = function() { return false; };

window.BLOCKLY_BOOT();

Blockly.Xml.domToWorkspace = function(workspace, xml) {
  for (var x = 0, xmlChild; xmlChild = xml.childNodes[x]; x++) {
    if (xmlChild.nodeName.toLowerCase() == 'block') {
      Blockly.Xml.domToBlock(workspace, xmlChild);
    }
  }
};

Blockly.mainWorkspace = new Blockly.Workspace(false);
Blockly.mainWorkspace.createDom();

CLI.inputFiles.forEach(function (file) {
	
  var xmlDoc;
	var xmlText = fs.read(file);

  var outputFile = CLI.outputFile(file);
  
  try {
    
    xmlDoc = Blockly.Xml.textToDom(xmlText);  
    
  } catch (e) {
    console.error('Error parsing XML:\n' + e);
    phantom.exit(3);
  }

  try {
    
    Blockly.mainWorkspace.clear();

    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xmlDoc);

    var code = Blockly.Ruby.workspaceToCode();

    if (CLI.verbose) {
      console.info("Wrote " + CLI.outputFile(file));
    }
    
    fs.write(CLI.outputFile(file), code, 'w');
    
  } catch (e) {
    console.error('Errors:\n' + e);
    phantom.exit(3);
  }

});

phantom.exit();
