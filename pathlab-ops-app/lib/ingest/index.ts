import type { Parser } from "./types";
import { genericCsvParser } from "./parsers/generic-csv";
import { astmParser } from "./parsers/astm";

export const PARSERS: Parser[] = [genericCsvParser, astmParser];

export const PARSER_BY_KEY: Record<string, Parser> = Object.fromEntries(
  PARSERS.map((p) => [p.key, p]),
);

export function getParser(key: string): Parser {
  const p = PARSER_BY_KEY[key];
  if (!p) throw new Error(`Unknown parser "${key}". Known: ${PARSERS.map((x) => x.key).join(", ")}`);
  return p;
}

export * from "./types";
