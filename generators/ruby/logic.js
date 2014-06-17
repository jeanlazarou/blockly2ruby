'use strict';

goog.provide('Blockly.Ruby.logic');

goog.require('Blockly.Ruby');


Blockly.Ruby['controls_if'] = function(block) {
  // If/elseif/else condition.
  var n = 0;
  var argument = Blockly.Ruby.valueToCode(block, 'IF' + n,
      Blockly.Ruby.ORDER_NONE) || 'false';
  var branch = Blockly.Ruby.statementToCode(block, 'DO' + n) || '\n';
  var code = 'if ' + argument + '\n' + branch;
  for (n = 1; n <= block.elseifCount_; n++) {
    argument = Blockly.Ruby.valueToCode(block, 'IF' + n,
        Blockly.Ruby.ORDER_NONE) || 'false';
    branch = Blockly.Ruby.statementToCode(block, 'DO' + n) || '\n';
    code += 'elsif ' + argument + '\n' + branch;
  }
  if (block.elseCount_) {
    branch = Blockly.Ruby.statementToCode(block, 'ELSE') || '\n';
    code += 'else\n' + branch;
  }
  code += 'end\n';
  return code;
};

Blockly.Ruby['logic_compare'] = function(block) {
  // Comparison operator.
  var OPERATORS = {
    EQ: '==',
    NEQ: '!=',
    LT: '<',
    LTE: '<=',
    GT: '>',
    GTE: '>='
  };
  var operator = OPERATORS[block.getFieldValue('OP')];
  var order = Blockly.Ruby.ORDER_RELATIONAL;
  var argument0 = Blockly.Ruby.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.Ruby.valueToCode(block, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Ruby['logic_operation'] = function(block) {
  // Operations 'and', 'or'.
  var operator = (block.getFieldValue('OP') == 'AND') ? '&&' : '||';
  var order = (operator == '&&') ? Blockly.Ruby.ORDER_LOGICAL_AND :
      Blockly.Ruby.ORDER_LOGICAL_OR;
  var argument0 = Blockly.Ruby.valueToCode(block, 'A', order);
  var argument1 = Blockly.Ruby.valueToCode(block, 'B', order);
  if (!argument0 && !argument1) {
    // If there are no arguments, then the return value is false.
    argument0 = 'false';
    argument1 = 'false';
  } else {
    // Single missing arguments have no effect on the return value.
    var defaultArgument = (operator == '&&') ? 'true' : 'False';
    if (!argument0) {
      argument0 = defaultArgument;
    }
    if (!argument1) {
      argument1 = defaultArgument;
    }
  }
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Ruby['logic_negate'] = function(block) {
  // Negation.
  var argument0 = Blockly.Ruby.valueToCode(block, 'BOOL',
      Blockly.Ruby.ORDER_LOGICAL_NOT) || 'true';
  var code = '! ' + argument0;
  return [code, Blockly.Ruby.ORDER_LOGICAL_NOT];
};

Blockly.Ruby['logic_boolean'] = function(block) {
  // Boolean values true and false.
  var code = (block.getFieldValue('BOOL') == 'TRUE') ? 'true' : 'false';
  return [code, Blockly.Ruby.ORDER_ATOMIC];
};

Blockly.Ruby['logic_null'] = function(block) {
  // Null data type.
  return ['nil', Blockly.Ruby.ORDER_ATOMIC];
};

Blockly.Ruby['logic_ternary'] = function(block) {
  // Ternary operator.
  var value_if = Blockly.Ruby.valueToCode(block, 'IF',
      Blockly.Ruby.ORDER_CONDITIONAL) || 'false';
  var value_then = Blockly.Ruby.valueToCode(block, 'THEN',
      Blockly.Ruby.ORDER_CONDITIONAL) || 'nil';
  var value_else = Blockly.Ruby.valueToCode(block, 'ELSE',
      Blockly.Ruby.ORDER_CONDITIONAL) || 'nil';
  var code = value_if + ' ? ' + value_then + ' : ' + value_else;
  return [code, Blockly.Ruby.ORDER_CONDITIONAL];
};
