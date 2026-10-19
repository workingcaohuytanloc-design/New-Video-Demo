import React from "react";
import { MONO } from "../fonts";

// Minimal TypeScript highlighter: enough for a believable, syntactically valid editor.
// Restrained palette (blues and greys) so the frame keeps one accent.

const KEYWORDS = new Set([
  "import", "from", "type", "export", "async", "function", "const", "let", "await",
  "if", "else", "return", "new", "throw", "true", "false",
]);
const COLORS = {
  keyword: "#5FB4FF",
  string: "#A8D8FF",
  number: "#7CC4FF",
  comment: "#5C6B7E",
  fn: "#FFFFFF",
  type: "#E2E8F0",
  ident: "#C3CCD8",
  punct: "#7D8899",
};

const TOKEN = /(\/\/.*$)|("(?:[^"\\]|\\.)*")|(\b\d+\b)|([A-Za-z_$][\w$]*)|(\s+)|(.)/g;

const highlight = (line: string) => {
  const out: { text: string; color: string; italic?: boolean }[] = [];
  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(line))) {
    const [all, comment, str, num, word] = m;
    if (comment) out.push({ text: all, color: COLORS.comment, italic: true });
    else if (str) out.push({ text: all, color: COLORS.string });
    else if (num) out.push({ text: all, color: COLORS.number });
    else if (word) {
      const next = line.slice(TOKEN.lastIndex).trimStart()[0];
      const color = KEYWORDS.has(word)
        ? COLORS.keyword
        : next === "("
          ? COLORS.fn
          : /^[A-Z]/.test(word)
            ? COLORS.type
            : COLORS.ident;
      out.push({ text: all, color });
    } else out.push({ text: all, color: COLORS.punct });
  }
  return out;
};

export const CodeLines: React.FC<{ code: string; fontSize: number; lineHeight: number; gutter: number; startLine?: number }> = ({
  code,
  fontSize,
  lineHeight,
  gutter,
  startLine = 1,
}) => {
  const lines = code.split("\n");
  return (
    <div style={{ fontFamily: MONO, fontSize, lineHeight: `${lineHeight}px`, whiteSpace: "pre" }}>
      {lines.map((line, i) => (
        <div key={i} style={{ display: "flex", height: lineHeight }}>
          <div style={{ width: gutter, textAlign: "right", paddingRight: 28, color: "#3E4A5C", flexShrink: 0 }}>{startLine + i}</div>
          <div>
            {highlight(line).map((t, j) => (
              <span key={j} style={{ color: t.color, fontStyle: t.italic ? "italic" : undefined }}>
                {t.text}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
