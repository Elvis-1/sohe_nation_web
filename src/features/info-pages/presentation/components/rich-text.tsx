import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Renders the small Markdown subset staff write in dashboard information pages:
 * `##`/`###` headings, paragraphs, `- ` and `1. ` lists, `|` tables, `**bold**`, and
 * `[text](url)` links. Output is React elements only (never raw HTML), and links are limited
 * to site paths, https, and mailto, so page copy cannot inject markup or scripts.
 */

type Block =
  | { kind: "heading"; level: 2 | 3; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "list"; ordered: boolean; items: string[] }
  | { kind: "table"; header: string[]; rows: string[][] };

const TABLE_SEPARATOR = /^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)*\|?$/;
const ORDERED_ITEM = /^\d+\.\s+/;

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

export function parseBlocks(source: string): Block[] {
  const blocks: Block[] = [];
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
      paragraph = [];
    }
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trim();

    if (!line) {
      flushParagraph();
      continue;
    }

    const heading = /^(#{2,3})\s+(.*)$/.exec(line);
    if (heading) {
      flushParagraph();
      blocks.push({ kind: "heading", level: heading[1].length as 2 | 3, text: heading[2] });
      continue;
    }

    const isBullet = line.startsWith("- ");
    const isOrdered = ORDERED_ITEM.test(line);
    if (isBullet || isOrdered) {
      flushParagraph();
      const previous = blocks[blocks.length - 1];
      const item = isBullet ? line.slice(2) : line.replace(ORDERED_ITEM, "");
      if (previous?.kind === "list" && previous.ordered === isOrdered) {
        previous.items.push(item);
      } else {
        blocks.push({ kind: "list", ordered: isOrdered, items: [item] });
      }
      continue;
    }

    if (line.startsWith("|")) {
      flushParagraph();
      const tableLines: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        tableLines.push(lines[index].trim());
        index += 1;
      }
      index -= 1;
      const rows = tableLines.filter((row) => !TABLE_SEPARATOR.test(row)).map(splitRow);
      if (rows.length) {
        blocks.push({ kind: "table", header: rows[0], rows: rows.slice(1) });
      }
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  return blocks;
}

const INLINE_TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g;
const linkClass =
  "text-[var(--color-accent-gold-highlight)] underline decoration-[var(--color-accent-gold)]/40 underline-offset-4 transition hover:text-[var(--color-text-primary)]";

function safeHref(href: string): string | null {
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  if (href.startsWith("https://") || href.startsWith("mailto:")) return href;
  return null;
}

function renderInline(text: string): ReactNode[] {
  return text.split(INLINE_TOKEN).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={index} className="font-semibold text-[var(--color-text-primary)]">
          {part.slice(2, -2)}
        </strong>
      );
    }

    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
    if (link) {
      const [, label, rawHref] = link;
      const href = safeHref(rawHref);
      if (!href) return label;
      if (href.startsWith("/")) {
        return (
          <Link key={index} href={href} className={linkClass}>
            {label}
          </Link>
        );
      }
      const external = href.startsWith("https://");
      return (
        <a
          key={index}
          href={href}
          className={linkClass}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {label}
        </a>
      );
    }

    return part;
  });
}

export function RichText({ source }: { source: string }) {
  return (
    <div className="grid gap-5 text-base leading-8 text-[var(--color-text-secondary)]">
      {parseBlocks(source).map((block, index) => {
        switch (block.kind) {
          case "heading":
            return block.level === 2 ? (
              <h2
                key={index}
                className="mt-4 font-[family:var(--font-heading)] text-3xl uppercase leading-none text-[var(--color-text-primary)] md:text-4xl"
              >
                {renderInline(block.text)}
              </h2>
            ) : (
              <h3
                key={index}
                className="mt-2 font-[family:var(--font-supporting)] text-xs uppercase tracking-[0.24em] text-[var(--color-accent-gold-highlight)]"
              >
                {renderInline(block.text)}
              </h3>
            );
          case "list": {
            const ListTag = block.ordered ? "ol" : "ul";
            return (
              <ListTag
                key={index}
                className={`grid gap-2 pl-6 ${block.ordered ? "list-decimal" : "list-disc"} marker:text-[var(--color-accent-gold)]`}
              >
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{renderInline(item)}</li>
                ))}
              </ListTag>
            );
          }
          case "table":
            return (
              <div key={index} className="overflow-x-auto rounded-[1.25rem] border border-white/10">
                <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
                  <thead className="bg-white/5 font-[family:var(--font-supporting)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-primary)]">
                    <tr>
                      {block.header.map((cell, cellIndex) => (
                        <th key={cellIndex} scope="col" className="px-4 py-3 font-medium">
                          {renderInline(cell)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-t border-white/8">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-3">
                            {renderInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "paragraph":
          default:
            return <p key={index}>{renderInline(block.text)}</p>;
        }
      })}
    </div>
  );
}
