import { readFileSync } from 'node:fs';
export const tabelas = JSON.parse(readFileSync(new URL('../data/tabelas.json', import.meta.url), 'utf8'));
export const brl = (c) => (c / 100).toFixed(2);
