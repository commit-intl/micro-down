var t = [],
  j = 0,
  i,
  /**
   * outdent all rows by first as reference
   */
  o = (text) => {
    return text.replace(RegExp('^' + (text.match(/^\s+/) || '')[0], 'gm'), '');
  },
  /**
   * recursive list parser
   */
  l = (text,temp) => {
    temp = text.match(/\n?[+-]/m) ? 'ul' : 'ol';
    return text ?
      `<${temp}>${o(text).replace(/(?:[+-]|\d+\.)(.*)\n?((  .*\n?)*)/g, (match, a, b) => `<li>${a + l(b)}</li>`)}</${temp}>`
      : '';
  },
  // REPLACEMENT RULES
  r = [

    // BLOCK STUFF ===============================

    //pre format block
    /(^|\n)```((.|\n)*)\n```/g,
    "<pre>`$1`</pre>",

    // headlines
    /^(#+) *(.*)$/gm,
    (match, h, text) => `<h${h.length}>${text}</h${h.length}>`,

    // unordered lists
    /(?:(^|\n)([+-]|\d+\.)(.*(\n  +.*)*))+/g,
    l,

    // extrude pre format inline
    /`([^`]*)`/g,
    (match, text) => {
      t[++j] = text;
      return '`' + j + '`';
    },

    // INLINE STUFF ===============================
    // image
    /(\!)?\[(.*)\]\(([^\s]*)( (.*))?\)/g,
    '<img src="$2" alt="$1" title="$4"/>',

    // links
    /\[(.*)\]\(([^\s]*)( (.*))?\)/g,
    '<a href="$2" title="$4">$1</a>',

    // bold
    /(\*|_)\1([^\*|_]+)\1\1/g,
    "<b>$2</b>",

    // italic
    /(\*|_)([^\*|_]+)\1/g,
    "<i>$2</i>",

    // replace remaining newlines with a <br>
    /(  |\n)\n+/g,
    "<br>",

    // inject classes
    /(<[^>]+)>\."([^"]*)"/g,
    '$1 class="$2">',

    // inject pre format inline texts
    /`(\d+)`/g,
    (match, number) => t[number],
  ],
  parse = (text) => {
    i = 0;
    t = [];
    j = 0;
    while (i < r.length) {
      text = text.replace(r[i++], r[i++]);
    }
    return text;
  };

module.exports = {rules: r, parse};