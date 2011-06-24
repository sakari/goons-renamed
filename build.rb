#!/usr/bin/env ruby

def preprocess(file)
  open(file, "r") do |fh|
    while !(line = fh.gets).nil?
      if (m = line.match('([^#]*)//##(.*)'))
        print "//INCLUDED #{line}"
        print m[1]
        preprocess(m[2])
      else
        print line
      end
    end
  end
end

root = ARGV[0]
preprocess(root)
