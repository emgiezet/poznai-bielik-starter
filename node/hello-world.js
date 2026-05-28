import 'dotenv/config';
import OpenAI from 'openai';

const apiKey = process.env.PCSS_API_KEY;
const baseURL = process.env.PCSS_BASE_URL || 'https://llm.hpc.psnc.pl/v1';
const model = process.env.PCSS_MODEL || 'bielik_11b';

if (!apiKey || apiKey === 'twój_klucz_tutaj') {
  console.error('Błąd: brak klucza API. Skopiuj .env.example do .env i wklej klucz PCSS.');
  process.exit(1);
}

const client = new OpenAI({ apiKey, baseURL });

console.log(`Łączę z Bielikiem (${baseURL})...`);

try {
  const response = await client.chat.completions.create({
    model,
    messages: [{ role: 'user', content: 'Cześć! Odpowiedz jednym zdaniem po polsku.' }],
    max_tokens: 100,
  });
  console.log(`Bielik: ${response.choices[0].message.content}`);
  console.log('\n✓ Połączenie z Bielikiem działa!');
} catch (err) {
  if (err.status === 401) {
    console.error(`Błąd 401 z PCSS: ${err.message}`);
    console.error('Możliwe przyczyny: zły PCSS_API_KEY albo Twój team nie ma dostępu do modelu PCSS_MODEL.');
  } else if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
    console.error(`Błąd połączenia: ${err.message}`);
    console.error('Sprawdź WiFi i wartość PCSS_BASE_URL w .env');
  } else {
    console.error(`Nieoczekiwany błąd: ${err.message}`);
  }
  process.exit(1);
}
