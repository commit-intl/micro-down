const microdown = function () {
  /*
   * tag helper
   */
  var t = (tag, text, values) => `<${tag + (values ? ' ' + Object.keys(values).map(k => `${k}="${e(values[k]) || ''}"`).join(' ') : '')}>${text}</${tag}>`,
    /**
     * outdent all rows by first as reference
     */
    o = (text) => {
      return text.replace(new RegExp('^' + (text.match(/^[^\s]?\s+/) || '')[0], 'gm'), '');
    },
    /**
     * encode double quotes and HTML tags to entities
     */
    e = (text) => {
      return text !== undefined ? text.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
    },
    /**
     * recursive list parser
     */
    l = (text, temp) => {
      temp = text.match(/^[+-]/m) ? 'ul' : 'ol';
      return text ?
        `<${temp}>${text.replace(/(?:[+-]|\d+\.) +(.*)\n?(([ \t].*\n?)*)/g, (match, a, b) => `<li>${inlineBlock(`${a}\n${o(b || '').replace(/(?:(^|\n)([+-]|\d+\.) +(.*(\n[ \t]+.*)*))+/g, l)}`)}</li>`)}</${temp}>`
        : '';
    },

    /**
     * function chain of replacements
     */
    m = (tag, regex, replacement, parser) => (match, a) => {
      match = match.replace(regex, replacement);
      return t(tag, parser ? parser(match) : match);
    },
    block = (text) => p(text, [
      // BLOCK STUFF ===============================

      // comments
      /<!--((.|\n)*?)-->/g,
      '<!--$1-->',

      // pre format block
      /^("""|```)(.*)(\n(.*\n)*?)\1/gm,
      (match, wrapper, c, text, tag) =>
        wrapper === '"""' ?
          t('div', parse(text), { class: c })
          : t('pre', e(text), { class: c }),

      // blockquotes
      /(^>.*\n?)+/gm,
      m('blockquote', /^> ?(.*)$/gm, '$1', inline),

      // tables
      /((^|\n)\|.+)+/g,
      m('table', /^.*(\n\|---.*?)?$/gm,
        (match, subline) =>
          m('tr', /\|(-?)([^|]+)\1(\|$)?/gm,
            (match, type, text) => t(type || subline ? 'th' : 'td', inlineBlock(text))
          )(match.slice(0, match.length - (subline || '').length))
      ),

      // lists
      /(?:(^|\n)([+-]|\d+\.) +(.*(\n[ \t]+.*)*))+/g,
      l,
      //anchor
      /#\[([^\]]+?)]/g,
      '<a name="$1"></a>',

      // headlines
      /^(#+) +(.*)(?:$)/gm,
      (match, h, text) => t('h' + h.length, inlineBlock(text)),

      // horizontal rule
      /^(===+|---+)(?=\s*$)/gm,
      '<hr>',
    ], parse),
    inlineBlock = (text) => {
      var temp = [],
        injectInlineBlock = (text) => text.replace(
          /\\(\d+)/g,
          (match, code) => injectInlineBlock(temp[Number.parseInt(code) - 1]),
        );

      text = text.trim()
      // inline code block
        .replace(
          /`([^`]*)`/g,
          (match, text) => '\\' + temp.push(t('code', e(text))),
        )
        // inline media (a / img / iframe)
        .replace(
          /[!&]?\[([!&]?\[.*?\)|[^\]]*?)]\((.*?)( .*?)?\)/g,
          (match, text, href, title) => {
            if (match[0] == '&') {
              text = text.match(/^(.+),(.+),([^ \]]+)( ?.+?)?$/);
              match = t('iframe', '', {
                width: text[1],
                height: text[2],
                frameborder: text[3],
                class: text[4],
                src: href,
                title,
              })
            }
            else {
              match = match[0] == '!'
                ? t('img', '', { src: href, alt: text, title })
                : t('a', inlineBlock(text), { href, title });
            }
            return '\\' + temp.push(match);
          },
        );

      console.log('inlineBlock', temp, text);

      text = injectInlineBlock(inline(text));
      console.log('inlineBlock', text);
      return text;
    },
    inline = (text) => p(text, [
      // bold, italic, bold & italic
      /([*_]{1,3})((.|\n)+?)\1/g,
      (match, k, text) => {
        k = k.length;
        text = inline(text);
        if (k > 1) text = t('strong', text);
        if (k % 2) text = t('em', text);
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
      // clean input
      text = text
        .replace(/[\r\v\b\f]/g, '')
        .replace(/\\./g, (match) => `&#${match.charCodeAt(1)};`);

      var temp = block(text);

      if (temp === text && !temp.match(/^[\s\n]*$/i)) {
        temp = inlineBlock(temp)
        // handle paragraphs
          .replace(/((.|\n)+?)(\n\n+|$)/g, (match, text) => t('p', text));
      }

      return temp.replace(/&#(\d+);/g, (match, code) => String.fromCharCode(parseInt(code)));
    }
  ;

  return { parse, block, inline, inlineBlock };
}();

if (typeof module !== 'undefined') {
  module.exports = microdown;
}
