'use strict';

goog.provide('Blockly.Ruby.lists');

goog.require('Blockly.Ruby');


Blockly.Ruby['lists_create_empty'] = function(block) {
  // Create an empty list.
  return ['[]', Blockly.Ruby.ORDER_ATOMIC];
};

Blockly.Ruby['lists_create_with'] = function(block) {
  // Create a list with any number of elements of any type.
  var code = new Array(block.itemCount_);
  for (var n = 0; n < block.itemCount_; n++) {
    code[n] = Blockly.Ruby.valueToCode(block, 'ADD' + n,
        Blockly.Ruby.ORDER_NONE) || 'None';
  }
  code = '[' + code.join(', ') + ']';
  return [code, Blockly.Ruby.ORDER_ATOMIC];
};

Blockly.Ruby['lists_repeat'] = function(block) {
  // Create a list with one element repeated.
  var argument0 = Blockly.Ruby.valueToCode(block, 'ITEM',
      Blockly.Ruby.ORDER_NONE) || 'None';
  var argument1 = Blockly.Ruby.valueToCode(block, 'NUM',
      Blockly.Ruby.ORDER_MULTIPLICATIVE) || '0';
  var code = '[' + argument0 + '] * ' + argument1;
  return [code, Blockly.Ruby.ORDER_MULTIPLICATIVE];
};

Blockly.Ruby['lists_length'] = function(block) {
  // List length.
  var argument0 = Blockly.Ruby.valueToCode(block, 'VALUE',
      Blockly.Ruby.ORDER_NONE) || '[]';
  return [argument0 + '.length', Blockly.Ruby.ORDER_FUNCTION_CALL];
};

Blockly.Ruby['lists_isEmpty'] = function(block) {
  // Is the list empty?
  var argument0 = Blockly.Ruby.valueToCode(block, 'VALUE',
      Blockly.Ruby.ORDER_NONE) || '[]';
  var code = argument0 + '.empty?';
  return [code, Blockly.Ruby.ORDER_LOGICAL_NOT];
};

Blockly.Ruby['lists_indexOf'] = function(block) {
  // Find an item in the list.
  var search = Blockly.Ruby.valueToCode(block, 'FIND',
      Blockly.Ruby.ORDER_NONE) || '[]';
  var list = Blockly.Ruby.valueToCode(block, 'VALUE',
      Blockly.Ruby.ORDER_MEMBER) || '\'\'';
  var finder = block.getFieldValue('END') == 'FIRST' ? '.find_first' : '.find_last';
  var code = list + finder + '(' + search + ')';
  return [code, Blockly.Ruby.ORDER_FUNCTION_CALL];
};

Blockly.Ruby['lists_getIndex'] = function(block) {
  // Get element at index.
  var mode = block.getFieldValue('MODE') || 'GET';
  var where = block.getFieldValue('WHERE') || 'FROM_START';
  var at = Blockly.Ruby.valueToCode(block, 'AT',
      Blockly.Ruby.ORDER_UNARY_SIGN) || '1';
  var list = Blockly.Ruby.valueToCode(block, 'VALUE',
      Blockly.Ruby.ORDER_MEMBER) || '[]';

  if (where == 'FIRST') {
    if (mode == 'GET') {
      var code = list + '.first';
      return [code, Blockly.Ruby.ORDER_FUNCTION_CALL];
    } else {
      var code = list + '.shift';
      if (mode == 'GET_REMOVE') {
        return [code, Blockly.Ruby.ORDER_FUNCTION_CALL];
      } else if (mode == 'REMOVE') {
        return code + '\n';
      }
    }
  } else if (where == 'LAST') {
    if (mode == 'GET') {
      var code = list + '.last';
      return [code, Blockly.Ruby.ORDER_MEMBER];
    } else {
      var code = list + '.pop';
      if (mode == 'GET_REMOVE') {
        return [code, Blockly.Ruby.ORDER_FUNCTION_CALL];
      } else if (mode == 'REMOVE') {
        return code + '\n';
      }
    }
  } else if (where == 'FROM_START') {
    // Blockly uses one-based indicies.
    if (Blockly.isNumber(at)) {
      // If the index is a naked number, decrement it right now.
      at = parseInt(at, 10) - 1;
    } else {
      // If the index is dynamic, decrement it in code.
      at = '(' + at + ' - 1).to_i';
    }
    if (mode == 'GET') {
      var code = list + '[' + at + ']';
      return [code, Blockly.Ruby.ORDER_MEMBER];
    } else {
      var code = list + '.delete_at(' + at + ')';
      if (mode == 'GET_REMOVE') {
        return [code, Blockly.Ruby.ORDER_FUNCTION_CALL];
      } else if (mode == 'REMOVE') {
        return code + '\n';
      }
    }
  } else if (where == 'FROM_END') {
    if (mode == 'GET') {
      var code = list + '[-' + at + ']';
      return [code, Blockly.Ruby.ORDER_MEMBER];
    } else {
      var code = list + '.delete_at(-' + at + ')';
      if (mode == 'GET_REMOVE') {
        return [code, Blockly.Ruby.ORDER_FUNCTION_CALL];
      } else if (mode == 'REMOVE') {
        return code + '\n';
      }
    }
  } else if (where == 'RANDOM') {
    if (mode == 'GET') {
      var functionName = Blockly.Ruby.provideFunction_(
          'lists_random_item',
          ['def ' + Blockly.Ruby.FUNCTION_NAME_PLACEHOLDER_ + '(myList)',
           '  myList[rand(myList.size)]',
           'end']);
      code = functionName + '(' + list + ')';
      return [code, Blockly.Ruby.ORDER_FUNCTION_CALL];
    } else {
      var functionName = Blockly.Ruby.provideFunction_(
          'lists_remove_random_item',
          ['def ' + Blockly.Ruby.FUNCTION_NAME_PLACEHOLDER_ + '(myList)',
           '  myList.delete_at(rand(myList.size))',
           'end']);
      code = functionName + '(' + list + ')';
      if (mode == 'GET_REMOVE') {
        return [code, Blockly.Ruby.ORDER_FUNCTION_CALL];
      } else if (mode == 'REMOVE') {
        return code + '\n';
      }
    }
  }
  throw 'Unhandled combination (lists_getIndex).';
};

Blockly.Ruby['lists_setIndex'] = function(block) {
  // Set element at index.
  var list = Blockly.Ruby.valueToCode(block, 'LIST',
      Blockly.Ruby.ORDER_MEMBER) || '[]';
  var mode = block.getFieldValue('MODE') || 'GET';
  var where = block.getFieldValue('WHERE') || 'FROM_START';
  var at = Blockly.Ruby.valueToCode(block, 'AT',
      Blockly.Ruby.ORDER_NONE) || '1';
  var value = Blockly.Ruby.valueToCode(block, 'TO',
      Blockly.Ruby.ORDER_NONE) || 'None';

  if (where == 'FIRST') {
    if (mode == 'SET') {
      return list + '[0] = ' + value + '\n';
    } else if (mode == 'INSERT') {
      return list + '.unshift(' + value + ')\n';
    }
  } else if (where == 'LAST') {
    if (mode == 'SET') {
      return list + '[-1] = ' + value + '\n';
    } else if (mode == 'INSERT') {
      return list + '.push(' + value + ')\n';
    }
  } else if (where == 'FROM_START') {
    // Blockly uses one-based indicies.
    if (Blockly.isNumber(at)) {
      // If the index is a naked number, decrement it right now.
      at = parseInt(at, 10) - 1;
    } else {
      // If the index is dynamic, decrement it in code.
      at = "(" + at + ' - 1).to_i';
    }
    if (mode == 'SET') {
      return list + '[' + at + '] = ' + value + '\n';
    } else if (mode == 'INSERT') {
      return list + '.insert(' + at + ', ' + value + ')\n';
    }
  } else if (where == 'FROM_END') {
    if (mode == 'SET') {

      // Blockly uses one-based indicies.
      if (Blockly.isNumber(at)) {
        // If the index is a naked number, decrement it right now.
        at = parseInt(at, 10);
      } else {
        // If the index is dynamic, decrement it in code.
        at = "(" + at + ').to_i';
      }

      return list + '[-' + at + '] = ' + value + '\n';
    } else if (mode == 'INSERT') {

      // Blockly uses one-based indicies.
      if (Blockly.isNumber(at)) {
        // If the index is a naked number, decrement it right now.
        at = parseInt(at, 10) + 1;
      } else {
        // If the index is dynamic, decrement it in code.
        at = "(" + at + ' + 1).to_i';
      }

      return list + '.insert(-' + at + ', ' + value + ')\n';
    }
  } else if (where == 'RANDOM') {
    if (mode == 'SET') {
      var functionName = Blockly.Ruby.provideFunction_(
          'lists_set_random_item',
          ['def ' + Blockly.Ruby.FUNCTION_NAME_PLACEHOLDER_ + '(myList, value)',
           '  myList[rand(myList.size)] = ' + value,
           'end']);
      var code = functionName + '(' + list + ', ' + value + ')\n';
      return code;
    } else if (mode == 'INSERT') {
      var functionName = Blockly.Ruby.provideFunction_(
          'lists_insert_random_item',
          ['def ' + Blockly.Ruby.FUNCTION_NAME_PLACEHOLDER_ + '(myList, value)',
           '  myList.insert(rand(myList.size), ' + value + ')',
           'end']);
      var code = functionName + '(' + list + ', ' + value + ')\n';
      return code;
    }
  }
  throw 'Unhandled combination (lists_setIndex).';
};

Blockly.Ruby['lists_getSublist'] = function(block) {
  var functionName = Blockly.Ruby.provideFunction_(
      'lists_sublist',
      ['def ' + Blockly.Ruby.FUNCTION_NAME_PLACEHOLDER_ + '(myList, range)',
       '  myList[range] || []',
       'end']);
  // Get sublist.
  var list = Blockly.Ruby.valueToCode(block, 'LIST',
      Blockly.Ruby.ORDER_MEMBER) || '[]';
  var where1 = block.getFieldValue('WHERE1');
  var where2 = block.getFieldValue('WHERE2');
  var at1 = Blockly.Ruby.valueToCode(block, 'AT1',
      Blockly.Ruby.ORDER_ADDITIVE) || '1';
  var at2 = Blockly.Ruby.valueToCode(block, 'AT2',
      Blockly.Ruby.ORDER_ADDITIVE) || '1';
  if (where1 == 'FIRST' || (where1 == 'FROM_START' && at1 == '1')) {
    at1 = '0';
  } else if (where1 == 'FROM_START') {
    // Blockly uses one-based indicies.
    if (Blockly.isNumber(at1)) {
      at1 = parseInt(at1, 10) - 1;
    } else {
      at1 = at1 + '.to_i - 1)';
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
      at2 = -parseInt(at2, 10);
    } else {
      at2 = '-' + at2 + '.to_i';
    }
  }
  var code = functionName + '(' + list + ', ' + at1 + '..' + at2 + ')';
  return [code, Blockly.Ruby.ORDER_FUNCTION_CALL];
};
