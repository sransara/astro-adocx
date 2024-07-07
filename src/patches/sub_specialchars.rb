require 'asciidoctor' unless RUBY_PLATFORM == 'opal'

# https://github.com/asciidoctor/asciidoctor/blob/e070613f0932b18cfb64370a8f0b6a0831eee4cd/lib/asciidoctor/substitutors.rb
# Mixin for substitutors that need to escape special characters
# By default it doesn't escape braces { and } but for Astro code these also need to be escaped
# This is a patch to escape braces

module Asciidoctor::Substitutors
  SpecialCharsRx = /[<{&}>]/
  SpecialCharsTr = { '>' => '&gt;', '<' => '&lt;', '&' => '&amp;', '{' => '&lbrace;', '}' => '&rbrace;' }

  def sub_specialchars text
    (text.include? ?>) || (text.include? ?&) || (text.include? ?<) || (text.include? ?{ ) || (text.include? ?}) ? (text.gsub SpecialCharsRx, SpecialCharsTr) : text
  end
end
