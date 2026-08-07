import React from "react";

/**
 * Parses basic inline markdown syntax into React elements:
 * - **bold** or __bold__ -> <strong>
 * - *italic* or _italic_ -> <em>
 * - `code` -> <code>
 * - [text](url) -> <a>
 */
export const parseInlineMarkdown = (text: string): React.ReactNode => {
  if (!text) return "";

  const parts: React.ReactNode[] = [];
  let remainingText = text;
  let keyIdx = 0;

  // Pattern to match bold, italic, code, and link formats
  const regex = /(\*\*(.*?)\*\*|__(.*?)__|_(.*?)_|\*(.*?)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g;
  
  let match;
  let lastIndex = 0;
  
  while ((match = regex.exec(remainingText)) !== null) {
    const matchIndex = match.index;
    const matchString = match[0];
    
    // Add plain text before match
    if (matchIndex > lastIndex) {
      parts.push(remainingText.substring(lastIndex, matchIndex));
    }
    
    // Process formatting based on matched structure
    if (matchString.startsWith("**") && matchString.endsWith("**")) {
      parts.push(<strong key={`b-${keyIdx++}`}>{match[2]}</strong>);
    } else if (matchString.startsWith("__") && matchString.endsWith("__")) {
      parts.push(<strong key={`b-${keyIdx++}`}>{match[3]}</strong>);
    } else if (matchString.startsWith("*") && matchString.endsWith("*")) {
      parts.push(<em key={`i-${keyIdx++}`}>{match[5]}</em>);
    } else if (matchString.startsWith("_") && matchString.endsWith("_")) {
      parts.push(<em key={`i-${keyIdx++}`}>{match[4]}</em>);
    } else if (matchString.startsWith("`") && matchString.endsWith("`")) {
      parts.push(
        <code 
          key={`c-${keyIdx++}`} 
          style={{ 
            backgroundColor: "rgba(0, 0, 0, 0.04)", 
            padding: "2px 4px", 
            borderRadius: "4px", 
            fontSize: "0.85em", 
            fontFamily: "var(--font-mono, monospace)",
            color: "var(--color-orange, #FF6B00)"
          }}
        >
          {match[6]}
        </code>
      );
    } else if (matchString.startsWith("[")) {
      parts.push(
        <a 
          key={`l-${keyIdx++}`} 
          href={match[8]} 
          target="_blank" 
          rel="noopener noreferrer" 
          style={{ 
            color: "var(--primary-color, #FF6B00)", 
            textDecoration: "underline",
            fontWeight: 500
          }}
        >
          {match[7]}
        </a>
      );
    }
    
    lastIndex = regex.lastIndex;
  }
  
  if (lastIndex < remainingText.length) {
    parts.push(remainingText.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : text;
};

/**
 * Strips block-level markdown symbols (such as #, ##, -, *, >, [x])
 * from the start/end of individual strings, returning clean text.
 */
export const stripBlockMarkdown = (text: string): string => {
  if (!text) return "";
  return text
    .replace(/^(#+\s+)/g, "")               // Remove headings (# Heading, ## Heading)
    .replace(/^([*\-\+]\s+)/g, "")          // Remove list bullets (* item, - item)
    .replace(/^(\s*>\s*)/g, "")             // Remove blockquote symbol (> text)
    .replace(/^-\s*\[([ xX]?)\]\s*/g, "")   // Remove checklist checkboxes (- [ ] or - [x])
    .trim();
};
