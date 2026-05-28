import 'dotenv/config';
import OpenAI from 'openai';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';

const SYSTEM_PROMPT = `Jesteś pomocnym asystentem który analizuje tekst i wyciąga z niego kluczowe informacje.
Odpowiadasz po polsku, zwięźle i bez zbędnego lania wody.`;

const apiKey = process.env.PCSS_API_KEY;
const baseURL = process.env.PCSS_BASE_URL || 'https://llm.hpc.psnc.pl/v1';
const model = process.env.PCSS_MODEL || 'bielik_11b';

if (!apiKey || apiKey === 'twój_klucz_tutaj') {
  console.error('Błąd: brak klucza API. Sprawdź plik .env w głównym folderze repo.');
  process.exit(1);
}

const inputFile = process.argv[2];

if (!inputFile) {
  console.error('Użycie: node index.js <plik.txt>');
  console.error('Przykład: node pipeline-starter/index.js pipeline-starter/przyklad-wejscie.txt');
  process.exit(1);
}

let tekst;
try {
  tekst = readFileSync(inputFile, 'utf-8');
} catch {
  console.error(`Błąd: nie można otworzyć pliku '${inputFile}'`);
  process.exit(1);
}

console.log(`Wczytano: ${inputFile} (${tekst.length} znaków)`);
console.log('Wysyłam do Bielika...');

const client = new OpenAI({ apiKey, baseURL });

try {
  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Przeanalizuj poniższy tekst:\n\n${tekst}` },
    ],
    max_tokens: 1000,
  });

  const wynik = response.choices[0].message.content;
  const outputFile = join(dirname(inputFile), 'output.txt');
  writeFileSync(outputFile, wynik, 'utf-8');

  console.log(`\nWynik zapisany do: ${outputFile}`);
  console.log('\n--- PODGLĄD ---');
  console.log(wynik);
} catch (err) {
  console.error(`Błąd API: ${err.message}`);
  process.exit(1);
}
