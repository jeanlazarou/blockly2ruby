require 'csv'
require 'stringio'

class Numeric
  def ordinal
    "#{self}#{(10...20) === self ? 'th' : %w{ th st nd rd th th th th th th }[self % 10]}"
  end
end

class TestFile

  attr_reader :file_path
  attr_accessor :output, :error
  attr_accessor :at_lines, :expectations
  
  def initialize file_path
    
    @file_path = file_path
    
    load_expectations
    
    @output = StringIO.new
    
  end

  def run
  
    saved_output = $stdout

    $stdout = @output

    begin
      load @file_path
    rescue Exception => e
      @error = e
    ensure
      $stdout = saved_output
    end
    
  end
  
  def run_result
    @output.string
  end
  
  def expectation_message i
    @messages[i]
  end
  
  def error?
    !@error.nil?
  end

  def error_message
    
    return nil unless error?
    
    "#{@error.class}: #{@error}\n     #{@error.backtrace.join("\n     ")}"
    
  end
  
  def load_expectations
  
    @at_lines = []
    @messages = []
    @expectations = []
    
    line_nr = 0
    
    open(@file_path).each do |line|
    
      line.chomp!
      
      line_nr += 1
      
      if line =~ /# expects (.*)/
        
        value = $1
        
        if value =~ /^(\d+) times ("(.*)"|'(.*)')$/
        
          expect_repeated_value line_nr, value, $1.to_i, $3
          
          next
          
        elsif value =~ /^sequence (.*)$/
        
          expect_sequence line_nr, value, $1
          
          next
          
        elsif value =~ /random \[(.*)\]$/
          
          expect_random_from_list $1, line_nr
          
          next
          
        elsif value =~ /random range (.*)$/
          
          expect_random_number $1, line_nr
          
          next
          
        elsif value =~ /^-?\d+$/
          @messages << nil
          @expectations << value.to_i
        elsif value =~ /random :(\w+)$/
          @messages << value
          @expectations << random_validator($1)
        elsif value =~ /random ("(.*)"|'(.*)')$/
          @messages << value
          values = $3 ? $3 : $2
          @expectations << proc {|result| values.include?(result)}
        elsif value =~ /^"(.*)"$/ || value =~ /^'(.*)'$/
          @messages << nil
          @expectations << $1
        else
          @messages << nil
          @expectations << value
        end
        
        @at_lines << line_nr
        
      end
    
    end
    
  end
  
  def expect_repeated_value line_nr, raw_value, n, expected

    n.times do |i|
      @at_lines << line_nr
      @expectations << proc {|result| result == expected}
      @messages << raw_value + " (#{(i + 1).ordinal} time)"
    end
    
  end

  def expect_sequence line_nr, raw_value, sequence_string

    sequence = CSV.parse_line(sequence_string)
    
    sequence.each do |expected|
      @at_lines << line_nr
      @expectations << (expected =~ /^\d+$/ ? expected.to_i : expected)
      @messages << raw_value
    end
    
  end
    
  def expect_random_from_list csv_values, line_nr
  
    values = CSV.parse_line(csv_values)
    values.map! {|x| x =~ /\d/ ? x.to_i : x}
    
    @at_lines << line_nr
    @expectations << proc {|result| values.include?(result)}
    @messages << "random from #{csv_values}"
    
  end
  
  def expect_random_number range, line_nr
  
    range =~ /(\d+\.?\d*) \.\. (\d+\.?\d*)/
  
    from = $1
    to = $2
    
    from = from =~ /\./ ? from.to_f : from.to_i
    to = to =~ /\./ ? to.to_f : to.to_i
    
    @at_lines << line_nr
    @expectations << proc {|result| (from .. to).include?(result.to_f)}
    @messages << "random from #{from} to #{to}"
    
  end
  
  def random_validator name
  
    if name == 'colour'
      proc {|result| result =~ /^#[0-9a-z]{6}$/i}
    end
    
  end
  
end
