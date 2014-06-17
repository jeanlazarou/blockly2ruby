'use strict';

goog.provide('Blockly.Ruby.loops');

goog.require('Blockly.Ruby');


Blockly.Ruby['controls_repeat'] = function(block) {
  // Repeat n times (internal number).
  var repeats = parseInt(block.getFieldValue('TIMES'), 10);
  var branch = Blockly.Ruby.statementToCode(block, 'DO') || 'end\n';
  if (Blockly.Ruby.INFINITE_LOOP_TRAP) {
    branch = Blockly.Ruby.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + block.id + '\'') + branch;
  }
  var code = repeats + '.times do\n' + branch + "end\n";
  return code;
};

Blockly.Ruby['controls_repeat_ext'] = function(block) {
  // Repeat n times (external number).
  var repeats = Blockly.Ruby.valueToCode(block, 'TIMES',
      Blockly.Ruby.ORDER_NONE) || '0';
  if (Blockly.isNumber(repeats)) {
    repeats = parseInt(repeats, 10);
  } else {
    repeats = repeats + '.to_i';
  }
  var branch = Blockly.Ruby.statementToCode(block, 'DO') || 'end\n';
  if (Blockly.Ruby.INFINITE_LOOP_TRAP) {
    branch = Blockly.Ruby.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + block.id + '\'') + branch;
  }
  var code = repeats + '.times do\n' + branch + "end\n";
  return code;
};

Blockly.Ruby['controls_whileUntil'] = function(block) {
  // Do while/until loop.
  var until = block.getFieldValue('MODE') == 'UNTIL';
  var argument0 = Blockly.Ruby.valueToCode(block, 'BOOL',
      until ? Blockly.Ruby.ORDER_LOGICAL_NOT :
      Blockly.Ruby.ORDER_NONE) || 'false';
  var branch = Blockly.Ruby.statementToCode(block, 'DO') || 'end\n';
  if (Blockly.Ruby.INFINITE_LOOP_TRAP) {
    branch = Blockly.Ruby.INFINITE_LOOP_TRAP.replace(/%1/g,
        '"' + block.id + '"') + branch;
  }
  var mode = until ? 'until ' : 'while '
  return mode + argument0 + ' do\n' + branch + "end\n";
};

Blockly.Ruby['controls_for'] = function(block) {
  // For loop.
  Blockly.Ruby.variableDB_.pushScope();

  var loopVar = Blockly.Ruby.variableDB_.addLocalVariable(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var fromVal = Blockly.Ruby.valueToCode(block, 'FROM',
      Blockly.Ruby.ORDER_NONE) || '0';
  var toVal = Blockly.Ruby.valueToCode(block, 'TO',
      Blockly.Ruby.ORDER_NONE) || '0';
  var increment = Blockly.Ruby.valueToCode(block, 'BY',
      Blockly.Ruby.ORDER_NONE) || null;
  var branch = Blockly.Ruby.statementToCode(block, 'DO') || '';
  if (Blockly.Ruby.INFINITE_LOOP_TRAP) {
    branch = Blockly.Ruby.INFINITE_LOOP_TRAP.replace(/%1/g,
        '"' + block.id + '"') + branch;
  }

  // Helper function
  var forLoop = function() {
    return Blockly.Ruby.provideFunction_(
        'for_loop',
        ['# loops though all numbers from +params[:from]+ to +params[:to]+ by the step',
         '# value +params[:by]+ and calls the given block passing the numbers',
         'def ' + Blockly.Ruby.FUNCTION_NAME_PLACEHOLDER_ + ' params',
         '',
         '  from = params[:from] #.to_f',
         '  to = params[:to] #.to_f',
         '  by = params[:by].abs #.to_f',
         '',
         '  from.step(to, (from > to) ? -1 * by : by) do |value|',
         '    yield value',
         '  end',
         '',
         'end']);
  };
  
  var generateForLoop = function(fromVal, toVal, increment) {
      return forLoop() + " from: (" + fromVal + "), "
                       + "to: (" + toVal + "), "
                       + "by: (" + increment + ")";
  };
  
  var code = '';
  var forLoop;

  if (Blockly.isNumber(fromVal) && Blockly.isNumber(toVal) &&
      (increment == null || Blockly.isNumber(increment))) {
    
    if (increment == null) increment = '1';
        
    // All parameters are simple numbers.
    fromVal = parseFloat(fromVal);
    toVal = parseFloat(toVal);
    increment = parseFloat(increment);
    
    forLoop = generateForLoop(fromVal, toVal, increment);
    
  } else {
    
    if (increment == null) {
      increment = '1';
    } else {
      increment = '(' + increment + ').to_f'
    }
    
    forLoop = generateForLoop(fromVal + '.to_f', toVal + '.to_f', increment);
  }
  
  Blockly.Ruby.variableDB_.popScope();
  
  code += forLoop + ' do |' + loopVar + '|\n' + branch + 'end\n';
  
  return code;
  
};

Blockly.Ruby['controls_forEach'] = function(block) {
  // For each loop.
  Blockly.Ruby.variableDB_.pushScope();

  var loopVar = Blockly.Ruby.variableDB_.addLocalVariable(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  var argument0 = Blockly.Ruby.valueToCode(block, 'LIST',
      Blockly.Ruby.ORDER_RELATIONAL) || '[]';
  var branch = Blockly.Ruby.statementToCode(block, 'DO') || 'end\n';
  if (Blockly.Ruby.INFINITE_LOOP_TRAP) {
    branch = Blockly.Ruby.INFINITE_LOOP_TRAP.replace(/%1/g,
        '"' + block.id + '"') + branch;
  }
  
  Blockly.Ruby.variableDB_.popScope();
  
  var code = argument0 + '.each do |' + loopVar + '|\n' + branch + 'end\n';
  return code;
};

Blockly.Ruby['controls_flow_statements'] = function(block) {
  // Flow statements: continue, break.
  switch (block.getFieldValue('FLOW')) {
    case 'BREAK':
      return 'break\n';
    case 'CONTINUE':
      return 'next\n';
  }
  throw 'Unknown flow statement.';
};
