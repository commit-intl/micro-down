var t = [];
var j = 0;


/**
 * outdent all rows by first as reference
 */
const o = function (text) {
  return text.replace(RegExp('^' + (text.match(/^\s+/) || '')[0], 'gm'), '');
};

/**
 * recursive list parser
 */
const l = function (text) {
  return text ?
    `<ul>${o(text).replace(/[\+\-](.*)\n?((  .*\n?)*)/g, function (match, a, b) {return `<li>${a + l(b)}</li>`;})}</ul>`
    : '';
};

const r = [

  // BLOCK STUFF ===============================
  // headlines
  /^(#+) *(.*)$/gm,
  function (match, h, text) {
    return `<h${h.length}>${text}</h${h.length}>`
  },

  // unordered lists
  /((^|\n)[\+\-](.*(\n  +.*)*))+/g,
  l,

  //pre format block
  /(^|\n)```((.|\n)*)\n```/g,
  "<pre>`$1`</pre>",

  // extrude pre format inline
  /`([^`]*)`/g,
  function (match, text) {
    t[++j] = text;
    return '`' + j + '`';
  },

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
  /(<[^>]+)>\."([^"]*)"/g,
  '$1 class="$2">',

  // inject pre format inline texts
  /`(\d+)`/g,
  function (match, number) {
    return t[number];
  },
];

const parse = function (text) {
  var i = 0;
  t = [];
  j = 0;
  while (i < r.length) {
    text = text.replace(r[i++], r[i++]);
  }
  return text;
};

module.exports = {rules: r, parse};