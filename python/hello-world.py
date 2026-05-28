import os
import sys
from dotenv import load_dotenv
from openai import OpenAI, AuthenticationError, APIConnectionError

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))

api_key = os.getenv("PCSS_API_KEY")
base_url = os.getenv("PCSS_BASE_URL", "https://llm.hpc.psnc.pl/v1")
model = os.getenv("PCSS_MODEL", "bielik_11b")

if not api_key or api_key == "twój_klucz_tutaj":
    print("Błąd: brak klucza API. Skopiuj .env.example do .env i wklej klucz PCSS.")
    sys.exit(1)

client = OpenAI(api_key=api_key, base_url=base_url)

print(f"Łączę z Bielikiem ({base_url})...")

try:
    response = client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": "Cześć! Odpowiedz jednym zdaniem po polsku."}],
        max_tokens=100,
    )
    print(f"Bielik: {response.choices[0].message.content}")
    print("\n✓ Połączenie z Bielikiem działa!")
except AuthenticationError as e:
    print(f"Błąd 401 z PCSS: {e}")
    print("Możliwe przyczyny: zły PCSS_API_KEY albo Twój team nie ma dostępu do modelu PCSS_MODEL.")
    sys.exit(1)
except APIConnectionError as e:
    print(f"Błąd połączenia: {e}")
    print("Sprawdź WiFi i wartość PCSS_BASE_URL w .env")
    sys.exit(1)
except Exception as e:
    print(f"Nieoczekiwany błąd: {e}")
    sys.exit(1)
