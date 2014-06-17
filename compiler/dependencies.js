phantom.injectJs(window.CLOSURE_LIB_DIR + '/base.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/object/object.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/reflect/reflect.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/disposable/idisposable.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/disposable/disposable.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/string/string.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/string/stringbuffer.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/debug/error.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/asserts/asserts.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/array/array.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/iter/iter.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/structs/structs.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/structs/collection.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/structs/map.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/structs/set.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/structs/trie.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/useragent/useragent.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/debug/entrypointregistry.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/debug/errorhandlerweakdep.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/debug/debug.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/debug/logrecord.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/debug/logbuffer.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/debug/logger.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/events/event.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/events/eventtype.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/events/browserfeature.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/events/browserevent.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/events/listenable.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/events/listener.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/events/eventwrapper.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/events/events.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/events/eventtarget.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/events/keycodes.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/events/eventhandler.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/events/keyhandler.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/events/focushandler.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/timer/timer.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/color/names.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/math/math.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/math/coordinate.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/math/size.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/math/box.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/math/rect.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/color/color.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/dom/browserfeature.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/dom/tagname.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/dom/classes.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/dom/dom.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/dom/tagiterator.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/dom/nodeiterator.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/dom/vendor.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/style/style.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/a11y/aria/roles.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/a11y/aria/attributes.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/a11y/aria/aria.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/ui/idgenerator.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/ui/component.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/ui/controlcontent.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/ui/controlrenderer.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/ui/registry.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/ui/decorate.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/ui/control.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/ui/paletterenderer.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/ui/selectionmodel.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/ui/palette.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/ui/colorpalette.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/ui/colorpicker.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/ui/tree/basenode.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/ui/tree/treenode.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/ui/tree/typeahead.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/ui/tree/treecontrol.js');
phantom.injectJs(window.CLOSURE_LIB_DIR + '/cssom/cssom.js');

window.BLOCKLY_BOOT = function() {
  // Execute after Closure has loaded.
  if (!window.goog) {
    alert('Error: Closure not found.  Read this:\n' +
          'http://code.google.com/p/blockly/wiki/Closure\n');
  }

  // Build map of all dependencies (used and unused).
  //goog.addDependency("./core/block.js", ['Blockly.Block'], ['Blockly.Blocks', 'Blockly.Xml', 'goog.asserts', 'goog.string']);
  //goog.addDependency("./core/blockly.js", ['Blockly'], ['Blockly.Block', 'Blockly.Generator', 'Blockly.Procedures', 'Blockly.utils', 'goog.string']);
  goog.addDependency("./core/blocks.js", ['Blockly.Blocks'], ['goog.asserts']);
  goog.addDependency("./core/generator.js", ['Blockly.Generator'], ['Blockly.Block']);
  goog.addDependency("./core/names.js", ['Blockly.Names'], []);
  goog.addDependency("./core/procedures.js", ['Blockly.Procedures'], ['Blockly.Names']);
  goog.addDependency("./core/utils.js", ['Blockly.utils'], []);
  goog.addDependency("./core/variables.js", ['Blockly.Variables'], []);
  goog.addDependency("./core/xml.js", ['Blockly.Xml'], []);
  goog.addDependency("./core/workspace.js", ['Blockly.Workspace'], ['Blockly.Xml']);

  // Load Blockly.
  //goog.require('Blockly');
  //goog.require('Blockly.Block');
  goog.require('Blockly.Blocks');
  goog.require('Blockly.Generator');
  goog.require('Blockly.Names');
  goog.require('Blockly.Procedures');
  goog.require('Blockly.Variables');
  goog.require('Blockly.Xml');
  goog.require('Blockly.utils');
  goog.require('Blockly.Workspace');

  delete window.BLOCKLY_DIR;
  delete window.BLOCKLY_BOOT;
};

goog.ENABLE_DEBUG_LOADER = false;

require(window.BLOCKLY_DIR + '/apps/_soy/soyutils.js');
require(window.BLOCKLY_DIR + '/apps/common.js');
require(window.BLOCKLY_DIR + '/appengine/storage.js');

require(window.BLOCKLY_DIR + "/core/block_svg.js");
require(window.BLOCKLY_DIR + "/core/blocks.js");
require(window.BLOCKLY_DIR + "/core/icon.js");
require(window.BLOCKLY_DIR + "/core/xml.js");
require(window.BLOCKLY_DIR + "/core/scrollbar.js");
require(window.BLOCKLY_DIR + "/core/trashcan.js");
require(window.BLOCKLY_DIR + "/core/workspace.js");
require(window.BLOCKLY_DIR + "/core/bubble.js");
require(window.BLOCKLY_DIR + "/core/comment.js");
require(window.BLOCKLY_DIR + "/core/connection.js");
require(window.BLOCKLY_DIR + "/core/contextmenu.js");
require(window.BLOCKLY_DIR + "/core/field.js");
require(window.BLOCKLY_DIR + "/core/tooltip.js");
require(window.BLOCKLY_DIR + "/core/field_label.js");
require(window.BLOCKLY_DIR + "/core/input.js");
require(window.BLOCKLY_DIR + "/core/msg.js");
require(window.BLOCKLY_DIR + "/core/mutator.js");
require(window.BLOCKLY_DIR + "/core/warning.js");
require(window.BLOCKLY_DIR + "/core/block.js");
require(window.BLOCKLY_DIR + "/core/flyout.js");
require(window.BLOCKLY_DIR + "/core/toolbox.js");
require(window.BLOCKLY_DIR + "/core/variables.js");
require(window.BLOCKLY_DIR + "/core/field_textinput.js");
require(window.BLOCKLY_DIR + "/core/field_angle.js");
require(window.BLOCKLY_DIR + "/core/field_checkbox.js");
require(window.BLOCKLY_DIR + "/core/field_colour.js");
require(window.BLOCKLY_DIR + "/core/field_dropdown.js");
require(window.BLOCKLY_DIR + "/core/field_image.js");
require(window.BLOCKLY_DIR + "/core/field_variable.js");
require(window.BLOCKLY_DIR + "/core/generator.js");
require(window.BLOCKLY_DIR + "/core/names.js");
require(window.BLOCKLY_DIR + "/core/procedures.js");
require(window.BLOCKLY_DIR + "/core/css.js");
require(window.BLOCKLY_DIR + "/core/widgetdiv.js");
require(window.BLOCKLY_DIR + "/core/inject.js");
require(window.BLOCKLY_DIR + "/core/utils.js");
require(window.BLOCKLY_DIR + "/core/blockly.js");
require(window.BLOCKLY_DIR + "/core/utils.js");

require(window.BLOCKLY_DIR + '/generators/ruby.js');
require(window.BLOCKLY_DIR + "/generators/ruby/logic.js");
require(window.BLOCKLY_DIR + "/generators/ruby/loops.js");
require(window.BLOCKLY_DIR + "/generators/ruby/math.js");
require(window.BLOCKLY_DIR + "/generators/ruby/text.js");
require(window.BLOCKLY_DIR + "/generators/ruby/lists.js");
require(window.BLOCKLY_DIR + "/generators/ruby/colour.js");
require(window.BLOCKLY_DIR + "/generators/ruby/variables.js");
require(window.BLOCKLY_DIR + "/generators/ruby/procedures.js");

require(window.BLOCKLY_DIR + "/blocks/logic.js");
require(window.BLOCKLY_DIR + "/blocks/loops.js");
require(window.BLOCKLY_DIR + "/blocks/math.js");
require(window.BLOCKLY_DIR + "/blocks/text.js");
require(window.BLOCKLY_DIR + "/blocks/lists.js");
require(window.BLOCKLY_DIR + "/blocks/colour.js");
require(window.BLOCKLY_DIR + "/blocks/variables.js");
require(window.BLOCKLY_DIR + "/blocks/procedures.js");

require(window.BLOCKLY_DIR + "/msg/messages.js");

require(window.BLOCKLY_DIR + '/tests/generators/unittest.js');
require(window.BLOCKLY_DIR + '/tests/generators/unittest_ruby.js');
