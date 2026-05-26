import os
import sys
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

# Etap 1: z wejścia wyciąga strukturę (tematy, tagi, klasyfikacja)
ETAP1_PROMPT = """Jesteś asystentem który analizuje notatki i wyciąga z nich strukturę.
Dla każdej notatki podaj:
- główny temat (1 zdanie)
- 3-5 tagów (słowa kluczowe)
- klasyfikacja: egzaminowe / pomocnicze / śmieci

Odpowiadaj po polsku w formacie JSON."""

# Etap 2: na podstawie struktury tworzy finalny wynik
ETAP2_PROMPT = """Jesteś asystentem który na podstawie przeanalizowanych notatek sugeruje organizację materiałów.
Zaproponuj:
- strukturę folderów (maksymalnie 3 poziomy)
- które notatki powinny być razem
- co można wyrzucić (śmieci)

Odpowiadaj po polsku, krótko i konkretnie."""

api_key = os.getenv("PCSS_API_KEY")
base_url = os.getenv("PCSS_BASE_URL", "https://llm.hpc.psnc.pl/v1")
model = os.getenv("PCSS_MODEL", "bielik-11b-v2.3-instruct")

if not api_key or api_key == "twój_klucz_tutaj":
    print("Błąd: brak klucza API. Sprawdź plik .env w głównym folderze repo.")
    sys.exit(1)

if len(sys.argv) < 2:
    print("Użycie: python main.py <plik.txt>")
    print("Przykład: python main.py przyklad-notatki.txt")
    sys.exit(1)

input_file = sys.argv[1]

if not os.path.exists(input_file):
    print(f"Błąd: plik '{input_file}' nie istnieje.")
    sys.exit(1)

with open(input_file, "r", encoding="utf-8") as f:
    notatki = f.read()

client = OpenAI(api_key=api_key, base_url=base_url)

print(f"Wczytano: {input_file} ({len(notatki)} znaków)")

print("\n[Etap 1] Analizuję strukturę notatek...")
try:
    resp1 = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": ETAP1_PROMPT},
            {"role": "user", "content": f"Notatki do analizy:\n\n{notatki}"},
        ],
        max_tokens=800,
    )
    struktura = resp1.choices[0].message.content
    print(struktura)
except Exception as e:
    print(f"Błąd API (etap 1): {e}")
    sys.exit(1)

print("\n[Etap 2] Tworzę plan organizacji...")
try:
    resp2 = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": ETAP2_PROMPT},
            {"role": "user", "content": f"Wynik analizy notatek:\n\n{struktura}"},
        ],
        max_tokens=600,
    )
    plan = resp2.choices[0].message.content
    print(plan)
except Exception as e:
    print(f"Błąd API (etap 2): {e}")
    sys.exit(1)

output_file = "output.txt"
with open(output_file, "w", encoding="utf-8") as f:
    f.write("=== ETAP 1: ANALIZA STRUKTURY ===\n\n")
    f.write(struktura)
    f.write("\n\n=== ETAP 2: PLAN ORGANIZACJI ===\n\n")
    f.write(plan)

print(f"\nPełny wynik zapisany do: {output_file}")
