const microdown = function () {
  /*
   * tag helper
   */
  var t = (tag, text, values) => `<${tag + (values ? ' ' + Object.keys(values).map(k => `${k}="${values[k]}"`) : '')}>${text}</${tag}>`,
    /**
     * outdent all rows by first as reference
     */
    o = (text) => {
      return text.replace(new RegExp('^' + (text.match(/^[^\s]?\s+/) || '')[0], 'gm'), '');
    },
    /**
     * recursive list parser
     */
    l = (text, temp) => {
      temp = text.match(/^[+-]/m) ? 'ul' : 'ol';
      return text ?
        `<${temp}>${text.replace(/(?:[+-]|\d+\.) +(.*)\n?((  .*\n?)*)/g, (match, a, b) => `<li>${inline(`${a}\n${o(b || '').replace(/(?:(^|\n)([+-]|\d+\.) +(.*(\n  +.*)*))+/g, l)}`)}</li>`)}</${temp}>`
        : '';
    },

    /**
     * function chain of replacements
     */
    m = (tag, regex, replacement) => (match, a) => t(tag, inline(match.replace(regex, replacement))),
    block = (text) => p(text, [
      // BLOCK STUFF ===============================

      // pre format block
      /^("""|```)(.*)(\n(.*\n)*?)\1/gm,
      (match, wrapper, c, text, tag) =>
        wrapper === '"""' ?
          t('div', parse(text), { class: c })
          : t('pre', text, { class: c }),

      // blockquotes
      /(^>.*\n?)+/gm,
      m('blockquote', /^> ?(.*)$/gm, '$1'),

      // tables
      /((^|\n)\|.+)+/g,
      m('table', /^.*$/gm,
        m('tr', /\|(-?)([^|]+)\1(\|$)?/gm,
          (match, type, text) => t(type ? 'th' : 'td', inline(text))
        )
      ),

      // lists
      /(?:(^|\n)([+-]|\d+\.) +(.*(\n  +.*)*))+/g,
      l,

      // headlines
      /^(#+) *(.*)(?:$)/gm,
      (match, h, text) => t('h' + h.length, inline(text)),

      // horizontal rule
      /^(===+|---+)(?=\s*$)/gm,
      '<hr>'
    ], parse),
    inline = (text) => p(text, [
      // INLINE STUFF ===============================

      // extrude pre format inline
      /`([^`]*)`/g,
      (match, text) => t('code', text),

      // image
      /\!\[(.*)\]\(([^\s]*)( (.*))?\)/g,
      '<img src="$2" alt="$1" title="$4"/>',

      // links
      /\[(.*)\]\(([^\s]*)( .*)?\)/g,
      (match, text, href, title) => t('a', inline(text), { href, title }),

      // bold, italic, bold & italic
      /([\*_]{1,3})((.|\n)+?)\1/g,
      (match, k, text) => {
        k = k.length;
        text = inline(text);
        if (k > 1) text = t('b', text);
        if (k % 2) text = t('i', text);
        return text;
      },

      // strike through
      /(~{1,3})((.|\n)+?)\1/g,
      (match, k, text) => t([, 'u', 's', 'del'][k.length], inline(text)),

      // replace remaining newlines with a <br>
      /  \n|\n  /g,
      '<br>',
    ], inline),
    p = (text, rules, parse) => {
      var i = 0, f;
      while (i < rules.length) {
        if (f = rules[i++].exec(text)) {
          return parse(text.slice(0, f.index))
            + (typeof rules[i] === 'string' ? rules[i].replace(/\$(\d)/g, (m, d) => f[d]) : rules[i].apply(this, f))
            + parse(text.slice(f.index + f[0].length));
        }
        i++;
      }
      return text;
    },
    parse = (text) => {
      text = text.replace(/[\r\v\b\f]/g, '');
      var temp = block(text);
      if (temp === text && !temp.match(/^[\s\n]*$/i)) {
        temp = temp.trim().replace(/((.|\n)+?)(\n\n+|$)/g, (match, text) => t('p', inline(text)));
      }
      return temp;
    }
  ;

  return { parse, inline }
}();

if (typeof module !== 'undefined') {
  module.exports = microdown;
}
