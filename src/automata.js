var
  t = (tag, inner) => `<${tag}>${inner}</${tag}>`,
  r = {
    '\n': {
      '#?#?#?#?#?# ': [
        '\n',
        (args) => t('h' + (args[1].length-1), args[2])
      ],
      '===': [
        '\n',
        () => '<hr/>'
      ],
      '\n': [
        0,
        () => '<br/>'
      ]
    }
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
    f = [];
    s = r;
    m = (k, u) => {
      j = 0;
      while (k && (d = k[j++])) {
        i++;
        if(!u) {
          if (d == '?') {
            d = k[j++];
            d != string[i-1] && i--;
          } else if (d != string[i-1]) {
            return 1;
          }
        }
        else {
          while (string[i] && string[i-1] != d) {
            i++;
          }
          i--;
        }
      }
    };

    while (i < string.length) {
      e = i;
      for (k in s) {
        i = e;
        if (!m(k)) {
          f.push(string.substr(e,i-e));
          e = i;
          if (s[k].length !== undefined) {
            m(s[k][0], 1);
            f.push(string.substr(e,i-e));
            e = i;
            o += s[k][1](f);
            f = [];
            s = r;
            break;
          }
          else {
            s = s[k];
          }
        }
      }
      o += string.substr(e,i-e);
    }
    return o;
  };