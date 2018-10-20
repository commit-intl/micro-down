const md = require('./index');

describe('md.parse()', () => {
  describe('inline formatting', () => {
    it('parses italics with *', () => {
      expect(md.inline('I *like* markdown')).toEqual('I <em>like</em> markdown');
    });

    it('parses italics with _', () => {
      expect(md.inline('I _like_ markdown')).toEqual('I <em>like</em> markdown');
    });

    it('parses bold with **', () => {
      expect(md.inline('I **like** markdown')).toEqual('I <strong>like</strong> markdown');
    });

    it('parses bold with __', () => {
      expect(md.inline('I __like__ markdown')).toEqual('I <strong>like</strong> markdown');
    });

    it('parses bold italics with ***', () => {
      expect(md.inline('I ***like*** markdown')).toEqual('I <em><strong>like</strong></em> markdown');
    });

    it('parses bold italics with ___', () => {
      expect(md.inline('I ___like___ markdown')).toEqual('I <em><strong>like</strong></em> markdown');
    });

    it('parses underline with ~', () => {
      expect(md.inline('I ~like~ markdown')).toEqual('I <u>like</u> markdown');
    });

    it('parses strike through with ~~', () => {
      expect(md.inline('I ~~like~~ markdown')).toEqual('I <s>like</s> markdown');
    });

    it('parses deletions with ~~~', () => {
      expect(md.inline('I ~~~like~~~ markdown')).toEqual('I <del>like</del> markdown');
    });

    it('should handle after line break "  \\n"', () => {
      expect(md.inline('I like  \nmarkdown')).toEqual('I like<br>markdown');
    });

    it('should handle pre line break "\\n  "', () => {
      expect(md.inline('I like\n  markdown')).toEqual('I like<br>markdown');
    });
  });

  describe('titles', () => {
    it('parses H1 titles', () => {
      expect(md.parse('# I like markdown')).toEqual('<h1>I like markdown</h1>');
    });

    it('parses H2 titles', () => {
      expect(md.parse('## I like markdown')).toEqual('<h2>I like markdown</h2>');
    });

    it('parses H3 titles', () => {
      expect(md.parse('### I like markdown')).toEqual('<h3>I like markdown</h3>');
    });

    it('parses H4 titles', () => {
      expect(md.parse('#### I like markdown')).toEqual('<h4>I like markdown</h4>');
    });

    it('parses H5 titles', () => {
      expect(md.parse('##### I like markdown')).toEqual('<h5>I like markdown</h5>');
    });

    it('parses H6 titles', () => {
      expect(md.parse('###### I like markdown')).toEqual('<h6>I like markdown</h6>');
    });
  });

  describe('links & images', () => {
    // here are some odd spaces in the result removing them adds some more bytes. IDK if it's worth it.
    it('parses links', () => {
      expect(
        md.inlineBlock('[markdown](https://de.wikipedia.org/wiki/Markdown And a Title)')
      ).toEqual(
        '<a href="https://de.wikipedia.org/wiki/Markdown" title=" And a Title">markdown</a>'
      );
    });

    it('auto format links', () => {
      expect(
        md.inlineBlock('https://en.wikipedia.org/wiki/Open_Financial_Exchange')
      ).toEqual(
        '<a href="https://en.wikipedia.org/wiki/Open_Financial_Exchange">https://en.wikipedia.org/wiki/Open_Financial_Exchange</a>'
      );
    });

    it('don\'t inline link content', () => {
      expect(
        md.inlineBlock('[https://en.wikipedia.org/wiki/Open_Financial_Exchange](https://en.wikipedia.org/wiki/Open_Financial_Exchange)')
      ).toEqual(
        '<a href="https://en.wikipedia.org/wiki/Open_Financial_Exchange" >https://en.wikipedia.org/wiki/Open_Financial_Exchange</a>'
      );
    });

    it('parses anchor links', () => {
      expect(md.inlineBlock('[Example](#example)')).toEqual('<a href="#example" >Example</a>');
    });

    it('parses images', () => {
      expect(md.inlineBlock('![title](foo.png)')).toEqual('<img src="foo.png" alt="title" ></img>');
      expect(md.inlineBlock('![](foo.png)')).toEqual('<img src="foo.png"  ></img>');
    });

    it('parses images within links', () => {
      expect(
        md.inlineBlock('[![](toc.png)](#toc)')
      ).toEqual(
        '<a href="#toc" ><img src="toc.png"  ></img></a>'
      );
      expect(
        md.inlineBlock('[![a](a.png)](#a) [![b](b.png)](#b)')
      ).toEqual(
        '<a href="#a" ><img src="a.png" alt="a" ></img></a> <a href="#b" ><img src="b.png" alt="b" ></img></a>'
      );
    });
  });
  
  describe('lists', () => {
    it('parses an unordered list with *', () => {
      expect(md.parse('* One\n* Two')).toEqual('<ul><li>One</li><li>Two</li></ul>');
    });
  
    it('parses an unordered list with -', () => {
      expect(md.parse('- One\n- Two')).toEqual('<ul><li>One</li><li>Two</li></ul>');
    });
  
    it('parses an unordered list with +', () => {
      expect(md.parse('+ One\n+ Two')).toEqual('<ul><li>One</li><li>Two</li></ul>');
    });
  
    it('parses an unordered list with mixed bullet point styles', () => {
      expect(md.parse('+ One\n* Two\n- Three')).toEqual('<ul><li>One</li><li>Two</li><li>Three</li></ul>');
    });
  
    it('parses an ordered list', () => {
      expect(md.parse('1. Ordered\n2. Lists\n4. Numbers are ignored')).toEqual('<ol><li>Ordered</li><li>Lists</li><li>Numbers are ignored</li></ol>');
    });
  });
  
  describe('line breaks', () => {
    it('parses two new lines as line breaks', () => {
      expect(md.parse('Something with\n\na line break')).toEqual('<p>Something with<br>a line break</p>');
    });
  
    it('parses two spaces as a line break', () => {
      expect(md.parse('Something with  \na line break')).toEqual('<p>Something with<br>a line break</p>');
    });
  });

  // describe('code & quotes', () => {
  //   it('parses inline code', () => {
  //     expect(md.parse('Here is some code `var a = 1`.')).toEqual('Here is some code <code>var a = 1</code>.');
  //   });
  //
  //   it('escapes inline code', () => {
  //     expect(md.parse('a `<">` b')).toEqual('a <code>&lt;&quot;&gt;</code> b');
  //   });
  //
  //   it('parses three backtricks (```) as a code block', () => {
  //     expect(md.parse('```\nfunction codeBlocks() {\n\treturn "Can be inserted";\n}\n```')).toEqual('<pre class="code ">function codeBlocks() {\n\treturn &quot;Can be inserted&quot;;\n}</pre>');
  //
  //     expect(md.parse('```js\nfunction codeBlocks() {\n\treturn "Can be inserted";\n}\n```')).toEqual('<pre class="code js">function codeBlocks() {\n\treturn &quot;Can be inserted&quot;;\n}</pre>');
  //   });
  //
  //   it('parses tabs as a code poetry block', () => {
  //     expect(md.parse('\tvar a = 1')).toEqual('<pre class="code poetry">var a = 1</pre>');
  //   });
  //
  //   it('escapes code/quote blocks', () => {
  //     expect(md.parse('```\n<foo>\n```')).toEqual('<pre class="code ">&lt;foo&gt;</pre>');
  //     expect(md.parse('\t<foo>')).toEqual('<pre class="code poetry">&lt;foo&gt;</pre>');
  //   });
  //
  //   it('parses a block quote', () => {
  //     expect(md.parse('> To be or not to be')).toEqual('<blockquote>To be or not to be</blockquote>');
  //   });
  //
  //   it('parses lists within block quotes', () => {
  //     expect(md.parse('> - one\n> - two\n> - **three**\nhello')).toEqual('<blockquote><ul><li>one</li><li>two</li><li><strong>three</strong></li></ul></blockquote>\nhello');
  //   });
  // });
  
  describe('horizontal rules', () => {
    it('should parse ---', () => {
      expect(md.parse('foo\n\n---\nbar')).toEqual('<p>foo</p><hr><p>bar</p>');
      expect(md.parse('foo\n\n----\nbar')).toEqual('<p>foo</p><hr><p>bar</p>');
      expect(md.parse('> foo\n---\nbar')).toEqual('<blockquote>foo</blockquote><hr><p>bar</p>');
    });
  
    it('should parse * * *', () => {
      expect(md.parse('foo\n\n* * *\nbar')).toEqual('<p>foo</p><hr><p>bar</p>');
      expect(md.parse('foo\n\n* * * *\nbar')).toEqual('<p>foo</p><hr><p>bar</p>');
      expect(md.parse('> foo\n* * *\nbar')).toEqual('<blockquote>foo</blockquote><hr><p>bar</p>');
    });
  });

  // describe('edge cases', () => {
  //   it('should close unclosed tags', () => {
  //     expect(md.parse('*foo')).toEqual('<em>foo</em>');
  //     expect(md.parse('foo**')).toEqual('foo<strong></strong>');
  //     expect(md.parse('[some **bold text](#winning)')).toEqual('<a href="#winning">some <strong>bold text</strong></a>');
  //     expect(md.parse('`foo')).toEqual('`foo');
  //   });
  //
  //   it('should not choke on single characters', () => {
  //     expect(md.parse('*')).toEqual('<em></em>');
  //     expect(md.parse('_')).toEqual('<em></em>');
  //     expect(md.parse('**')).toEqual('<strong></strong>');
  //     expect(md.parse('>')).toEqual('>');
  //     expect(md.parse('`')).toEqual('`');
  //   });
  // });
});