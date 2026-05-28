import os
import sys
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

SYSTEM_PROMPT = """Jesteś pomocnym asystentem który odpowiada po polsku.
Jesteś bezpośredni, konkretny i nie używasz korporacyjnego żargonu."""

api_key = os.getenv("PCSS_API_KEY")
base_url = os.getenv("PCSS_BASE_URL", "https://llm.hpc.psnc.pl/v1")
model = os.getenv("PCSS_MODEL", "bielik_11b")

if not api_key or api_key == "twój_klucz_tutaj":
    print("Błąd: brak klucza API. Sprawdź plik .env w głównym folderze repo.")
    sys.exit(1)

client = OpenAI(api_key=api_key, base_url=base_url)
history = [{"role": "system", "content": SYSTEM_PROMPT}]

print("Rozmowa z Bielikiem. Wpisz 'q' żeby wyjść.\n")

while True:
    try:
        user_input = input("Ty: ").strip()
    except (KeyboardInterrupt, EOFError):
        print("\nNa razie!")
        break

    if user_input.lower() == "q":
        print("Na razie!")
        break

    if not user_input:
        continue

    history.append({"role": "user", "content": user_input})

    try:
        response = client.chat.completions.create(
            model=model,
            messages=history,
            max_tokens=500,
        )
        reply = response.choices[0].message.content
        history.append({"role": "assistant", "content": reply})
        print(f"Bielik: {reply}\n")
    except Exception as e:
        print(f"Błąd API: {e}")
        history.pop()
