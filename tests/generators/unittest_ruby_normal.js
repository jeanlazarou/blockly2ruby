'use strict';

Blockly.Ruby['unittest_main'] = function(block) {
  // Container for unit tests.
  var resultsVar = Blockly.Ruby.variableDB_.getRubyName('unittest_results',
      Blockly.Variables.NAME_TYPE);
  var functionName = Blockly.Ruby.provideFunction_(
      'unittest_report',
      ['def ' + Blockly.Ruby.FUNCTION_NAME_PLACEHOLDER_,
       '  # Create test report.',
       '  report = []',
       '  summary = []',
       '  fails = 0',
       '  ' + resultsVar + '.each do |success, log, message|',
       '    if success',
       '      summary << "."',
       '    else',
       '      summary << "F"',
       '      fails += 1',
       '      report << ""',
       '      report << "FAIL: " + message',
       '      report << log',
       '    end',
       '  end',
       '  report.unshift summary.join',
       '  report << ""',
       '  report << "Number of tests run: %d" % ' + resultsVar + '.size',
       '  report << ""',
       '  if fails',
       '    report << "FAILED (failures=#{fails})"',
       '  else',
       '    report << "OK"',
       '  end',
       '  "\\n#{report.join(\"\\n\")}"',
       'end']);

  // Setup global to hold test results.
  var code = resultsVar + ' = []\n';
  // Run tests (unindented).
  code += Blockly.Ruby.statementToCode(block, 'DO')
      .replace(/^  /, '').replace(/\n  /g, '\n');
  var reportVar = Blockly.Ruby.variableDB_.getDistinctName(
      'report', Blockly.Variables.NAME_TYPE);
  code += reportVar + ' = ' + functionName + '\n';
  // Destroy results.
  code += resultsVar + ' = nil\n';
  // Print the report.
  code += 'puts ' + reportVar + '\n';
  return code;
};

Blockly.Ruby['unittest_main'].defineAssert_ = function() {
  var resultsVar = Blockly.Ruby.variableDB_.getRubyName('unittest_results',
      Blockly.Variables.NAME_TYPE);
  var functionName = Blockly.Ruby.provideFunction_(
      'assertEquals',
      ['def ' + Blockly.Ruby.FUNCTION_NAME_PLACEHOLDER_ +
          '(actual, expected, message)',
       '  # Asserts that a value equals another value.',
       '  raise "Orphaned assert equals: #{message}" if '
              + resultsVar + '.nil?',
       '  if actual == expected',
       '    ' + resultsVar + ' << [true, "OK", message]',
       '  else',
       '    ' + resultsVar + ' << [false, ' +
           '"Expected: %s\\nActual  : %s" % [expected, actual], message]',
       '  end',
        'end']);
  return functionName;
};

Blockly.Ruby['unittest_assertequals'] = function(block) {
  // Asserts that a value equals another value.
  var message = Blockly.Ruby.quote_(block.getFieldValue('MESSAGE'));
  var actual = Blockly.Ruby.valueToCode(block, 'ACTUAL',
      Blockly.Ruby.ORDER_NONE) || 'nil';
  var expected = Blockly.Ruby.valueToCode(block, 'EXPECTED',
      Blockly.Ruby.ORDER_NONE) || 'nil';
  return Blockly.Ruby['unittest_main'].defineAssert_() +
      '(' + actual + ', ' + expected + ', ' + message + ')\n';
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
  return Blockly.Ruby['unittest_main'].defineAssert_() +
      '(' + actual + ', ' + expected + ', ' + message + ')\n';
};

Blockly.Ruby['unittest_fail'] = function(block) {
  // Always assert an error.
  var resultsVar = Blockly.Ruby.variableDB_.getRubyName('unittest_results',
      Blockly.Variables.NAME_TYPE);
  var message = Blockly.Ruby.quote_(block.getFieldValue('MESSAGE'));
  var functionName = Blockly.Ruby.provideFunction_(
      'fail',
      ['def ' + Blockly.Ruby.FUNCTION_NAME_PLACEHOLDER_ + '(message)',
       '  # Always assert an error.',
       '  raise "Orphaned assert equals: #{message}" if '
              + resultsVar + '.nil?',
       '  ' + resultsVar + ' << [False, "Fail.", message]',
       'end']);
  return functionName + '(' + message + ')\n';
};
