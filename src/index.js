
var t = [];
var j = 0;

const r = [
  // headlines
  /^(#+)\s*(.*)$/gm,
  function (match, h, text) {
    return `<h${h.length}>${text}</h${h.length}>`
  },

  // image
  /\!\[(.*)\]\(([^\s]*)(\s(.*))?\)/g,
  '<img src="$2" alt="$1" title="$4"/>',

  // links
  /\[(.*)\]\(([^\s]*)(\s(.*))?\)/g,
  '<a href="$2" title="$4">$1</a>',

  // unordered lists
  /^[\+\-]\s*(.*)$/gm,
  "<li>$1</li>",
  /((<li>.*<\/li>\n?)+)/g,
  "<ul>$1</ul>",

  //pre format block
  /(^|\n)```((.|\n)*)\n```/g,
  "<pre>`$1`</pre>",

  // extrude pre format inline
  /`([^`]*)`/g,
  function (match, text) {
    t[++j] = text;
    return '`'+j+'`';
  },

  // bold
  /(\*|_)\1([^\*|_]+)\1\1/g,
  "<b>$2</b>",

  // italic
  /(\*|_)([^\*|_]+)\1/g,
  "<i>$2</i>",

  // replace remaining newlines with a <br>
  /(\s\s|\n)\n+/g,
  "<br>",

  // inject classes
  /(<[^>]+)>\."([^"]*)"\s*/g,
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
  while (i < r.length){
    text = text.replace(r[i++],r[i++]);
  }
  return text;
};

module.exports = {rules: r, parse};