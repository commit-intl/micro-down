<p align="center">
  <img src="https://coding.international/assets/projects/microdown/microdown.svg" width="256" height="256" alt="micro-down">
</p>

# micro-down

JavaScript based Markdown parser without dependencies.

**1.3kB** markdown parser *(gzipped + minified)*

[check out this demo](https://commit-intl.github.io/micro-down)

```
npm install -S micro-down
```

## support:
- Headlines: `### Headline`
- Inline:
    - `*italic*, **bold**, ***bold italic***`
    - \``_code_="- something";`\` or direct escaping with \\
    - `~underline~, ~~strike through~~, ~~~deleted~~~`
- Blocks:
    - pre format blocks: surrounded by  \`\`\`
    - div blocks: `""" just a div block """`
    - blockquotes: `> something`
    - class support
- Anchors: `#[jump-here]`
- Links: `[Label](destination Title)`
    - URL auto linking `https://github.com/coding-intl/micro-down`
- Images: `![label](source altText))`
    - linked: `[![label](source altText))](destination Title)`
- IFrames: `&[class](url)` `&[width,height,frame class](url)`
- Lists:
    - Unordered lists using: `+` and `-`
    - Ordered lists using: `1.`
    - Nested lists
- Tables: `| some | text |`
    - Header row: `|- header -|- row -|` or by a following `|---`
- Comments `<!-- # Comment -->`
