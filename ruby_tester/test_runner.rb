require 'listen'
require 'optparse'

require_relative 'test_file'

class Runner

  attr_accessor :force_compilation
  
  def initialize options
  
    @verbose = options.verbose?
    @force_compilation = options.force_compilation?
    @filter_pattern = options.filter_pattern
    @compiler_cmd = options.compiler_cmd
    @output_dir = options.output_dir
    @input_dirs = options.input_dirs
    
  end

  def run
    
    compile_sources
    execute_tests
  
  end

  def verbose?
    @verbose
  end
  
  def force_compilation?
    @force_compilation
  end
  
  def compile_sources
    
    @test_files = []
    @compiled_files = []
    @xml_source_files = []
    
    select_files
    compile_selection
    register_test_files
    
  end
  
  def select_files
  
    @input_dirs.each do |dir|
    
      Dir[File.join(dir, "/*")].each do |src_file|
      
        puts "** skipping #{src_file}" if verbose? && !(src_file =~ @filter_pattern)
        
        next if File.directory?(src_file)
        next unless src_file =~ @filter_pattern
      
        @xml_source_files << src_file
        
      end
    
    end

    if @xml_source_files.empty?
      $stderr.puts "No files found."
      exit 2
    end

  end
  
  def compile_selection
  
    puts "Compiling files..." if verbose?
    
    @compiled_files = @xml_source_files.map do |file| 
      
      file = file.gsub(/\.xml/i, '.rb')
      
      #TODO compile to sub-paths? To what location?
      File.join(@output_dir, File.basename(file))
      
    end

    to_compile = filter_changed
    
    return if to_compile.empty?
    
    command = "#{File.expand_path(@compiler_cmd)} " +
              "#{to_compile.join(' ')} " +
              "#{@output_dir} #{verbose? ? '-v' : ''}"
    
    system command
    
  end
  
  def filter_changed
    
    to_compile = []
    
    @xml_source_files.each_with_index do |src, i|
    
      dest = @compiled_files[i]
      
      if !@force_compilation && File.file?(dest)
        to_compile << src if File.mtime(dest) < File.mtime(src)
      else
        to_compile << src
      end
      
    end
    
    to_compile
    
  end
  
  def register_test_files
  
    @compiled_files.each do |translated_file|
    
      test_file = TestFile.new(translated_file)
      
      @test_files << test_file
      
    end
    
    puts "Compiled #{@xml_source_files.size} file(s)" if verbose?
    
  end
  
  def execute_tests
    
    puts "Executing tests..." if verbose?
    
    tests_count = 0
    errors_count = 0
    failures_count = 0
    
    @test_files.each do |file|
    
      file.run

      tests_count += file.expectations.size
      
      has_errors = false
      
      error = proc do |message, is_error|
        
        puts "-------------------- #{file.file_path} failed" unless has_errors
        
        has_errors = true
        
        if is_error
          errors_count += 1
        else
          failures_count += 1
        end
        
        puts message
        
      end
      
      i = 0
      
      file.run_result.each_line do |line|
        
        line.chomp!
        
        line = line.to_i if line =~ /^-?\d+$/
        
        unless file.at_lines[i]
      
          error.call "Unexpected test leading to #{line.inspect}"
          
          break
          
        end
        
        if file.expectations[i].respond_to?(:call)
          
          if !file.expectations[i].call(line)
          
            error.call "Invalid result at line #{file.at_lines[i]}\n" +
                       "  expecting #{file.expectation_message(i)} \n" +
                       "    but was #{line.inspect}"
                 
          end
          
        elsif file.expectations[i] != line
        
          info = file.expectation_message(i)
          info = info ? " (#{info})" : ""
          
          error.call "Invalid result at line #{file.at_lines[i]}#{info}\n" +
                     "  expecting #{file.expectations[i].inspect} \n" +
                     "    but was #{line.inspect}"
               
        end
          
        i += 1
        
      end
      
      if file.error?
        
        error.call file.error_message, true
        
      elsif file.at_lines[i]
        
        count = file.at_lines.size - i
        plural = count == 1 ? '' : 's'
        
        msg = "Missing #{count} test#{plural} located at line#{plural} "
        msg << file.at_lines[i..-1].join(',')
        
        error.call msg
        
      end
      
      if !has_errors && verbose?
        puts "-------------------- #{file.file_path} succeeded"
      end
      
    end
    
    puts "#{Time.now} - #{tests_count} tests, #{failures_count} failures, #{errors_count} errors"
    
    puts "Done" if verbose?
    
  end
  
end
