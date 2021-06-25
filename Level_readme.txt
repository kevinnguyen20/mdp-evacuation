Level-Aufbau:

!!! Stand 07.06.2021 22:33 !!!

Das Level ist in 6 Layer unterteilt:

    - Ground: Enthält die Grundstruktur der Levels und von ihr ist zu entnehmen wo sich der Spieler Bewegen darf und wo nicht.
    - Split: Enthält die Felder, wo die Splits passieren sollen, wenn eine Gruppe von Aliens dadrauf eintritt.
    - Action: Enthält alle Actionsfelder wie Coins, Portale, ... wenn der Spieler auf sie stößt sollte ein Event getriggered werden.
    - Design: Enthält nur perspektivische, design Tiles, welche keine Interaktion benötigen (im Code ignoriern)
    - Perspective: Muss der oberste Layer sein, um die Perspektive zu bewahren.
    - Direction: Enthält die Felder, die mit den Farben 'weiß' (ID = 150, % von Aliens gehen nach unten), 
    'grün' (ID =  153, % von Aliens gehen nach rechts), 'rot' (ID = 166, % von Aliens gehen nach links),
    'hell blau' (ID = 151, % von Aliens gehen nach oben). Prozente müssen noch von uns entschieden werden. 
    - splitPercentage: white (ID 149) = 20%, Yellow (ID 163) = 50%, Green (ID 152) = 70%, Red (ID 165) = 100% (Percentages might change through balancing)


Das Level wurde mit dem Programm Tiled erstellt.

Falls ihr fragen zum Aufbau habe, ladet euch das Programm BITTE herunter und öffnet die .tmx Datei und schaut in die Layer selbst rein.

Für Änderungen könnt ihr entweder selbst das Level damit editieren oder ihr schreibt mich an @chrii99 oder @georgik1609.
Falls designtechnisch etwas hinzugefügt/angepasst werden sollte, schreibt @chrii99 an. 

Das Levelkonzept ist so, dass es einige Felder geben, auf denen ein Split passiert.
Welche Felder dass sind, muss der Spieler selbst herausfinden.
Zb. es gibt 1 optimalen Weg pro Level, auf dem befinden sich die Coins.

Pro Level gibt es 3 Coins.

Portale funktionieren nur in eine Richtung (von blau nach Orange).