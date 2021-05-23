# Ideen für konkrete Implemtierung

## Grundlagen

Für die eindeutige Kommunikation lege ich fest, dass folgende Objekte auf dem Spielfeld befinden:

- Königin
- Untertarnen
- Belohnungen (Münzen)
- Fallen (Feuer, Pfeile, Bomben, Lava, ...)

Außerdem gelten folgende Bezeichnungen:

- Das Spielfeld besteht aus Vierecken. Sie werden Tiles genannt.
- Die Person, die unser Spiel spielt, heißt Spieler.

Wenn ihr mit den Bezeichnungen nicht zufrieden seid, dann ändert das und **sagt das allen Bescheid, damit keine Verwirrungen auftreten und Eindeutigkeit herrscht**.

## Ideen, die wir von der ursprünglichen Idee übernehmen

- Die Königin steuert sich selbst und alle anderen Untertarnen mit den Tasten WASD.
- Die Untertarnen werden der Königin nicht immer folgen.
- Belohnungen können eingesammelt werden.
- Wenn die Königin stirbt, dann hat der Spieler verloren.
- Wenn die Königin oder eines der Untertarnen das Ziel erreicht, dann hat der Spieler das Spiel gewonnen.

## Verbesserung der ursprünglichen Idee

### Split

- Splits als im originalem Sinne existiert nicht mehr. **Bitte benennt alle Funktionen, Methoden oder Attribute, die "split" im Namen beinhalten, um**. Das beugt Verwirrungen vor.
- Stattdessen wird für jeden Untertan zur Laufzeit berechnet, ob er der Königin folgt oder nicht.
- Die Wahrscheinlichkeiten werden aus den Tiles gelesen. Die Tiles beinhalten die Wahrscheinlichkeiten, welche darüber entscheiden, ob der Untertan der Königin folgen oder nicht.
- **Vorschlag anhand eines Beispiels**: nehmen wir an, dass die Wahrscheinlichkeit, mit welcher wir der Königin folgen, 92% beträgt. Somit bleiben 8% für alle anderen Richtungen. Jedes Tile beinhaltet für jede der vier Richtungen eine Wahrscheinlichkeit. Also haben wir: (F: 92%, N: 25%, E: 25%, S: 25%, W: 25%) mit F: Follow queen, N: North, E: East, S: South und W: West. Befindet sich ein Untertan auf ein neues Feld, dann fragt er das Tile ab, wie hoch die Wahrscheinlichkeit ist, dass er der Königin folgen wird **und speichert das lokal in seinen Attributen ab**. Möchte die Königin nun nach Norden, dann beträgt die Wahrscheinlichkeit 94% (ja, ganz genau und hier das "wieso": 92%, dass der Untertan die Königin folgen wird und wenn wir mit 8% der Königin nicht folgen, dann gilt 2% = 8% \* 25%, dass wir zufällig doch in die Richtung der Königin gehen. Addiert ihr das zusammen dann gilt 100% = 94% + (8% \* 25%) + (8% \* 25%) + (8% \* 25%). Es handelt sich hier also um eine bedingte Wahrscheinlichkeit mit der Zusatzinformation, dass wir der Königin nicht gehorchen).

- Besitzt ein Tile angrenzende nicht begehbare Tiles, dann beträgt die Wahrscheinlichkeit gleich 0% (nicht -1 oder -3 oder andere kryptische Fehlercodes, denn 0% entspricht ein unmögliches Ereignis und ist verständlicher für die Programmierer, die sich nicht direkt mit der konkreten Implementierung beschäftigt haben).

- Möchte die Königin nach Westen gehen, aber der Untertan liefe dann gegen eine Wand, dann implementieren wir das folgendermaßen: die Wahrscheinlichkeit für den Untertan in Richtung Westen beträgt 0%. Das Tile kann so aussehen: (F: 92%, N: 30%, E: 40%, S: 30%, W: 0%). Der Untertan fragt diese Daten ab und speichert sie ab. 

Kleine Anmerkung: ich denke nicht, dass wir beim Split unbedingt prüfen müssen, dass ein Feld begehbar ist. Da wir hardcoden, geben wir für die jeweiligen Felder, die nicht betretet werden dürfen, einfach die Wahrscheinlichkeit von 0 an, was heißt, dass sie nie betreten werden. Das optimiert auch die Laufzeit in gewisser Weise
Da wir wissen, dass die Königin alle anderen Objekte steuert, können wir das so implementieren, dass die Objekte mit z.B. 98%-er Wahrscheinlichkeit in die Richtung der Königin bewegen und die restlichen 2% entnehmen wir dann aus dem Tupel des jeweiligen Feldes. Damit können wir dann die Bewegungen der Untertarnen eleganter gestalten. Wir reduzieren damit die Anzahl der möglichen Attribute für die Objekte und beziehen die Informationen direkt aus dem jeweiligen Tile
Vielleicht noch eine Anmerkung: das Tile selbst besitzt ein zusätzliches Attribut, worin gespeichert wird, ob es sich um ein Spielrandfeld, Mauer, Art des Actionsfields, ganz normales Feld, Startfeld und Endfeld ist. Dies verhindert vor allem den Bug, wo niemand das Endfeld erreicht, aber der Spieler trotzdem gewonnen hat oder das der Split direkt auf dem Endfeld war, aber das Spiel nicht gewonnen wurde (das Feld fragt einfach ab, ob die Liste der Objekte auf seinem Feld leer ist).
