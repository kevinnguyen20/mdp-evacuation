Die folgenden Bugs sind auf die alte Version unseres Codes zurückführen. Gefühlt hängen 90% der Bugs mit dem Split und der unsauberen Implementierung der Königin zusammen.

Gefixte Bugs:
- 1. Bug: Koordinate nach dem Einsammeln der Rewards nicht aktualisiert
- 2. Bug: Südlicher Split funktioniert nicht
- 3. Bug: Aufgespaltene Gruppe befindet sich auf demselben Feld wie die Königin
- 4. Bug: Split auf nicht begehbare Felder (nicht mehr so häufig, aber noch vorhanden)
- 5. Bug: Verlassen des Spielfeldes wird nicht abgefangen
- 6. Bug: Spieler sammelt Belohnung ein, ohne das jemand die Belohnung eingesammelt hat
- 7. Bug: Split ist außerhalb des Spielfeldes
- 8. Bug: Split befindet sich auf dem Ziel, aber Spieler gewinnt nicht
- 9. Bug: Negative Spieleranzahl (häufig -42)
- 10. Bug: Gruppenzusammenführung funktioniert meistens nicht (Spieleranzahlanzeige überlappen sich)
- 11. Bug: Gruppenzusammenführung addiert sich fehlerhaft (manchmal bis zu -243)
- 12. Bug: Beim Split werden falsche Spielerzahlen angezeigt (z.B. nach dem 5. Mal immer noch 50 pro Split)

Reproduzierbare Bugs:
- 13. Bug: Spieleranzeige bewegt sich nicht mit
- 14. Bug: Spieler erreicht das Ziel, ohne jemals mit der Königin oder Untertarnen das Ziel erreicht zu haben
- 15. Bug: Königin läuft durch die Wand/nicht begehbare Felder hindurch
- 16. Bug: Untertarnen blockieren Königin, es findet keine Gruppenzusammenführung statt
- 17. Bug: Nach längerer Spielzeit kann man nicht mehr splitten

Paranormale Bugs:
- 18. Bug: Koordinatenanzeige friert
- 19. Bug: Königin bewegt sich ganz normal, ein Teil der Untertarnen jedoch nicht
- 20. Bug: Königin verschwindet einfach, Untertarnen sichtbar, können sich aber nicht bewegen (weil Königin weg ist)
