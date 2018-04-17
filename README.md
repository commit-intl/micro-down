# micro-down

JavaScript based Markdown parser with no dependencies.

**1.05kB** markdown parser *(gzipped + minified)*

[check out this demo](https://shynrou.github.io/micro-down)


```
npm install -S micro-down
```

## support:
- Headlines: `### Headline`
- Inline:
    - `*italic*, **bold**, ***bold italic***`
    - \``_code_="- something";`\`
    - `~underline~, ~~strike through~~, ~~~deleted~~~`
- Blocks:
    - pre format blocks: surrounded by  \`\`\`
    - div blocks: `""" just a div block """`
    - blockquotes: `> something`
    - class support
- Anchors: `#[jump-here]`
- Links: `[Label](destination Title)`
- Images: `![label](source altText))`
- IFrames: `&[class](url)` `&[width,height,frame class](url)`
- Lists:
    - Unordered lists using: `+` and `-`
    - Ordered lists using: `1.`
    - Nested lists
- Tables: `| some | text |`
    - Header row: `|- header -|- row -|`
