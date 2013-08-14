require 'sinatra'
require_relative 'article'

get '/:name/' do
	article = Article.new params[:name]
	attrs = article.attrs.clone;
	attrs[:intro] = markdown article.intro
	attrs[:content] = markdown article.content
	attrs[:random_articles] = Article.list.sample 4
	erb :article, :locals => attrs
end

get '/:name/*' do
	send_file File.expand_path(params[:splat].first, 'articles/')
end

get '/' do
	erb :main, :locals => {:title => 'Main page', :articles => Article.list}
end