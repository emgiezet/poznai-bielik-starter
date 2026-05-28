# PoznAI Bielika — starter repo

Repozytorium do warsztatu **PoznAI Bielika** (30.05.2026, Poznań).  
Zawiera szablony startowe dla dwóch stacków: Python i Node.js.  
Wszystko łączy się z Bielikiem przez PCSS API — zero instalacji lokalnego modelu.

---

## Który stack wybrać?

| Sytuacja | Ścieżka |
|---|---|
| Use case konwersacyjny (rizz check, Janusz mode, symulator rozmowy) | **Playground PCSS** — `llm.hpc.psnc.pl`, bez kodu |
| Masz Pythona, use case wymaga przetwarzania plików / batch | **Python starter** → `python/` |
| Masz Node.js/JS, use case to coś interaktywnego lub z UI | **Node starter** → `node/` |
| Brak IT-osoby w zespole albo nie przeszło pre-setup | **Playground PCSS** (fallback) |

---

## Quick start (dla IT-osoby w zespole)

### 1. Sklonuj repo

```bash
git clone https://github.com/emgiezet/poznai-bielik-starter.git
cd poznai-bielik-starter
```

### 2. Ustaw klucz API

```bash
cp .env.example .env
# edytuj .env — wklej klucz PCSS który dostałeś mailem
```

### 3. Odpal hello-world (weryfikacja pre-setupu)

**Python:**
```bash
cd python
python3 -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python hello-world.py
```

> Na Debianie/Ubuntu (i nowych dystrybucjach z Pythonem 3.12+) `pip install` poza venv zwróci błąd `externally-managed-environment` (PEP 668). Venv to obejście — i tak najczystsza opcja. Wymaga pakietu `python3-venv` (`sudo apt install python3-venv` jeśli brakuje).

**Node:**
```bash
cd node
npm install
node hello-world.js
```

Jeśli zobaczysz `✓ Połączenie z Bielikiem działa!` — jesteś gotowy. Zgłoś zieloną flagę w formularzu.

### 4. Wybierz szablon

Po warsztacie wróć do katalogu swojego stacku i wejdź w wybrany starter:

| Szablon | Kiedy użyć |
|---|---|
| `chat-starter/` | Use case oparty na rozmowie (custom persona, scenariusz) |
| `pipeline-starter/` | Wczytaj plik → Bielik → zapisz wynik |
| `multi-step-starter/` | Dwa etapy: najpierw ekstrakcja, potem transformacja |

Każdy folder ma swój `README.md` z instrukcją i pomysłami.

---

## Struktura repo

```
poznai-bielik-starter/
├── .env.example          ← skopiuj do .env i wklej klucz
├── python/
│   ├── hello-world.py    ← test pre-setupu
│   ├── requirements.txt
│   ├── chat-starter/
│   ├── pipeline-starter/
│   └── multi-step-starter/
└── node/
    ├── hello-world.js    ← test pre-setupu
    ├── package.json
    ├── chat-starter/
    ├── pipeline-starter/
    └── multi-step-starter/
```

---

## Problemy?

- Błąd `401 Unauthorized` → dwie możliwości:
  - `invalid api key` / `authentication` → klucz PCSS nieprawidłowy lub nie ma go w `.env`
  - `team_model_access_denied` / `team not allowed to access model` → klucz **działa**, ale Twój team nie ma dostępu do modelu z `PCSS_MODEL`. Listę dostępnych modeli sprawdzisz tak:
    ```bash
    curl -sS https://llm.hpc.psnc.pl/v1/models -H "Authorization: Bearer $PCSS_API_KEY" | python3 -m json.tool
    ```
    Domyślna nazwa Bielika na PCSS to `bielik_11b` (z podkreślnikiem, nie `bielik-11b-v2.3-instruct`).
- Błąd `Connection refused` / `Name or service not known` → sprawdź WiFi i `PCSS_BASE_URL` w `.env`
- Błąd `Model not found` → zapytaj prowadzącego o aktualną nazwę modelu

Discord społeczności Bielika: link na slajdach warsztatu.
