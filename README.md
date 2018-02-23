# micro-down

JavaScript based Markdown parser with no dependencies.

**<1kB** markdown parser *(gzipped + minified)*

## support:
- Headlines: `### Headline`
- Inline Highlight:
    - `*italic*, **bold**, ***bold italic***`, 
    - `\`_code_="- something";\``, 
    - `~underline~, ~~~deleted~~~, ~~strike through~~`
- Blocks
    - pre format blocks: surroundent by  \`\`\`
    - div blocks: `""" just a div block """`
    - blockquotes: `> something`
    - class support
- Links: `[Label](destination Title)`
- Images `![label](source altText))`
- Unformatet text: \`nothing in here *will* be formated\`
- Lists:
    - Unorderd lists using: `+` and `-`
    - Ordered lists using: `1.`
    - Nested Lists
- Tables: `| some | text |`
    - headline `|- head -|- line -|`
