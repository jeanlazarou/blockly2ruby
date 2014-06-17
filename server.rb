require 'pathname'
require 'webrick'

include WEBrick

class Server

  def initialize port, document_root, verbose = false
    
    document_root = File.dirname(__FILE__) unless document_root
    document_root = Pathname.new(document_root)#.parent.parent

    if verbose
      options = {:Port => port}
    else
      options = {:Port => port, :AccessLog => []}
    end
    
    options[:DocumentRoot] = document_root.to_s
     
    puts "Root directory: #{options[:DocumentRoot]}"
    
    @server = HTTPServer.new(options)
    
  end
  
  def start
    @server.start
  end
  
  def shutdown
    @server.shutdown
  end

end

def startup_error port, message = nil
  
  $stderr.puts message if message
  
  $stderr.puts "Usage: #{$0} [port] [root-dir]"
  $stderr.puts "       port defaults #{port}"
  
  exit
  
end

root = nil
port = 80

if ARGV[0] =~ /\d+/
  port = ARGV[0].to_i
  root = ARGV[1] if ARGV.length == 2
elsif ARGV.length > 0
  root = ARGV[0]
end

if root
  startup_error(port, "Invalid root directory") unless File.directory?(root)
end
       
server = Server.new(port, root)

['TERM', 'INT'].each do |signal|
  trap(signal){ server.shutdown }
end

server.start
