'use strict';

goog.provide('Blockly.Ruby.math');

goog.require('Blockly.Ruby');


Blockly.Ruby['math_number'] = function(block) {
  // Numeric value.
  var code = parseFloat(block.getFieldValue('NUM'));
  var order = code < 0 ? Blockly.Ruby.ORDER_UNARY_SIGN :
              Blockly.Ruby.ORDER_ATOMIC;
  return [code, order];
};

Blockly.Ruby['math_arithmetic'] = function(block) {
  // Basic arithmetic operators, and power.
  var OPERATORS = {
    ADD: [' + ', Blockly.Ruby.ORDER_ADDITIVE],
    MINUS: [' - ', Blockly.Ruby.ORDER_ADDITIVE],
    MULTIPLY: [' * ', Blockly.Ruby.ORDER_MULTIPLICATIVE],
    DIVIDE: [' / ', Blockly.Ruby.ORDER_MULTIPLICATIVE],
    POWER: [' ** ', Blockly.Ruby.ORDER_EXPONENTIATION]
  };
  var tuple = OPERATORS[block.getFieldValue('OP')];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.Ruby.valueToCode(block, 'A', order) || '0';
  var argument1 = Blockly.Ruby.valueToCode(block, 'B', order) || '0';
  var code = argument0 + operator + argument1;
  return [code, order];
};

Blockly.Ruby['math_single'] = function(block) {
  // Math operators with single operand.
  var operator = block.getFieldValue('OP');
  var code;
  var arg;
  if (operator == 'NEG') {
    // Negation is a special case given its different operator precedence.
    var code = Blockly.Ruby.valueToCode(block, 'NUM',
        Blockly.Ruby.ORDER_UNARY_SIGN) || '0';
    return ['-' + code, Blockly.Ruby.ORDER_UNARY_SIGN];
  }
  if (operator == 'SIN' || operator == 'COS' || operator == 'TAN') {
    arg = '(' + Blockly.Ruby.valueToCode(block, 'NUM',
        Blockly.Ruby.ORDER_MULTIPLICATIVE) + ')' || '0';
  } else {
    arg = '(' + Blockly.Ruby.valueToCode(block, 'NUM',
        Blockly.Ruby.ORDER_NONE) + ')'  || '0';
  }
  // First, handle cases which generate values that don't need parentheses
  // wrapping the code.
  switch (operator) {
    case 'ABS':
      code = arg + '.abs';
      break;
    case 'ROOT':
      code = 'Math.sqrt(' + arg + ')';
      break;
    case 'LN':
      code = 'Math.log(' + arg + ')';
      break;
    case 'LOG10':
      code = 'Math.log10(' + arg + ')';
      break;
    case 'EXP':
      code = 'Math.exp(' + arg + ')';
      break;
    case 'POW10':
      code = '(10 ** ' + arg + ')';
      break;
    case 'ROUND':
      code = arg + '.round';
      break;
    case 'ROUNDUP':
      code = arg + '.ceil';
      break;
    case 'ROUNDDOWN':
      code = arg + '.floor';
      break;
    case 'SIN':
      code = 'Math.sin(' + arg + ' / 180.0 * Math::PI)';
      break;
    case 'COS':
      code = 'Math.cos(' + arg + ' / 180.0 * Math::PI)';
      break;
    case 'TAN':
      code = 'Math.tan(' + arg + ' / 180.0 * Math::PI)';
      break;
  }
  if (code) {
    return [code, Blockly.Ruby.ORDER_FUNCTION_CALL];
  }
  // Second, handle cases which generate values that may need parentheses
  // wrapping the code.
  switch (operator) {
    case 'ASIN':
      code = 'Math.asin(' + arg + ') / Math::PI * 180';
      break;
    case 'ACOS':
      code = 'Math.acos(' + arg + ') / Math::PI * 180';
      break;
    case 'ATAN':
      code = 'Math.atan(' + arg + ') / Math::PI * 180';
      break;
    default:
      throw 'Unknown math operator: ' + operator;
  }
  return [code, Blockly.Ruby.ORDER_MULTIPLICATIVE];
};

Blockly.Ruby['math_constant'] = function(block) {
  // Constants: PI, E, the Golden Ratio, sqrt(2), 1/sqrt(2), INFINITY.
  var CONSTANTS = {
    PI: ['Math::PI', Blockly.Ruby.ORDER_MEMBER],
    E: ['Math::E', Blockly.Ruby.ORDER_MEMBER],
    GOLDEN_RATIO: ['(1 + Math.sqrt(5)) / 2', Blockly.Ruby.ORDER_MULTIPLICATIVE],
    SQRT2: ['Math.sqrt(2)', Blockly.Ruby.ORDER_MEMBER],
    SQRT1_2: ['Math.sqrt(1.0 / 2)', Blockly.Ruby.ORDER_MEMBER],
    INFINITY: ['1/0.0', Blockly.Ruby.ORDER_ATOMIC]
  };
  var constant = block.getFieldValue('CONSTANT');
  return CONSTANTS[constant];
};

Blockly.Ruby['math_number_property'] = function(block) {
  // Check if a number is even, odd, prime, whole, positive, or negative
  // or if it is divisible by certain number. Returns true or false.
  var number_to_check = Blockly.Ruby.valueToCode(block, 'NUMBER_TO_CHECK',
      Blockly.Ruby.ORDER_MULTIPLICATIVE) || '0';
  var dropdown_property = block.getFieldValue('PROPERTY');
  var code;
  if (dropdown_property == 'PRIME') {
    var functionName = Blockly.Ruby.provideFunction_(
        'is_prime',
        ['def ' + Blockly.Ruby.FUNCTION_NAME_PLACEHOLDER_ + ' n',
         '  return false if n < 0',
         '  (2..Math.sqrt(n)).each { |i| return false if n % i == 0}',
         '  true',
         'end']);
    code = functionName + '(' + number_to_check + ')';
    return [code, Blockly.Ruby.ORDER_FUNCTION_CALL];
  }
  switch (dropdown_property) {
    case 'EVEN':
      code = number_to_check + '.even?';
      break;
    case 'ODD':
      code = number_to_check + '.odd?';
      break;
    case 'WHOLE':
      code = number_to_check + ' % 1 == 0';
      break;
    case 'POSITIVE':
      code = number_to_check + ' > 0';
      break;
    case 'NEGATIVE':
      code = number_to_check + ' < 0';
      break;
    case 'DIVISIBLE_BY':
      var divisor = Blockly.Ruby.valueToCode(block, 'DIVISOR',
          Blockly.Ruby.ORDER_MULTIPLICATIVE);
      // If 'divisor' is some code that evals to 0, Ruby will raise an error.
      if (!divisor || divisor == '0') {
        return ['false', Blockly.Ruby.ORDER_ATOMIC];
      }
      code = number_to_check + ' % ' + divisor + ' == 0';
      break;
  }
  return [code, Blockly.Ruby.ORDER_RELATIONAL];
};

Blockly.Ruby['math_change'] = function(block) {
  // Add to a variable in place.
  var argument0 = Blockly.Ruby.valueToCode(block, 'DELTA',
      Blockly.Ruby.ORDER_ADDITIVE) || '0';
  var varName = Blockly.Ruby.variableDB_.getRubyName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return varName + ' += ' + argument0 + '\n';
};

// Rounding functions have a single operand.
Blockly.Ruby['math_round'] = Blockly.Ruby['math_single'];
// Trigonometry functions have a single operand.
Blockly.Ruby['math_trig'] = Blockly.Ruby['math_single'];

Blockly.Ruby['math_on_list'] = function(block) {
  // Math functions for lists.
  var func = block.getFieldValue('OP');
  var list = Blockly.Ruby.valueToCode(block, 'LIST',
      Blockly.Ruby.ORDER_NONE) || '[]';
  var code;
  switch (func) {
    case 'SUM':
      code = list + '.sum';
      break;
    case 'MIN':
      code = list + '.numbers.min';
      break;
    case 'MAX':
      code = list + '.numbers.max';
      break;
    case 'AVERAGE':
      code = list + '.average';
      break;
    case 'MEDIAN':
      code = list + '.median';
      break;
    case 'MODE':
      // As a list of numbers can contain more than one mode,
      // the returned result is provided as an array.
      // Mode of [3, 'x', 'x', 1, 1, 2, '3'] -> ['x', 1].
      var functionName = Blockly.Ruby.provideFunction_(
          'math_modes',
          ['def ' + Blockly.Ruby.FUNCTION_NAME_PLACEHOLDER_ + '(some_list)',
           '  groups = some_list.group_by{|v| v}',
           '  ',
           '  groups = groups.sort {|a,b| b[1].size <=> a[1].size}',
           '  ',
           '  max_size = groups[0][1].size',
           '  ',
           '  modes = []',
           '  ',
           '  groups.each do |group|',
           '    ',
           '    break if group[1].size != max_size',
           '    ',
           '    modes << group[0]',
           '    ',
           '  end',
           '  ',
           '  modes',
           '',
           'end']);
      code = functionName + '(' + list + ')';
      break;
    case 'STD_DEV':
      code = list + '.standard_deviation';
      break;
    case 'RANDOM':
      code = list + '[rand(' + list + '.size)]';
      break;
    default:
      throw 'Unknown operator: ' + func;
  }
  return [code, Blockly.Ruby.ORDER_FUNCTION_CALL];
};

Blockly.Ruby['math_modulo'] = function(block) {
  // Remainder computation.
  var argument0 = Blockly.Ruby.valueToCode(block, 'DIVIDEND',
      Blockly.Ruby.ORDER_MULTIPLICATIVE) || '0';
  var argument1 = Blockly.Ruby.valueToCode(block, 'DIVISOR',
      Blockly.Ruby.ORDER_MULTIPLICATIVE) || '0';
  var code = argument0 + ' % ' + argument1;
  return [code, Blockly.Ruby.ORDER_MULTIPLICATIVE];
};

Blockly.Ruby['math_constrain'] = function(block) {
  // Constrain a number between two limits.
  var argument0 = Blockly.Ruby.valueToCode(block, 'VALUE',
      Blockly.Ruby.ORDER_NONE) || '0';
  var argument1 = Blockly.Ruby.valueToCode(block, 'LOW',
      Blockly.Ruby.ORDER_NONE) || '0';
  var argument2 = Blockly.Ruby.valueToCode(block, 'HIGH',
      Blockly.Ruby.ORDER_NONE) || 'float(\'inf\')';
  var code = '[[' + argument0 + ', ' + argument1 + '].max, ' +
      argument2 + '].min';
  return [code, Blockly.Ruby.ORDER_FUNCTION_CALL];
};

Blockly.Ruby['math_random_int'] = function(block) {
  // Random integer between [X] and [Y].
  var argument0 = Blockly.Ruby.valueToCode(block, 'FROM',
      Blockly.Ruby.ORDER_NONE) || '0';
  var argument1 = Blockly.Ruby.valueToCode(block, 'TO',
      Blockly.Ruby.ORDER_NONE) || '0';
  var code = 'rand(' + argument0 + '..' + argument1 + ')';
  return [code, Blockly.Ruby.ORDER_FUNCTION_CALL];
};

Blockly.Ruby['math_random_float'] = function(block) {
  // Random fraction between 0 and 1.
  return ['rand', Blockly.Ruby.ORDER_FUNCTION_CALL];
};
