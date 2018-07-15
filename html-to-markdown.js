const TurndownService = require("turndown");

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced"
});

function hasClass(element, className) {
  return (" " + element.className + " ").indexOf(" " + className + " ") > -1;
}

turndownService.addRule("code", {
  filter: function(node) {
    var hasSiblings = node.previousSibling || node.nextSibling;
    var isCodeBlock = node.parentNode.nodeName === "PRE" && !hasSiblings;

    return node.nodeName === "CODE" && !isCodeBlock;
  },

  replacement: function(content) {
    if (!content.trim()) return "";

    var delimiter = "`";
    var leadingSpace = "";
    var trailingSpace = "";
    var matches = content.match(/`+/gm);
    if (matches) {
      if (/^`/.test(content)) leadingSpace = " ";
      if (/`$/.test(content)) trailingSpace = " ";
      while (matches.indexOf(delimiter) !== -1) delimiter = delimiter + "`";
    }

    return (
      " " + delimiter + leadingSpace + content + trailingSpace + delimiter + " "
    );
  }
});

turndownService.addRule("fencedCodeBlock", {
  filter: function(node, options) {
    if (options.codeBlockStyle !== "fenced") {
      return false;
    }
    return (
      (node.nodeName === "PRE" &&
        node.firstChild &&
        node.firstChild.nodeName === "CODE") ||
      (node.nodeName === "FIGURE" && hasClass(node, "highlight"))
    );
  },

  replacement: function(content, node, options) {
    var isHighlight = hasClass(node, "highlight");
    var className = isHighlight
      ? node.className
      : node.firstChild.className || "";
    var language = isHighlight
      ? className.trim().split(/\s+/)[1]
      : (className.match(/language-(\S+)/) || [null, ""])[1];

    const pre = isHighlight ? node.querySelector("pre") : node;
    pre.innerHTML = pre.innerHTML.replace(/<br>/g, "\r\n");
    const textContent = pre.textContent;

    return (
      "\n\n" +
      options.fence +
      language +
      "\n" +
      textContent +
      "\n" +
      options.fence +
      "\n\n"
    );
  }
});

module.exports = function htmlToMarkdown(html) {
  return turndownService.turndown(html);
};
