'use strict';

Blockly.Ruby.testCallsAndStatements = function(block) {
  
  block = block.getInputTargetBlock("DO");

  var testStatements = [];
  
  while (block) {

    if (!block.disabled) {
      
      if (block.type == "procedures_callnoreturn") {

        var name = Blockly.Ruby.validName(block.getFieldValue('NAME'));
        
        Blockly.Ruby.testMethods[name] = true;
        
      } else {
        //does not call scrub_        
        var func = this[block.type];
        if (!func) {
          throw 'Language "' + this.name_ + '" does not know how to generate code ' +
              'for block type "' + block.type + '".';
        }
        var code = func.call(block, block);
        
        testStatements.push(code);
      }
      
    }
    
    block = block.nextConnection && block.nextConnection.targetBlock();
    
  }
  
  if (testStatements.length > 0) {
    
    var funcName = Blockly.Ruby.variableDB_.getRubyName("test anonymous assertions");
    
    var code = "def " + funcName + "()\n  " +
                testStatements.join("\n  ") + "\n" +
               "end";

    Blockly.Ruby.test_case.push(code);
    
    Blockly.Ruby.test_case.push("");
    
  }
  
}

Blockly.Ruby['unittest_main'] = function(block) {
  // Container for unit tests.
  Blockly.Ruby.definitions_['require_unittest'] = "require 'test/unit'";

  var hooksSet = Blockly.Ruby.test_case != undefined;
  
  Blockly.Ruby.test_case = [];
  Blockly.Ruby.testMethods = {};
  
  Blockly.Ruby.testCallsAndStatements(block);
  
  if (!hooksSet) {
      
    Blockly.Ruby.generateDefinitions = function() {
      
      var definitions = [];
      
      for (var name in Blockly.Ruby.definitions_) {
        
        var def = Blockly.Ruby.definitions_[name];
        
        if (Blockly.Ruby.testMethods[name]) {
          Blockly.Ruby.test_case.push(def);
          Blockly.Ruby.test_case.push("");
        } else {
          definitions.push(def);
        }
        
      }
      
      return definitions;
      
    }
    
    Blockly.Ruby.original_finish = Blockly.Ruby.finish;
    
    Blockly.Ruby.finish = function(code) {
      
      var finalCode = Blockly.Ruby.original_finish(code);
      
      var tests = Blockly.Ruby.test_case.join("\n").replace(/\n/g, '\n  ');
      
      var classCode = "class Tests < Test::Unit::TestCase\n\n  " +
                      tests +
                      "\nend";
      
      return finalCode + classCode;
      
    }
    
  }

  return '';
  
};

Blockly.Ruby['unittest_assertequals'] = function(block) {
  // Asserts that a value equals another value.
  var message = Blockly.Ruby.quote_(block.getFieldValue('MESSAGE'));
  var actual = Blockly.Ruby.valueToCode(block, 'ACTUAL',
      Blockly.Ruby.ORDER_NONE) || 'nil';
  var expected = Blockly.Ruby.valueToCode(block, 'EXPECTED',
      Blockly.Ruby.ORDER_NONE) || 'nil';
  return 'assert_equal ' + expected + ', ' + actual + ', ' + message + '\n';
};

Blockly.Ruby['unittest_assertvalue'] = function(block) {
  // Asserts that a value is true, false, or null.
  var message = Blockly.Ruby.quote_(block.getFieldValue('MESSAGE'));
  var actual = Blockly.Ruby.valueToCode(block, 'ACTUAL',
      Blockly.Ruby.ORDER_NONE) || 'nil';
  var expected = block.getFieldValue('EXPECTED');
  if (expected == 'TRUE') {
    expected = 'true';
  } else if (expected == 'FALSE') {
    expected = 'false';
  } else if (expected == 'NULL') {
    expected = 'nil';
  }
  return 'assert_equal ' + expected + ', ' + actual + ', ' + message + '\n';
};

Blockly.Ruby['unittest_fail'] = function(block) {
  // Always assert an error.
  var resultsVar = Blockly.Ruby.variableDB_.getRubyName('unittest_results',
      Blockly.Variables.NAME_TYPE);
  var message = Blockly.Ruby.quote_(block.getFieldValue('MESSAGE'));
  return 'flunk(' + message + ')\n';
};
