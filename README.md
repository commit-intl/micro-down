# micro-down

JavaScript based Markdown parser with no dependencies.

**1.03kB** markdown parser *(gzipped + minified)*

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
- IFrames: `&[class](url)` `&[width,height,frame class](url)` 
- Links: `[Label](destination Title)`
- Images: `![label](source altText))`
- Lists:
    - Unordered lists using: `+` and `-`
    - Ordered lists using: `1.`
    - Nested lists
- Tables: `| some | text |`
    - Header row: `|- header -|- row -|`
