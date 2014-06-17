'use strict';

goog.provide('Blockly.Ruby.procedures');

goog.require('Blockly.Ruby');


Blockly.Ruby['procedures_defreturn'] = function(block) {
  
  Blockly.Ruby.variableDB_.pushScope();
  
  // Define a procedure with a return value.
  var globals = Blockly.Variables.allVariables(block);
  for (var i = globals.length - 1; i >= 0; i--) {
    var varName = globals[i];
    if (block.arguments_.indexOf(varName) == -1) {
      globals[i] = Blockly.Ruby.variableDB_.getRubyName(varName,
          Blockly.Variables.NAME_TYPE);
    } else {
      // This variable is actually a parameter name.  Do not include it in
      // the list of globals, thus allowing it be of local scope (quote from
      // the python generator)
      globals.splice(i, 1);
    }
  }
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.Ruby.variableDB_.addLocalVariable(block.arguments_[x],
        Blockly.Variables.NAME_TYPE);
  }
  var funcName = Blockly.Ruby.variableDB_.getRubyName(block.getFieldValue('NAME'),
      Blockly.Procedures.NAME_TYPE);
  var branch = Blockly.Ruby.statementToCode(block, 'STACK');
  if (Blockly.Ruby.INFINITE_LOOP_TRAP) {
    branch = Blockly.Ruby.INFINITE_LOOP_TRAP.replace(/%1/g,
        '"' + block.id + '"') + branch;
  }
  var returnValue = Blockly.Ruby.valueToCode(block, 'RETURN',
      Blockly.Ruby.ORDER_NONE) || '';
  if (returnValue) {
    returnValue = '\n  return ' + returnValue + '\n';
  }
  var code = 'def ' + funcName + '(' + args.join(', ') + ')\n' +
      branch + returnValue + 'end';
  code = Blockly.Ruby.scrub_(block, code);
  Blockly.Ruby.definitions_[funcName] = code;

  Blockly.Ruby.variableDB_.popScope();
  
  return null;
};

// Defining a procedure without a return value uses the same generator as
// a procedure with a return value.
Blockly.Ruby['procedures_defnoreturn'] =
    Blockly.Ruby['procedures_defreturn'];

Blockly.Ruby['procedures_callreturn'] = function(block) {  
  // Call a procedure with a return value.
  var funcName = Blockly.Ruby.variableDB_.getRubyName(block.getFieldValue('NAME'),
      Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.Ruby.valueToCode(block, 'ARG' + x,
        Blockly.Ruby.ORDER_NONE) || 'None';
  }

  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.Ruby.ORDER_FUNCTION_CALL];
};

Blockly.Ruby['procedures_callnoreturn'] = function(block) {
  // Call a procedure with no return value.
  var funcName = Blockly.Ruby.variableDB_.getRubyName(block.getFieldValue('NAME'),
      Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.Ruby.valueToCode(block, 'ARG' + x,
        Blockly.Ruby.ORDER_NONE) || 'None';
  }
  var code = funcName + '(' + args.join(', ') + ')\n';
  return code;
};

Blockly.Ruby['procedures_ifreturn'] = function(block) {

  // Conditionally return value from a procedure.
  var condition = Blockly.Ruby.valueToCode(block, 'CONDITION',
      Blockly.Ruby.ORDER_NONE) || 'False';
  var code = 'if ' + condition + '\n';
  if (block.hasReturnValue_) {
    var value = Blockly.Ruby.valueToCode(block, 'VALUE',
        Blockly.Ruby.ORDER_NONE) || 'None';
    code += '\n  return ' + value + '\n';
  } else {
    code += '\n  return\n';
  }
  code += 'end\n';
  
  return code;
};
