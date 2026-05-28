import 'dotenv/config';
import OpenAI from 'openai';
import * as readline from 'readline';

const SYSTEM_PROMPT = `Jesteś pomocnym asystentem który odpowiada po polsku.
Jesteś bezpośredni, konkretny i nie używasz korporacyjnego żargonu.`;

const apiKey = process.env.PCSS_API_KEY;
const baseURL = process.env.PCSS_BASE_URL || 'https://llm.hpc.psnc.pl/v1';
const model = process.env.PCSS_MODEL || 'bielik_11b';

if (!apiKey || apiKey === 'twój_klucz_tutaj') {
  console.error('Błąd: brak klucza API. Sprawdź plik .env w głównym folderze repo.');
  process.exit(1);
}

const client = new OpenAI({ apiKey, baseURL });
const history = [{ role: 'system', content: SYSTEM_PROMPT }];

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

console.log("Rozmowa z Bielikiem. Wpisz 'q' żeby wyjść.\n");

function ask() {
  rl.question('Ty: ', async (input) => {
    const text = input.trim();

    if (text.toLowerCase() === 'q' || text === '') {
      if (text.toLowerCase() === 'q') console.log('Na razie!');
      rl.close();
      return;
    }

    history.push({ role: 'user', content: text });

    try {
      const response = await client.chat.completions.create({
        model,
        messages: history,
        max_tokens: 500,
      });
      const reply = response.choices[0].message.content;
      history.push({ role: 'assistant', content: reply });
      console.log(`Bielik: ${reply}\n`);
    } catch (err) {
      console.error(`Błąd API: ${err.message}`);
      history.pop();
    }

    ask();
  });
}

ask();
