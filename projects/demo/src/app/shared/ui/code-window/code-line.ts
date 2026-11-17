export type TokenKind = 'kw' | 'prop' | 'str' | 'num' | 'tag' | 'attr' | 'punc' | 'plain';

export interface CodeToken {
  text: string;
  kind: TokenKind;
}

export interface CodeLine {
  text: string;
  tokens: CodeToken[];
  changed?: boolean;
}

export const tk = (text: string, kind: TokenKind = 'plain'): CodeToken => ({ text, kind });

export function line(...tokens: CodeToken[]): CodeLine {
  return { text: tokens.map((t) => t.text).join(''), tokens };
}
