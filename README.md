blockly2ruby
============

The Blockly project from https://code.google.com/p/blockly/ is a visual programming language aiming to be easy for beginners to learn programming...

The programming environment runs in the browser, it saves the _program_ in an XML format, compile (or generates) to Javascript, Dart, Python.... it uses so called generators to make the translation.

_blockly2ruby_ implements generators for the Ruby programming language.

I wrote the code and tested in a version of April 2014. I do not plan to maintain the code anymore.

One problem I faced is that the generated code tries to produce the same result as Blockly while the philosophy is that the produced code should be easy to read and follow the target language aspects... contradictory somehow.

Code
----

The code contains next parts (folders):

  * generators: the Javscript scripts generating Ruby
  * test: tests to validate the generators and Javascript scripts generating _Blockly unit tests_
  * ruby_tester: Ruby code that run the generated tests
  * compiler: Javascript scirpts that allow to compile from XML to Ruby from command line (using http://phantomjs.org/)
  * compiler.sh; shell script runnning the Javscript compiler from the command line
  * server.rb: a Ruby script that runs a server to run Blocky on a local box

Next sections give more information about the different parts.

### generators

The generators where based on the Python generators, they are compatible with the April's version. I wrote two version of the generators because they changed during several months, as I do not intend working on this code anymore do not expect to make it work with recent version of Blocky.

### ruby_tester

The idea I had when I wrote the generators was to write test cases in _pure_ Blockly with comments containing the expected output. The generated code is used by the ruby_tester scripts to validate the generated code.

Example of generated code:

```ruby
# expects '#ff0000'
blockly_puts('#ff0000')
```

*ruby_tester* detects the special comment (*# expects *) and tests that the line ``blockly_puts('#ff0000')`` produces the expected results.

Other special comments include:

* ``# expects true``, boolean expectation
* ``# expects 1``, number expectation
* ``# expects "hello"``, string expectation
* ``# expects sequence "a","b","c"``, sequence expecation
* ``# expects 3 times "repeat"``, expecting repeated n times

### test

The Javascript for the _Blocky unit tests_ generator come in two flavours:

* unittest_ruby_normal.js: producing code being a straight mapping from _Blockly_ logic to Ruby code
* unittest_ruby_unit.js: producing code integrating with Ruby's unit test framework

The actual generator script is ``unittest_ruby.js`` and is a symbolic link to one of the above scripts.

Two shell scripts create the symbolic links to enable one of them (``set_normal`` and ``set_unit``).

The Blockly unit-tests locate in its ``tests/generator`` directory, change the ``index.html`` file to enable Ruby generators. Add next lines:

```html
<script type="text/javascript" src="unittest_ruby.js"></script>
<script type="text/javascript" src="../../generators/ruby/logic.js"></script>
<script type="text/javascript" src="../../generators/ruby/loops.js"></script>
<script type="text/javascript" src="../../generators/ruby/math.js"></script>
<script type="text/javascript" src="../../generators/ruby/text.js"></script>
<script type="text/javascript" src="../../generators/ruby/lists.js"></script>
<script type="text/javascript" src="../../generators/ruby/colour.js"></script>
<script type="text/javascript" src="../../generators/ruby/variables.js"></script>
<script type="text/javascript" src="../../generators/ruby/procedures.js"></script>
```

And copy the Ruby generators files in the &lt;blockly-root&gt;/generators/ruby

- Jean Lazarou
