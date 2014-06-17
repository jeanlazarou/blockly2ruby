'use strict';

goog.provide('Blockly.Ruby');

goog.require('Blockly.Generator');


Blockly.Ruby = new Blockly.Generator('Ruby');

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.Ruby.addReservedWords(
    'Class,Object,BEGIN,END,__ENCODING__,__END__,__FILE__,__LINE__' +
    'alias,and,begin,break,case,class,def,defined?,do,else,elsif,end,ensure,false,for,if,in,module,next' +
    'nil,not,or,redo,rescue,retry,return,self,super,then,true,undef,unless,until,when,while,yield');

/**
 * Order of operation ENUMs.
 * http://phrogz.net/programmingruby/language.html
 * http://www.techotopia.com/index.php/Ruby_Operator_Precedence
 * http://www.tutorialspoint.com/ruby/ruby_operators.htm
 */
Blockly.Ruby.ORDER_ATOMIC = 0;            // 0 "" ...
Blockly.Ruby.ORDER_MEMBER = 2;            // . []
Blockly.Ruby.ORDER_FUNCTION_CALL = 2;     // ()
Blockly.Ruby.ORDER_EXPONENTIATION = 3;    // **
Blockly.Ruby.ORDER_LOGICAL_NOT =  4;      // !
Blockly.Ruby.ORDER_UNARY_SIGN = 4;        // + -
Blockly.Ruby.ORDER_BITWISE_NOT = 4;       // ~
Blockly.Ruby.ORDER_MULTIPLICATIVE = 5;    // * / // %
Blockly.Ruby.ORDER_ADDITIVE = 6;          // + -
Blockly.Ruby.ORDER_BITWISE_SHIFT = 7;     // << >>
Blockly.Ruby.ORDER_BITWISE_AND = 8;       // &
Blockly.Ruby.ORDER_BITWISE_XOR = 9;       // ^
Blockly.Ruby.ORDER_BITWISE_OR = 9;        // |
Blockly.Ruby.ORDER_RELATIONAL = 11;       // <, <=, >, >=, <>, !=, ==
Blockly.Ruby.ORDER_LOGICAL_AND = 13;      // &&
Blockly.Ruby.ORDER_LOGICAL_OR = 14;       // ||
Blockly.Ruby.ORDER_CONDITIONAL = 15;      // if unless while until
Blockly.Ruby.ORDER_NONE = 99;             // (...)

/**
 * Arbitrary code to inject into locations that risk causing infinite loops.
 * Any instances of '%1' will be replaced by the block ID that failed.
 * E.g. '  checkTimeout(%1)\n'
 * @type ?string
 */
Blockly.Ruby.INFINITE_LOOP_TRAP = null;

/**
 * Initialise the database of variable names.
 */
Blockly.Ruby.init = function() {
  // Create a dictionary of definitions to be printed before the code.
  Blockly.Ruby.definitions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.Ruby.functionNames_ = Object.create(null);

  if (Blockly.Variables) {
    if (!Blockly.Ruby.variableDB_) {
      
      Blockly.Ruby.variableDB_ =
          new Blockly.Names(Blockly.Ruby.RESERVED_WORDS_);
          
      Blockly.Ruby.variableDB_.localVars = null;
      Blockly.Ruby.variableDB_.localVarsDB = null;
      
      Blockly.Ruby.variableDB_.getRubyName = function(name, type) {
        
        if (type == Blockly.Variables.NAME_TYPE) {
          
          var scope = this.localVars;
          
          while (scope != null) {
            
            if (name in scope) {
              return scope[name];
            }
            
            scope = scope.chain;
            
          }
          
          return "$" + this.getName(name, type);
          
        } else {
          return this.getName(name, type);
        }
        
      };
      
      Blockly.Ruby.variableDB_.pushScope = function() {
        var previousLV = this.localVars;
        var previousDB = this.localVarsDB;
        
        this.localVars = Object.create(null);
        this.localVarsDB = new Blockly.Names(Blockly.Ruby.RESERVED_WORDS_);
        
        this.localVars.chain = previousLV;
        this.localVarsDB.chain = previousDB;
      };
      
      Blockly.Ruby.variableDB_.addLocalVariable = function(name) {
        this.localVars[name] = this.localVarsDB.getName(name, Blockly.Variables.NAME_TYPE);
        return this.localVars[name];
      };
      
      Blockly.Ruby.variableDB_.popScope = function() {
        this.localVars = this.localVars.chain;
        this.localVarsDB = this.localVarsDB.chain;
      };
      
    } else {
      Blockly.Ruby.variableDB_.reset();
    }

    var defvars = [];
    var variables = Blockly.Variables.allVariables();
    for (var x = 0; x < variables.length; x++) {
      defvars[x] = '$' + 
         Blockly.Ruby.variableDB_.getName(variables[x], Blockly.Variables.NAME_TYPE) +
         ' = nil';
    }
    var code = defvars.join('\n');
    Blockly.Ruby.definitions_['variables'] = code;
  }
};

Blockly.Ruby.validName = function(name) {
  return this.variableDB_.safeName_(name);
}

/**
 * Returns the string containing all definitions
 * @return {string} Definitions code.
 */
Blockly.Ruby.generateDefinitions = function() {
  var definitions = [];
  for (var name in Blockly.Ruby.definitions_) {
    var def = Blockly.Ruby.definitions_[name];
    definitions.push(def);
  }
  return definitions;
}

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.Ruby.finish = function(code) {
  var definitions = Blockly.Ruby.generateDefinitions();
  
  // need some helper functions to conform to Blockly's behavior
  var i = 0;
  var helpers = [];
  helpers[i++] = "def blockly_puts x";
  helpers[i++] = "  if x.is_a?(Array)";
  helpers[i++] = "    puts x.join(',')";
  helpers[i++] = "  else";
  helpers[i++] = "    puts x";
  helpers[i++] = "  end";
  helpers[i++] = "end";
  
  helpers[i++] = "";
  
  helpers[i++] = "class Array";
  helpers[i++] = "  def find_first v";
  helpers[i++] = "    i = self.index(v)";
  helpers[i++] = "    i ? i + 1 : 0";
  helpers[i++] = "  end";
  helpers[i++] = "";  
  helpers[i++] = "  def find_last v";
  helpers[i++] = "    i = self.rindex(v)";
  helpers[i++] = "    i ? i + 1 : 0";
  helpers[i++] = "  end";
  helpers[i++] = "";
  helpers[i++] = "  def numbers";
  helpers[i++] = "    self.delete_if {|v| !v.is_a?(Numeric)}";
  helpers[i++] = "  end";
  helpers[i++] = "";
  helpers[i++] = "  def sum";
  helpers[i++] = "    self.numbers.inject(0) {|sum, v| sum + v}";
  helpers[i++] = "  end";
  helpers[i++] = "";
  helpers[i++] = "  def average";
  helpers[i++] = "    x = self.numbers";
  helpers[i++] = "    x.sum / x.size.to_f";
  helpers[i++] = "  end";
  helpers[i++] = "";
  helpers[i++] = "  def standard_deviation";
  helpers[i++] = "    x = self.numbers";
  helpers[i++] = "    return 0 if x.empty?";
  helpers[i++] = "    mean = x.average";
  helpers[i++] = "    variance = x.map {|v| (v - mean) ** 2}.sum / x.size";
  helpers[i++] = "    Math.sqrt(variance)";
  helpers[i++] = "  end";
  helpers[i++] = "";
  helpers[i++] = "  def median";
  helpers[i++] = "    x = self.numbers";
  helpers[i++] = "    x.sort!";
  helpers[i++] = "    index  = x.size / 2";
  helpers[i++] = "    x.size.odd? ? x[index] : ((x[index - 1] + x[index]) / 2.0)";
  helpers[i++] = "  end";
  helpers[i++] = "end";
  
  helpers[i++] = "";
  
  helpers[i++] = "class String";
  helpers[i++] = "  def find_first v";
  helpers[i++] = "    i = self.index(v)";
  helpers[i++] = "    i ? i + 1 : 0";
  helpers[i++] = "  end";
  helpers[i++] = "";  
  helpers[i++] = "  def find_last v";
  helpers[i++] = "    i = self.rindex(v)";
  helpers[i++] = "    i ? i + 1 : 0";
  helpers[i++] = "  end";
  helpers[i++] = "end";
  
  helpers[i++] = "";
  
  helpers[i++] = "class Float";
  helpers[i++] = "  def even?";
  helpers[i++] = "    false";
  helpers[i++] = "  end";
  helpers[i++] = "";  
  helpers[i++] = "  def odd?";
  helpers[i++] = "    false";
  helpers[i++] = "  end";
  helpers[i++] = "end";
  
  var allDefs = helpers.join('\n') + '\n\n' + definitions.join('\n\n');
  return allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n\n\n') + code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.Ruby.scrubNakedValue = function(line) {
  return line + '\n';
};

/**
 * Encode a string as a properly escaped Ruby string, complete with quotes.
 * @param {string} string Text to encode.
 * @return {string} Python string.
 * @private
 */
Blockly.Ruby.quote_ = function(string) {
  // TODO: This is a quick hack.  Replace with goog.string.quote
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/\%/g, '\\%')
                 .replace(/'/g, '\\\'');
  return '\'' + string + '\'';
};

/**
 * Common tasks for generating Ruby from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Ruby code created for this block.
 * @return {string} Ruby code with comments and subsequent blocks added.
 * @this {Blockly.CodeGenerator}
 * @private
 */
Blockly.Ruby.scrub_ = function(block, code) {
  if (code === null) {
    // Block has handled code generation itself.
    return '';
  }
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    if (comment) {
      commentCode += this.prefixLines(comment, '# ') + '\n';
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var x = 0; x < block.inputList.length; x++) {
      if (block.inputList[x].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[x].connection.targetBlock();
        if (childBlock) {
          var comment = this.allNestedComments(childBlock);
          if (comment) {
            commentCode += this.prefixLines(comment, '# ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = this.blockToCode(nextBlock);

  return commentCode + code + nextCode;
};
