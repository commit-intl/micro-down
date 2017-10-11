var t,
  /**
   * outdent all rows by first as reference
   */
  o = (text) => {
    return text.replace(RegExp('^' + (text.match(/^[^\s]?\s+/) || '')[0], 'gm'), '');
  },
  /**
   * recursive list parser
   */
  l = (text, temp) => {
    temp = text.match(/\n?[+-]/m) ? 'ul' : 'ol';
    return text ?
      `<${temp}>${text.replace(/(?:[+-]|\d+\.) ?(.*)\n?((  .*\n?)*)/g, (match, a, b) => `<li>${a}\n${o(b || '').replace(/(?:(^|\n)([+-]|\d+\.) *(.*(\n  +.*)*))+/g, l)}</li>`)}</${temp}>`
      : '';
  },

  /**
   * function chain of replacements
   */
  m = (tag, regex, replacement) => (match, a) => `<${tag}>\n${match.replace(regex, replacement)}\n</${tag}>`,
  // REPLACEMENT RULES
  r = [

    // PREVENT ERRORS ============================
    /[\r\v\b\f]/g,
    '',

    // BLOCK STUFF ===============================

    // pre format block
    /^(["`]{3})(.*)(\n(.*\n)*?)\1/gm,
    (match, wrapper, c, content, tag) => {
      tag = 'div';
      if (wrapper == '```') {
        tag = 'pre';
        content = '`' + content + '`';
      }
      return `<${tag} class="${c}">${content}</${tag}>`;
    },

    // extrude pre format inline
    /`([^`]*)`/g,
    (match, text) => text,

    // blockquotes
    /(^>.*\n?)+/gm,
    m('blockquote', /^> ?(.*)$/gm, '$1'),

    // tables
    /((^|\n)\|.*)+/g,
    m('table', /^.*$/gm, m('tr', /\|([^|]*)/g, '<td>$1</td>')),

    // lists
    /(?:(^|\n)([+-]|\d+\.) *(.*(\n  +.*)*))+/g,
    l,

    // headlines
    /^(#+) *(.*)$/gm,
    (match, h, text) => `<h${h.length}>${text}</h${h.length}>`,

    // headlines
    /^===+(?=\s*$)/gm,
    '<hr>',

    // INLINE STUFF ===============================
    // image
    /\!\[(.*)\]\(([^\s]*)( (.*))?\)/g,
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
    /(<[^>]+)>\s*\."([^"]*)"/g,
    '$1 class="$2">',

    // inject pre format inline texts
    /`(\d+)`/g,
    (match, number) => t[number],
  ],
  parse = (text) => {
    var i = 0, f;
    t = [];

    while (i < r.length) {
      if(f = r[i++].exec(text)) {
        return parse(text.slice(0, f.index)) + x(r[i],f) + parse(text.slice(f.index + f[0].length));
      }
      i++;
    }
    return text;
  },
  x = (t, f) => typeof t == 'string' ? t.replace(/\$(\d)/g, (m,d) => f[d]) : t(...f)
;

module.exports = { rules: r, parse };