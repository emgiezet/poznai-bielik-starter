import os
import sys
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

SYSTEM_PROMPT = """Jesteś pomocnym asystentem który analizuje tekst i wyciąga z niego kluczowe informacje.
Odpowiadasz po polsku, zwięźle i bez zbędnego lania wody."""

api_key = os.getenv("PCSS_API_KEY")
base_url = os.getenv("PCSS_BASE_URL", "https://llm.hpc.psnc.pl/v1")
model = os.getenv("PCSS_MODEL", "bielik-11b-v2.3-instruct")

if not api_key or api_key == "twój_klucz_tutaj":
    print("Błąd: brak klucza API. Sprawdź plik .env w głównym folderze repo.")
    sys.exit(1)

if len(sys.argv) < 2:
    print("Użycie: python main.py <plik.txt>")
    print("Przykład: python main.py przyklad-wejscie.txt")
    sys.exit(1)

input_file = sys.argv[1]

if not os.path.exists(input_file):
    print(f"Błąd: plik '{input_file}' nie istnieje.")
    sys.exit(1)

with open(input_file, "r", encoding="utf-8") as f:
    tekst = f.read()

print(f"Wczytano: {input_file} ({len(tekst)} znaków)")
print("Wysyłam do Bielika...")

client = OpenAI(api_key=api_key, base_url=base_url)

try:
    response = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": f"Przeanalizuj poniższy tekst:\n\n{tekst}"},
        ],
        max_tokens=1000,
    )
    wynik = response.choices[0].message.content
except Exception as e:
    print(f"Błąd API: {e}")
    sys.exit(1)

output_file = os.path.join(os.path.dirname(input_file), "output.txt")
with open(output_file, "w", encoding="utf-8") as f:
    f.write(wynik)

print(f"\nWynik zapisany do: {output_file}")
print("\n--- PODGLĄD ---")
print(wynik)
