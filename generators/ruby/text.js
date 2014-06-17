'use strict';

goog.provide('Blockly.Ruby.text');

goog.require('Blockly.Ruby');


Blockly.Ruby['text'] = function(block) {
  // Text value.
  var code = Blockly.Ruby.quote_(block.getFieldValue('TEXT'));
  return [code, Blockly.Ruby.ORDER_ATOMIC];
};

Blockly.Ruby['text_join'] = function(block) {
  // Create a string made up of any number of elements of any type.
  var code;
  if (block.itemCount_ == 0) {
    return ['\'\'', Blockly.Ruby.ORDER_ATOMIC];
  } else if (block.itemCount_ == 1) {
    var argument0 = Blockly.Ruby.valueToCode(block, 'ADD0',
        Blockly.Ruby.ORDER_NONE) || '\'\'';
    code = argument0 + '.to_s';
    return [code, Blockly.Ruby.ORDER_FUNCTION_CALL];
  } else if (block.itemCount_ == 2) {
    var argument0 = Blockly.Ruby.valueToCode(block, 'ADD0',
        Blockly.Ruby.ORDER_NONE) || '\'\'';
    var argument1 = Blockly.Ruby.valueToCode(block, 'ADD1',
        Blockly.Ruby.ORDER_NONE) || '\'\'';
    var code = argument0 + '.to_s + ' + argument1 + '.to_s';
    return [code, Blockly.Ruby.ORDER_UNARY_SIGN];
  } else {
    var code = [];
    for (var n = 0; n < block.itemCount_; n++) {
      code[n] = (Blockly.Ruby.valueToCode(block, 'ADD' + n,
          Blockly.Ruby.ORDER_NONE) || '\'\'') + '.to_s';
    }
    code = code.join(' + ');
    return [code, Blockly.Ruby.ORDER_FUNCTION_CALL];
  }
};

Blockly.Ruby['text_append'] = function(block) {
  // Append to a variable in place.
  var varName = Blockly.Ruby.variableDB_.getRubyName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.Ruby.valueToCode(block, 'TEXT',
      Blockly.Ruby.ORDER_NONE) || '\'\'';
  return varName + ' = ' + varName + '.to_s + (' + argument0 + ').to_s\n';
};

Blockly.Ruby['text_length'] = function(block) {
  // String length.
  var argument0 = Blockly.Ruby.valueToCode(block, 'VALUE',
      Blockly.Ruby.ORDER_NONE) || '\'\'';
  return [argument0 + '.size', Blockly.Ruby.ORDER_FUNCTION_CALL];
};

Blockly.Ruby['text_isEmpty'] = function(block) {
  // Is the string null?
  var argument0 = Blockly.Ruby.valueToCode(block, 'VALUE',
      Blockly.Ruby.ORDER_NONE) || '\'\'';
  var code = argument0 + '.empty?';
  return [code, Blockly.Ruby.ORDER_FUNCTION_CALL];
};

Blockly.Ruby['text_indexOf'] = function(block) {
  // Search the text for a substring.
  // Should we allow for non-case sensitive???
  var finder = block.getFieldValue('END') == 'FIRST' ? '.find_first' : '.find_last';
  var search = Blockly.Ruby.valueToCode(block, 'FIND',
      Blockly.Ruby.ORDER_NONE) || '\'\'';
  var text = Blockly.Ruby.valueToCode(block, 'VALUE',
      Blockly.Ruby.ORDER_MEMBER) || '\'\'';
  var code = text + finder + '(' + search + ')';
  return [code, Blockly.Ruby.ORDER_FUNCTION_CALL];
};

Blockly.Ruby['text_charAt'] = function(block) {
  // Get letter at index.
  // Note: Until January 2013 this block did not have the WHERE input.
  var where = block.getFieldValue('WHERE') || 'FROM_START';
  var at = Blockly.Ruby.valueToCode(block, 'AT',
      Blockly.Ruby.ORDER_UNARY_SIGN) || '1';
  var text = Blockly.Ruby.valueToCode(block, 'VALUE',
      Blockly.Ruby.ORDER_MEMBER) || '\'\'';

  // Blockly uses one-based indicies.
  if (Blockly.isNumber(at)) {
    // If the index is a naked number, decrement it right now.
    at = parseInt(at, 10) - 1;
  } else {
    // If the index is dynamic, decrement it in code.
    at = at + '.to_i - 1';
  }

  switch (where) {
    case 'FIRST':
      var code = text + '[0]';
      return [code, Blockly.Ruby.ORDER_MEMBER];
    case 'LAST':
      var code = text + '[-1]';
      return [code, Blockly.Ruby.ORDER_MEMBER];
    case 'FROM_START':
      var functionName = Blockly.Ruby.provideFunction_(
          'text_get_from_start',
          ['def ' + Blockly.Ruby.FUNCTION_NAME_PLACEHOLDER_ + ' (text, index)',
           '  return "" if index < 0',
           '  text[index] || ""',
           'end']);
      var code = functionName + '(' + text + ', ' + at + ')';
      return [code, Blockly.Ruby.ORDER_FUNCTION_CALL];
    case 'FROM_END':
      var functionName = Blockly.Ruby.provideFunction_(
          'text_get_from_end',
          ['def ' + Blockly.Ruby.FUNCTION_NAME_PLACEHOLDER_ + ' (text, index)',
           '  return "" if index < 0',
           '  text[-index-1] || ""',
           'end']);
      var code = functionName + '(' + text + ', ' + at + ')';
      return [code, Blockly.Ruby.ORDER_FUNCTION_CALL];
    case 'RANDOM':
      var functionName = Blockly.Ruby.provideFunction_(
          'text_random_letter',
          ['def ' + Blockly.Ruby.FUNCTION_NAME_PLACEHOLDER_ + ' (text)',
           '  text[rand(text.size)]',
           'end']);
      code = functionName + '(' + text + ')';
      return [code, Blockly.Ruby.ORDER_FUNCTION_CALL];
  }
  throw 'Unhandled option (text_charAt).';
};

Blockly.Ruby['text_getSubstring'] = function(block) {
  // Get substring.
  var text = Blockly.Ruby.valueToCode(block, 'STRING',
      Blockly.Ruby.ORDER_MEMBER) || '\'\'';
  var where1 = block.getFieldValue('WHERE1');
  var where2 = block.getFieldValue('WHERE2');
  var at1 = Blockly.Ruby.valueToCode(block, 'AT1',
      Blockly.Ruby.ORDER_NONE) || '1';
  var at2 = Blockly.Ruby.valueToCode(block, 'AT2',
      Blockly.Ruby.ORDER_NONE) || '1';
  if (where1 == 'FIRST' || (where1 == 'FROM_START' && at1 == '1')) {
    at1 = '0';
  } else if (where1 == 'FROM_START') {
    // Blockly uses one-based indicies.
    if (Blockly.isNumber(at1)) {
      // If the index is a naked number, decrement it right now.
      at1 = parseInt(at1, 10) - 1;
    } else {
      // If the index is dynamic, decrement it in code.
      at1 = t1 + '.to_i - 1';
    }
  } else if (where1 == 'FROM_END') {
    if (Blockly.isNumber(at1)) {
      at1 = -parseInt(at1, 10);
    } else {
      at1 = '-' + at1 + '.to_i';
    }
  }
  if (where2 == 'LAST' || (where2 == 'FROM_END' && at2 == '1')) {
    at2 = '-1';
  } else if (where2 == 'FROM_START') {
    if (Blockly.isNumber(at2)) {
      at2 = parseInt(at2, 10) - 1;
    } else {
      at2 = at2 + '.to_i - 1'; 
    }
  } else if (where2 == 'FROM_END') {
    if (Blockly.isNumber(at2)) {
      at2 = - parseInt(at2, 10);
    } else {
      at2 = at2 + '.to_i';
    }
  }
  var code = text + '[' + at1 + '..' + at2 + ']';
  return [code, Blockly.Ruby.ORDER_MEMBER];
};

Blockly.Ruby['text_changeCase'] = function(block) {
  // Change capitalization.
  var OPERATORS = {
    UPPERCASE: '.upcase',
    LOWERCASE: '.downcase',
    TITLECASE: null
  };
  var code;
  var operator = OPERATORS[block.getFieldValue('CASE')];
  if (operator) {
    var operator = OPERATORS[block.getFieldValue('CASE')];
    var argument0 = Blockly.Ruby.valueToCode(block, 'TEXT',
        Blockly.Ruby.ORDER_MEMBER) || '\'\'';
    code = argument0 + operator;
  } else {
    // Title case is not a native Ruby function. Define one.
    var functionName = Blockly.Ruby.provideFunction_(
        'text_to_title_case',
        [ 'def ' + Blockly.Ruby.FUNCTION_NAME_PLACEHOLDER_ + '(str)',
           '  str.gsub(/\\S+/) {|txt| txt.capitalize}',
          'end']);
    var argument0 = Blockly.Ruby.valueToCode(block, 'TEXT',
        Blockly.Ruby.ORDER_NONE) || '\'\'';
    code = functionName + '(' + argument0 + ')';
  }  
  
  return [code, Blockly.Ruby.ORDER_MEMBER];
};

Blockly.Ruby['text_trim'] = function(block) {
  // Trim spaces.
  var OPERATORS = {
    LEFT: '.lstrip',
    RIGHT: '.rstrip',
    BOTH: '.strip'
  };
  var operator = OPERATORS[block.getFieldValue('MODE')];
  var argument0 = Blockly.Ruby.valueToCode(block, 'TEXT',
      Blockly.Ruby.ORDER_MEMBER) || '\'\'';
  var code = argument0 + operator;
  return [code, Blockly.Ruby.ORDER_MEMBER];
};

Blockly.Ruby['text_print'] = function(block) {
  // Print statement.
  var argument0 = Blockly.Ruby.valueToCode(block, 'TEXT',
      Blockly.Ruby.ORDER_NONE) || '\'\'';
  return 'blockly_puts(' + argument0 + ')\n';
};

Blockly.Ruby['text_prompt'] = function(block) {
  // Prompt function.
  var functionName = Blockly.Ruby.provideFunction_(
      'text_prompt',
      ['def ' + Blockly.Ruby.FUNCTION_NAME_PLACEHOLDER_ + '(msg):',
       '    print (msg)',
       '    $stdin.gets']);
  var msg = Blockly.Ruby.quote_(block.getFieldValue('TEXT'));
  var code = functionName + '(' + msg + ')';
  var toNumber = block.getFieldValue('TYPE') == 'NUMBER';
  if (toNumber) {
    code = code + '.to_f';
  }
  return [code, Blockly.Ruby.ORDER_FUNCTION_CALL];
};
