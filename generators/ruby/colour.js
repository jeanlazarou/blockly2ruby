'use strict';

goog.provide('Blockly.Ruby.colour');

goog.require('Blockly.Ruby');


Blockly.Ruby['colour_picker'] = function(block) {
  // Colour picker.
  var code = '\'' + block.getFieldValue('COLOUR') + '\'';
  return [code, Blockly.Ruby.ORDER_ATOMIC];
};

Blockly.Ruby['colour_random'] = function(block) {
  // Generate a random colour.
  var code = '\'#%06x\' % rand(2**24 - 1)';
  return [code, Blockly.Ruby.ORDER_FUNCTION_CALL];
};

Blockly.Ruby['colour_rgb'] = function(block) {
  // Compose a colour from RGB components expressed as percentages.
  var functionName = Blockly.Ruby.provideFunction_(
      'colour_rgb',
      [ 'def ' + Blockly.Ruby.FUNCTION_NAME_PLACEHOLDER_ + '(r, g, b)',
        '  r = (2.55 * [100, [0, r].max].min).round',
        '  g = (2.55 * [100, [0, g].max].min).round',
        '  b = (2.55 * [100, [0, b].max].min).round',
        '  \'#%02x%02x%02x\' % [r, g, b]',
        'end']);
  var r = Blockly.Ruby.valueToCode(block, 'RED',
                                     Blockly.Ruby.ORDER_NONE) || 0;
  var g = Blockly.Ruby.valueToCode(block, 'GREEN',
                                     Blockly.Ruby.ORDER_NONE) || 0;
  var b = Blockly.Ruby.valueToCode(block, 'BLUE',
                                     Blockly.Ruby.ORDER_NONE) || 0;
  var code = functionName + '(' + r + ', ' + g + ', ' + b + ')';
  return [code, Blockly.Ruby.ORDER_FUNCTION_CALL];
};

Blockly.Ruby['colour_blend'] = function(block) {
  // Blend two colours together.
  var functionName = Blockly.Ruby.provideFunction_(
      'colour_blend',
      ['def ' + Blockly.Ruby.FUNCTION_NAME_PLACEHOLDER_ +
          '(colour1, colour2, ratio) ',
        '  _, r1, g1, b1 = colour1.unpack("A1A2A2A2").map {|x| x.to_i(16)}',
        '  _, r2, g2, b2 = colour2.unpack("A1A2A2A2").map {|x| x.to_i(16)}',
        '  ratio = [1, [0, ratio].max].min',
        '  r = (r1 * (1 - ratio) + r2 * ratio).round',
        '  g = (g1 * (1 - ratio) + g2 * ratio).round',
        '  b = (b1 * (1 - ratio) + b2 * ratio).round',
        "  '#%02x%02x%02x' % [r, g, b]",
       'end']);
  var colour1 = Blockly.Ruby.valueToCode(block, 'COLOUR1',
      Blockly.Ruby.ORDER_NONE) || '\'#000000\'';
  var colour2 = Blockly.Ruby.valueToCode(block, 'COLOUR2',
      Blockly.Ruby.ORDER_NONE) || '\'#000000\'';
  var ratio = Blockly.Ruby.valueToCode(block, 'RATIO',
      Blockly.Ruby.ORDER_NONE) || 0;
  var code = functionName + '(' + colour1 + ', ' + colour2 + ', ' + ratio + ')';
  return [code, Blockly.Ruby.ORDER_FUNCTION_CALL];
};
