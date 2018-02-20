var
  parse = (string) => {
    if (!string) return '';
    var
      i = e = 0, // INDEX
      f = [''], // ARGS
      o = '', // OUTPUT
      s = r, // STATE
      n, // NEXT ()
      k, // KEY
      m, // MATCH
      d; // DEFAULT FALLBACK

    string = '\n' + string;
    e = o = '';
    f = [''];
    s = r;

    n = (k) => {
      s = s[k] || r;
      console.log('new:', s);
      if (s.length !== undefined) {

        k = s[0] ? new RegExp(s[0] + '$') : {
          test: ((f) => {
            f = f.split('').reverse().join('');
            return (v) => !v.endsWith(f);
          })(f[0])
        };
        f[1] = string[i++];
        while (string[i] && k.test(f[1])) {
          f[1] += string[i++];
        }
        o += s[1](f);
        console.log('exec:', k, f);
        i += s[2] || 0;
        e = i;
      }
    };

    while (i < string.length) {
      e = i;
      for (k in s) {
        if (!k) {
          console.log('set default', k);
          d = k;
          continue;
        }
        m = new RegExp(k + '$');
        console.log([k, f[0] + string[i]]);
        if (m.test(f[0] + string[i])) {
          f[0] += string[i++];
          n(k);
          break;
        }
      }
      if (d !== undefined) {
        console.log('DEFAULT');
        n(d);
        d = undefined;
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
  },
  t = (tag, inner) => `<${tag}>${inner}</${tag}>`,
  c = (v, c) => v && v.substr(0, v.length - c),
  h = {
    ' ': [
      '[^\n]',
      (args) => t('h' + Math.min(args[0].length - 2, 6), args[1]),
      -1,
    ]
  },
  r = {
    '\n': {
      '#': h,
      '`': {
        '`': {
          '`': [
            0,
            (args) => t('pre', c(args[1], 3))
          ]
        }
      },
      '"': {
        '"': {
          '"': [
            0,
            (args) => t('div', c(args[1], 3))
          ]
        }
      },
      '[=-]': {
        '[=-]': [
          '[=-]',
          () => '<hr/>',
          -1
        ]
      },
      '\\+': {
        ' ': [
          '\n\n',
          (args) => t('ul', args[1].split('\n\+\s+').map(li => t('li', parse(li))).join(''))
        ]
      },
      '': [
        '[\s\n]',
        () => '<br/>',
        -1
      ]
    },
    '`': [
      0,
      (args) => t('code', c(args[1], 1))
    ],
    '[*_]': {
      '[*_]': {
        '[*_]': [
          0,
          (args) => t('b', t('i', parse(c(args[1], 3))))
        ],
        '': [
          0,
          (args) => t('b', parse(c(args[1], 2)))
        ],
      },
      '': [
        0,
        (args) => t('i', parse(c(args[1], 1)))
      ]
    }
  };

h['#'] = h;
