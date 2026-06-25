const fs = require("fs");
const path = require("path");

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

function beautifyHtml(html) {
  let indentLevel = 0;
  const indentSize = 2;
  const indent = () => " ".repeat(indentLevel * indentSize);
  
  // Split by tag boundaries
  const parts = html.split(/(<\/?[a-zA-Z0-9:_-]+(?:\s+[^>]*?)?>)/g);
  let result = "";
  
  // Structural/block level tags we want to format with linebreaks and indentation
  const blockTags = [
    "html", "head", "body", "meta", "link", "script", "style", "title",
    "div", "section", "main", "header", "footer", "nav", "aside",
    "ul", "ol", "table", "thead", "tbody", "tr"
  ];

  let inPreScriptStyle = false;
  let preScriptStyleTagName = "";
  let openTags = [];

  for (let i = 0; i < parts.length; i++) {
    let part = parts[i];
    if (!part) continue;

    // Check if we are inside a script, style, pre, or textarea block
    if (inPreScriptStyle) {
      result += part;
      const closeMatch = part.match(new RegExp(`</${preScriptStyleTagName}>`, "i"));
      if (closeMatch) {
        inPreScriptStyle = false;
        preScriptStyleTagName = "";
        openTags.pop();
      }
      continue;
    }

    const startTagMatch = part.match(/^<([a-zA-Z0-9:_-]+)/);
    const endTagMatch = part.match(/^<\/([a-zA-Z0-9:_-]+)/);
    const selfClosing = part.endsWith("/>") || part.match(/^<(meta|link|br|hr|img|input|source)/i);

    if (startTagMatch) {
      const tagName = startTagMatch[1].toLowerCase();
      if (["script", "style", "pre", "textarea"].includes(tagName)) {
        inPreScriptStyle = true;
        preScriptStyleTagName = tagName;
      }

      const isBlock = blockTags.includes(tagName);
      const isInsideText = openTags.some(t => !blockTags.includes(t));

      if (isBlock && !isInsideText) {
        if (result.length > 0 && !result.endsWith("\n")) {
          result += "\n";
        }
        result += indent() + part;
        if (!selfClosing) {
          indentLevel++;
          openTags.push(tagName);
        }
      } else {
        result += part;
        if (!selfClosing) {
          openTags.push(tagName);
        }
      }
    } else if (endTagMatch) {
      const tagName = endTagMatch[1].toLowerCase();
      const isBlock = blockTags.includes(tagName);
      
      const lastIdx = openTags.lastIndexOf(tagName);
      if (lastIdx !== -1) {
        openTags.splice(lastIdx, 1);
      }

      const isInsideText = openTags.some(t => !blockTags.includes(t));

      if (isBlock && !isInsideText) {
        indentLevel = Math.max(0, indentLevel - 1);
        if (result.length > 0 && !result.endsWith("\n")) {
          result += "\n";
        }
        result += indent() + part;
      } else {
        result += part;
      }
    } else {
      // Text node
      const isInsideText = openTags.some(t => !blockTags.includes(t));
      if (isInsideText) {
        result += part;
      } else {
        const text = part.trim();
        if (text) {
          const cleanText = text.replace(/\s+/g, " ");
          if (result.length > 0 && !result.endsWith("\n")) {
            result += "\n";
          }
          result += indent() + cleanText;
        }
      }
    }
  }

  // Remove leading/trailing empty lines
  return result.replace(/\n\s*\n/g, "\n").trim();
}

console.log("Starting HTML beautification on build output...");

// Targets both standard next export directories and build servers if present
const targets = [
  path.join(__dirname, "../.next/server"),
  path.join(__dirname, "../out")
];

targets.forEach((targetDir) => {
  if (fs.existsSync(targetDir)) {
    console.log(`Scanning directory: ${targetDir}`);
    walkDir(targetDir, (filePath) => {
      if (filePath.endsWith(".html")) {
        console.log(`Beautifying: ${filePath}`);
        try {
          const original = fs.readFileSync(filePath, "utf-8");
          const formatted = beautifyHtml(original);
          fs.writeFileSync(filePath, formatted, "utf-8");
        } catch (e) {
          console.error(`Error beautifying ${filePath}:`, e);
        }
      }
    });
  }
});

console.log("HTML beautification complete.");
