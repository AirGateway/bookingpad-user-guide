require 'date'
require 'time'
require 'rake'
require 'json'
require 'front_matter_parser'
require 'open3'

desc "Create corpus for search"
file './corpus.json' => ['./', *Rake::FileList['_bookingpad_docs/*.md', '_bookingpad_docs/*.markdown'].exclude()] do |md_file|
    unsafe_loader = ->(string) { YAML.load(string) }
    corpus = md_file.sources.grep(/\.md$/)
      .map do |path|
        file_path = './' + path
        parsed = FrontMatterParser::Parser.parse_file(file_path, loader: unsafe_loader)
        {
          id: path.pathmap('%n'),   # Here are the parameters I want to find in each doc
          name: parsed['title'],
          url: parsed['title'].downcase.strip.gsub(' ', '-'),
          content: parsed.content,
        }
      end
  File.open(md_file.name, 'w') do |f|
    f << JSON.generate(corpus)
  end
end

file './search_index.json' => ['./corpus.json'] do |t|
  Open3.popen2('script/build-index') do |stdin, stdout, wt|
    IO.copy_stream(t.source, stdin)
    stdin.close
    IO.copy_stream(stdout, t.name)
  end
end

task :default => ['./corpus.json', './search_index.json']