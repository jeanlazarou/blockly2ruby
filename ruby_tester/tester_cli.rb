require 'listen'
require 'optparse'

require_relative 'test_runner'

class Options

  attr_reader :output_dir
  attr_reader :input_dirs
  attr_reader :compiler_cmd
  attr_reader :filter_pattern
  
  def initialize args = ARGV
  
    @verbose = false
    @auto_mode = false
    @changed_only = false
    @force_compilation = false
    @filter_pattern = /test_.*.xml$/i
    
    prepare_parser
    
    begin
      
      rest = @parser.parse!(args)

      validate_options rest
      
    rescue OptionParser::ParseError => e
      
      startup_failure e.message.capitalize
      
    rescue RuntimeError => e
    
      startup_failure e.message
      
    end

  end

  def verbose?
    @verbose
  end

  def auto_mode?
    @auto_mode
  end

  def rerun_changed_only?
    @changed_only
  end
  
  def force_compilation?
    @force_compilation
  end
  
  def prepare_parser
  
    @parser = OptionParser.new do |opts|
      
      name = File.basename($0)
      
      opts.banner = "Usage: #{name} [options] xml-dir [xml-dir ...] output-dir"

      opts.separator ''
      opts.separator 'Compile Blockly XML files found in the given XML directories'
      opts.separator 'to Ruby files and run generated files as tests. Save'
      opts.separator 'compiled files to the given output directory.'
      opts.separator ''
      opts.separator 'Hit ctl-c once to force all files compilation (auto-mode only).'
      opts.separator ''
      opts.separator 'Examples:'
      opts.separator '  Compile and test all files in xml dir in vebose mode:'
      opts.separator '    ruby #{name} -c compile.sh xml/ /tmp/compiled -v'
      opts.separator '  Compile and test files starting with "test_var":'
      opts.separator '    ruby #{name} -c compile.sh xml/ /tmp/compiled -n test_var'
      opts.separator ''
      opts.separator 'Where options include:'
      
      opts.on('-a', '--autorun-mode', 
                    'compile all files, then observe the XML',
                    'directories for new, removed or changed',
                    'files to compile and re-run tests') do |fmt|
        @auto_mode = true
      end
      
      opts.on('-c', '--compiler command', 
                    'compiler command to compile XML files,',
                    'the command call must accept:',
                    '  command xml1 xml2 ... output-dir') do |cmd|
        @compiler_cmd = cmd
      end
      
      opts.on('-f', '--force-compilation', 
                    'force (re-)compilation') do
        @force_compilation = true
      end
      
      opts.on('-n', '--name-pattern pattern', 
                    'process the files matching the pattern,',
                    "defaults to #{@filter_pattern.inspect}") do |pattern|
        @filter_pattern = /#{pattern}/
      end
      
      opts.on('-r', '--rerun-changed', 
                    're-run only tests from changed files and',
                    'new files (in auto-mode) ', 
                    'if test succeeds re-run all tests.') do
        @changed_only = true
      end
      
      opts.on('-v', '--verbose', 'run in verbose mode') do
        @verbose = true
      end
      
      opts.on_tail('-h', '--help', 'display this message and exit') do
        puts opts
        exit
      end
      
    end

  end
  
  def validate_options rest

    startup_failure "Missing arguments" if rest.empty? || rest.size == 1
    
    @output_dir = rest.pop
    
    unless File.directory?(@output_dir)
      startup_failure "Invalid output directory #{@output_dir}"
    end
    
    @input_dirs = rest
    
    @input_dirs.each do |dir|
      unless File.directory?(dir)
        startup_failure "Invalid XML directory #{dir}"
      end
    end
    
    startup_failure "Missing compiler command" unless @compiler_cmd
    
    if !File.executable?(@compiler_cmd)
      startup_failure "Compiler command not found: '#{@compiler_cmd}'" 
    end
    
  end
  
  def startup_failure message
  
    $stderr.puts message
    $stderr.puts 
    $stderr.puts @parser
    
    exit 1
  
  end
  
end

options = Options.new
  
if options.verbose? && options.filter_pattern
  puts "Use filter: #{options.filter_pattern.inspect}"
end

runner = Runner.new(options)

runner.run

if options.auto_mode?
  
  listener = Listen.to(*options.input_dirs) do |modified, added, removed|
  
    if options.rerun_changed_only?
    
      args = ['-c', options.compiler_cmd]
      
      args << '-v' if options.verbose?
      
      args += options.input_dirs
      args << options.output_dir
      args << '-n'
      
      modified.each do |file|
      
        args << File.basename(file)
        
        one_file_runner = Runner.new(Options.new(args))
        one_file_runner.run
        
        args.pop
      
      end
      
    else
    
      runner.run
      
    end
    
  end
  
  listener.only options.filter_pattern
  listener.start

  stop_count = 0
  
  trap('INT') do
  
    if stop_count > 0
      
      puts
      puts "[1] Exit"
      puts "[2] Re-run all (default)"
      puts "[3] Force re-compile all"
      
      print "Your choice: "
      
      choice = $stdin.gets
      
      case choice.to_s.strip
      when "1"
        exit
      when "3"
        runner.force_compilation = true
        runner.run
        runner.force_compilation = false
      else
        runner.run
      end
      
    else

      stop_count += 1
    
      puts "\nHit ctl-c twice to bring menu..."
      
      runner.run

      Thread.new {
        sleep 1
        stop_count = 0
      }
      
    end

    
  end
  
  sleep
  
end
