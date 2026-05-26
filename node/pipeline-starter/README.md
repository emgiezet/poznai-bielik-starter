# pipeline-starter (Node.js)

Wczytaj plik tekstowy → wyślij do Bielika → zapisz wynik do `output.txt`.

**Jak uruchomić:**
```bash
cd node
node pipeline-starter/index.js pipeline-starter/przyklad-wejscie.txt
```

Wynik trafia do `output.txt` w tym samym folderze.

**3 pomysły jak to rozszerzyć:**
1. Zamień `SYSTEM_PROMPT` na `wytłumacz tę umowę studentowi — co podpisuję, na czym mogę stracić, bez prawniczego żargonu` i wklej regulamin Allegro lub umowę o pracę
2. Zmień prompt na `napisz 5 różnych captions do posta na IG o tym temacie` i wklej opis zdjęcia
3. Zrób pętlę po folderze z plikami `.txt` — batch processing wielu dokumentów naraz
