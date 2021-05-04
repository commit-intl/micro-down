const md = require("./index");

describe("md.parse()", () => {
  describe("inline formatting", () => {
    it("parses italics with *", () => {
      expect(md.inline("I *like* markdown")).toEqual(
        "I <em>like</em> markdown"
      );
    });

    it("parses italics with _", () => {
      expect(md.inline("I _like_ markdown")).toEqual(
        "I <em>like</em> markdown"
      );
    });

    it("parses bold with **", () => {
      expect(md.inline("I **like** markdown")).toEqual(
        "I <strong>like</strong> markdown"
      );
    });

    it("parses bold with __", () => {
      expect(md.inline("I __like__ markdown")).toEqual(
        "I <strong>like</strong> markdown"
      );
    });

    it("parses bold italics with ***", () => {
      expect(md.inline("I ***like*** markdown")).toEqual(
        "I <em><strong>like</strong></em> markdown"
      );
    });

    it("parses bold italics with ___", () => {
      expect(md.inline("I ___like___ markdown")).toEqual(
        "I <em><strong>like</strong></em> markdown"
      );
    });

    it("parses underline with ~", () => {
      expect(md.inline("I ~like~ markdown")).toEqual("I <u>like</u> markdown");
    });

    it("parses strike through with ~~", () => {
      expect(md.inline("I ~~like~~ markdown")).toEqual(
        "I <s>like</s> markdown"
      );
    });

    it("parses deletions with ~~~", () => {
      expect(md.inline("I ~~~like~~~ markdown")).toEqual(
        "I <del>like</del> markdown"
      );
    });

    it('should handle after line break "  \\n"', () => {
      expect(md.inline("I like  \nmarkdown")).toEqual("I like<br>markdown");
    });

    it('should handle pre line break "\\n  "', () => {
      expect(md.inline("I like\n  markdown")).toEqual("I like<br>markdown");
    });
  });

  describe("titles", () => {
    it("parses H1 titles", () => {
      expect(md.parse("# I like markdown")).toEqual("<h1>I like markdown</h1>");
    });

    it("parses H2 titles", () => {
      expect(md.parse("## I like markdown")).toEqual(
        "<h2>I like markdown</h2>"
      );
    });

    it("parses H3 titles", () => {
      expect(md.parse("### I like markdown")).toEqual(
        "<h3>I like markdown</h3>"
      );
    });

    it("parses H4 titles", () => {
      expect(md.parse("#### I like markdown")).toEqual(
        "<h4>I like markdown</h4>"
      );
    });

    it("parses H5 titles", () => {
      expect(md.parse("##### I like markdown")).toEqual(
        "<h5>I like markdown</h5>"
      );
    });

    it("parses H6 titles", () => {
      expect(md.parse("###### I like markdown")).toEqual(
        "<h6>I like markdown</h6>"
      );
    });
  });

  describe("links & images", () => {
    // here are some odd spaces in the result removing them adds some more bytes. IDK if it's worth it.
    it("parses links", () => {
      expect(
        md.inlineBlock(
          "[markdown](https://de.wikipedia.org/wiki/Markdown And a Title)"
        )
      ).toEqual(
        '<a href="https://de.wikipedia.org/wiki/Markdown" title=" And a Title">markdown</a>'
      );
    });

    it("auto format links", () => {
      expect(
        md.inlineBlock("https://en.wikipedia.org/wiki/Open_Financial_Exchange")
      ).toEqual(
        '<a href="https://en.wikipedia.org/wiki/Open_Financial_Exchange">https://en.wikipedia.org/wiki/Open_Financial_Exchange</a>'
      );
    });

    it("don't inline link content", () => {
      expect(
        md.inlineBlock(
          "[https://en.wikipedia.org/wiki/Open_Financial_Exchange](https://en.wikipedia.org/wiki/Open_Financial_Exchange)"
        )
      ).toEqual(
        '<a href="https://en.wikipedia.org/wiki/Open_Financial_Exchange" >https://en.wikipedia.org/wiki/Open_Financial_Exchange</a>'
      );
    });

    it("parses anchor links", () => {
      expect(md.inlineBlock("[Example](#example)")).toEqual(
        '<a href="#example" >Example</a>'
      );
    });

    it("parses images", () => {
      expect(md.inlineBlock("![title](foo.png)")).toEqual(
        '<img src="foo.png" alt="title" ></img>'
      );
      expect(md.inlineBlock("![](foo.png)")).toEqual(
        '<img src="foo.png"  ></img>'
      );
    });

    it("parses images within links", () => {
      expect(md.inlineBlock("[![](toc.png)](#toc)")).toEqual(
        '<a href="#toc" ><img src="toc.png"  ></img></a>'
      );
      expect(md.inlineBlock("[![a](a.png)](#a) [![b](b.png)](#b)")).toEqual(
        '<a href="#a" ><img src="a.png" alt="a" ></img></a> <a href="#b" ><img src="b.png" alt="b" ></img></a>'
      );
    });
  });

  describe("lists", () => {
    it("parses an unordered list with -", () => {
      expect(md.parse("- One\n- Two")).toEqual(
        "<ul><li>One</li><li>Two</li></ul>"
      );
    });

    it("parses an unordered list with +", () => {
      expect(md.parse("+ One\n+ Two")).toEqual(
        "<ul><li>One</li><li>Two</li></ul>"
      );
    });

    it("parses an ordered list", () => {
      expect(md.parse("1. Ordered\n2. Lists\n4. Numbers are ignored")).toEqual(
        "<ol><li>Ordered</li><li>Lists</li><li>Numbers are ignored</li></ol>"
      );
    });

    it("parses a list with contained inlineBlock", () => {
      expect(md.parse("+ One\n+ Two  \n  **strong**[link](link)")).toEqual(
        '<ul><li>One</li><li>Two<br><strong>strong</strong><a href="link" >link</a></li></ul>'
      );
    });

    it("parses a recursive list", () => {
      expect(
        md.parse("+ One\n+ Two\n  1. Twenty One\n  2. Twenty Two\n- Three")
      ).toEqual(
        "<ul><li>One</li><li>Two\n<ol><li>Twenty One</li><li>Twenty Two</li></ol></li><li>Three</li></ul>"
      );
    });
  });
});
