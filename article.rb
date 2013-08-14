require 'date'

class Article
	DIR = 'articles/'
	EXT = '.markdown'
	
	attr_accessor :name, :attrs, :intro, :content, :images
	
	def initialize (name)
		@name = name.to_s
		load if exists?
	end
	
	def full_path
		File.expand_path(@name + EXT, DIR)
	end
	
	def exists?
		File.exists? full_path
	end
	
	def load
		lines = File.read(full_path).gsub(/\r\n?/, "\n").split(/\n/)
			
		skip_empty lines
	
		# Extracts the attributes, if any.
		@attrs = extract_attributes lines
		
		skip_empty lines
		
		# Extracts the intro and the content
		@intro = extract_intro(lines).join "\n"
		@content = lines.join "\n"
		
		# Does some pre-formatting on the article
		format_infos
		
		# Extracts images
		@images = list_images
		
		self
	end
	
	def random_image
		@images[rand @images.length]
	end
	
	def date
		return Date.parse @attrs[:date]
	end
	
	def self.list_names
		Dir.glob(DIR + '*' + EXT).map do |fname|
			File.basename fname, EXT
		end
	end
	
	def self.list
		list_names.map do |name|
			Article.new name
		end	.sort { |a, b| b.date <=> a.date }
	end
	
	private
	
	def skip_empty (lines)
		while lines.first.strip.empty?
			lines.shift
		end
	end
	
	def extract_attributes (lines)
		attrs = Hash.new
		
		while (mat = lines.first.match(/^([^:]+):(.+)$/)) != nil
			attrs[mat[1].strip.gsub(/\s+/, '_').downcase.to_sym] = mat[2].strip			
			lines.shift
		end
		
		attrs
	end
	
	def extract_intro (lines)
		intro = []
		while !lines.first.start_with? '#'
			intro << lines.shift
		end		
		
		intro
	end
	
	def format_infos
		mat = @content.match /##\s+Info\n(([^:\n]+:\s*.*\n)+)/i
		if mat != nil
			infos = mat[1]
			puts '*******'
			puts infos
			puts '*******'
			formatted = infos.split(/\n/).map do |s|
				part = s.split(/:/, 2)
				"<dt>#{part[0]}</dt><dd>#{part[1]}</dd>"
			end .join "\n"
			
			@content.gsub! infos, "<dl class=\"info\">#{formatted}</dl>\n"
		end
	end
	
	def list_images
		(@intro + "\n" + @content).scan(/"([^"]+\.png)/).map do |mat|
			mat.first
		end
	end
	
end
