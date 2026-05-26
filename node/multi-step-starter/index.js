import 'dotenv/config';
import OpenAI from 'openai';
import { readFileSync, writeFileSync } from 'fs';

// Etap 1: z wejścia wyciąga strukturę (tematy, tagi, klasyfikacja)
const ETAP1_PROMPT = `Jesteś asystentem który analizuje notatki i wyciąga z nich strukturę.
Dla każdej notatki podaj:
- główny temat (1 zdanie)
- 3-5 tagów (słowa kluczowe)
- klasyfikacja: egzaminowe / pomocnicze / śmieci

Odpowiadaj po polsku w formacie JSON.`;

// Etap 2: na podstawie struktury tworzy finalny wynik
const ETAP2_PROMPT = `Jesteś asystentem który na podstawie przeanalizowanych notatek sugeruje organizację materiałów.
Zaproponuj:
- strukturę folderów (maksymalnie 3 poziomy)
- które notatki powinny być razem
- co można wyrzucić (śmieci)

Odpowiadaj po polsku, krótko i konkretnie.`;

const apiKey = process.env.PCSS_API_KEY;
const baseURL = process.env.PCSS_BASE_URL || 'https://llm.hpc.psnc.pl/v1';
const model = process.env.PCSS_MODEL || 'bielik-11b-v2.3-instruct';

if (!apiKey || apiKey === 'twój_klucz_tutaj') {
  console.error('Błąd: brak klucza API. Sprawdź plik .env w głównym folderze repo.');
  process.exit(1);
}

const inputFile = process.argv[2];

if (!inputFile) {
  console.error('Użycie: node multi-step-starter/index.js <plik.txt>');
  console.error('Przykład: node multi-step-starter/index.js multi-step-starter/przyklad-notatki.txt');
  process.exit(1);
}

let notatki;
try {
  notatki = readFileSync(inputFile, 'utf-8');
} catch {
  console.error(`Błąd: nie można otworzyć pliku '${inputFile}'`);
  process.exit(1);
}

const client = new OpenAI({ apiKey, baseURL });

console.log(`Wczytano: ${inputFile} (${notatki.length} znaków)`);

console.log('\n[Etap 1] Analizuję strukturę notatek...');
let struktura;
try {
  const resp1 = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: ETAP1_PROMPT },
      { role: 'user', content: `Notatki do analizy:\n\n${notatki}` },
    ],
    max_tokens: 800,
  });
  struktura = resp1.choices[0].message.content;
  console.log(struktura);
} catch (err) {
  console.error(`Błąd API (etap 1): ${err.message}`);
  process.exit(1);
}

console.log('\n[Etap 2] Tworzę plan organizacji...');
let plan;
try {
  const resp2 = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: ETAP2_PROMPT },
      { role: 'user', content: `Wynik analizy notatek:\n\n${struktura}` },
    ],
    max_tokens: 600,
  });
  plan = resp2.choices[0].message.content;
  console.log(plan);
} catch (err) {
  console.error(`Błąd API (etap 2): ${err.message}`);
  process.exit(1);
}

const output = `=== ETAP 1: ANALIZA STRUKTURY ===\n\n${struktura}\n\n=== ETAP 2: PLAN ORGANIZACJI ===\n\n${plan}`;
writeFileSync('output.txt', output, 'utf-8');
console.log('\nPełny wynik zapisany do: output.txt');
