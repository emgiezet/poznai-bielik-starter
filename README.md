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
pip install -r requirements.txt
python hello-world.py
```

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

- Błąd `401 Unauthorized` → klucz PCSS nieprawidłowy lub nie ma go w `.env`
- Błąd `Connection refused` / `Name or service not known` → sprawdź WiFi i `PCSS_BASE_URL` w `.env`
- Błąd `Model not found` → zapytaj prowadzącego o aktualną nazwę modelu

Discord społeczności Bielika: link na slajdach warsztatu.
