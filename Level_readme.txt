Level-Aufbau:

Das Level ist in "4" Layer unterteil:

    - Ground: Enthält die Grundstruktur der Levels und von ihr ist zu entnehmen wo sich der Spieler Bewegen darf und wo nicht.
    - Probability: Enthält die Wahrscheinlichkeiten und den optimale Pfad.
    - Action: Enthält alle Actionsfelder wie Coins, Portale, ... wenn der Spieler auf sie stößt sollte ein Event getriggered werden.
    - Design: Enthält nur perspektivische, design Tiles, welche keine Interaktion benötigen (im Code ignoriern)
    - Perspective: Muss der oberste Layer sein, um die Perspektive zu bewahren.

Das Level wurde mit dem Programm Tiled erstellt.

Falls ihr fragen zum Aufbau habe, ladet euch das Programm BITTE herunter und öffnet die .tmx Datei und schaut in die Layer selbst rein.

Für Änderungen könnt ihr entweder selbst das Level damit editieren oder ihr schreibt mich an @chrii99.
Falls designtechnisch etwas hinzugefügt/angepasst werden sollte, schreibt @chrii99 an. 

Das Levelkonzept ist so, dass es einige Felder geben wird die hohe Chance auf einen Split haben (rote Felder). 
Welche Felder dass sind, muss der Spieler selbst herausfinden.
Zb. es gibt 2 Wege, auf beiden sind Coins, jedoch ist es besser den einen Weg durchzugehen und den anderen nur von links zu betreten.

Pro Level gibt es 3 Coins.

Portale funktionieren nur in eine Richtung (von blau nach Orange).