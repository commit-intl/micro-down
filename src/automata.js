var
  t = (tag, inner) => `<${tag}>${inner}</${tag}>`,
  h = {
    ' ': [
      '[^\n]',
      (args) => t('h' + Math.min(args[0].length - 2, 6), args[1])
    ]
  },
  hr = {
    '\=': [
      '\=',
      () => '<hr/>'
    ]
  },
  block = {
    '#': h,
    '\=': hr,
  },
  r = {
    '\n': block,
  },
  i, // INDEX
  j, // 2nd INDEX
  c, // CHAR
  d, // 2nd CHAR
  e, // SUBSTR
  f, // ARGS
  s, // STATE
  n, // NEXT ()
  k, // KEY
  o, // OUTPUT
  m, // MATCH
  parse = (string) => {
    string = '\n' + string;
    i = 0;
    e = o = '';
    f = [''];
    s = r;

    while (i < string.length) {
      e = i;
      for (k in s) {
        m = new RegExp(k);
        console.log([k, f[0] + string[i]]);
        if (m.test(string[i])) {
          s = s[k] || r;
          f[0] += string[i++];
          console.log('new:', s);
          if (s.length !== undefined) {
            n = new RegExp(s[0]);
            while (n.test(string[i++])) {
            }
            f[1] = string.substr(e, --i - e);
            o += s[1](f);
            console.log('exec:', f);
            e = i;
          }
          break;
        }
      }
      if (s === r) {
          console.log('step:', string[i]);
          o += string[i++];
          f = [''];
      }
      if (e == i) {
        s = r;
        f = [''];
      }
    }
    return o;
  };

h['#'] = h;
