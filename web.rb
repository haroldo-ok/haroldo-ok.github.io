require 'sinatra'
require_relative 'article'

get '/:name/' do
	article = Article.new params[:name]
	erb :article, :locals => article.attrs do
		markdown article.intro + "\n" + article.content
	end
end

get '/:name/*' do
	send_file File.expand_path(params[:splat].first, 'articles/')
end

get '/' do
	erb :main, :locals => {:title => 'Main page', :articles => Article.list}
end