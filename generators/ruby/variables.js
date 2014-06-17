'use strict';

goog.provide('Blockly.Ruby.variables');

goog.require('Blockly.Ruby');


Blockly.Ruby['variables_get'] = function(block) {
  // Variable getter.
  var code = Blockly.Ruby.variableDB_.getRubyName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return [code, Blockly.Ruby.ORDER_ATOMIC];
};

Blockly.Ruby['variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.Ruby.valueToCode(block, 'VALUE',
      Blockly.Ruby.ORDER_NONE) || '0';
  var varName = Blockly.Ruby.variableDB_.getRubyName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return varName + ' = ' + argument0 + '\n';
};
