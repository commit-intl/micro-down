/*
 * tag helper
 */
var t = (tag, content, values) => `<${tag + (values ? ' ' + Object.keys(values).map(k => `${k}="${values[k]}"`) : '')}>${content}</${tag}>`,
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
  m = (tag, regex, replacement) => (match, a) => t(tag, parse(match.replace(regex, replacement))),
  // REPLACEMENT RULES
  r = [
    // BLOCK STUFF ===============================

    // pre format block
    /^(["`]{3})(.*)(\n(.*\n)*?)\1/gm,
    (match, wrapper, c, content, tag) =>
      wrapper == '"""' ?
        t('div', parse(content), { class: c })
        : t('pre', content, { class: c }),


    // extrude pre format inline
    /`([^`]*)`/g,
    (match, text) => text,

    // blockquotes
    /(^>.*\n?)+/gm,
    m('blockquote', /^> ?(.*)$/gm, '$1'),

    // tables
    /((^|\n)\|.+)+/g,
    m('table', /^.*$/gm,
      m('tr', /\|(-?)([^|]+)\1(\|$)?/gm,
        (match, type, content) => t(type ? 'th' : 'td', parse(content))
      )
    ),

    // lists
    /(?:(^|\n)([+-]|\d+\.) *(.*(\n  +.*)*))+/g,
    l,

    // headlines
    /^(#+) *(.*)$/gm,
    (match, h, text) => t('h' + h.length, parse(text)),

    // headlines
    /^===+(?=\s*$)/gm,
    '<hr>',

    // INLINE STUFF ===============================
    // image
    /\!\[(.*)\]\(([^\s]*)( (.*))?\)/g,
    '<img src="$2" alt="$1" title="$4"/>',

    // links
    /\[(.*)\]\(([^\s]*)( .*)?\)/g,
    (match, text, href, title) => t('a', parse(text), { href, title }),

    // bold, italic, bold & italic
    /([\*_]{1,3})((.|\n)+?)\1/g,
    (match, k, text) => {
      k = k.length;
      text = parse(text);
      if (k > 1) text = `<b>${text}</b>`;
      if (k % 2) text = `<i>${text}</i>`;
      return text;
    },


    // replace remaining newlines with a <br>
    /(  |\n)\n+/g,
    '<br>',

    // inject classes
    // /(<[^>]+)>\s*\."([^"]*)"/g,
    // '$1 class="$2">',
  ],
  parse = (text) => {
    text = text.replace(/[\r\v\b\f]/g, '');
    var i = 0, f;

    while (i < r.length) {
      if (f = r[i++].exec(text)) {
        return parse(text.slice(0, f.index)) + x(r[i], f) + parse(text.slice(f.index + f[0].length));
      }
      i++;
    }
    return text;
  },
  x = (t, f) => typeof t == 'string' ? t.replace(/\$(\d)/g, (m, d) => f[d]) : t(...f)
;

module.exports = { rules: r, parse };