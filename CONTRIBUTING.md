# Für die Entwickler

Die features werden im git in Form von Issues angelegt wobei jedes Issue ein spezifisches feature beschreibt.
Darüber hinaus könnt ihr gerne weitere sub-issues anlegen und diese mit dem main-issue verknüpfen.
Legt euch bitte für jedes übergeordnete Issue, dass ihr bearbeitet einen neuen Branch an.
Das Repo enthält ein Board für alle Issues. Je nach Bearbeitungsstand stehen verschiedene Spalten zur Verfügung.
Das Issue sollte also immer in der passenden Spalte sein, damit alle anderen nachvollziehen können, wie weit ihr mit dem Issue seid.

## Commits

Achtet beim commiten darauf, dass ihr, wen ihr subissues habt, eure commits nach subissue gruppiert und nicht alles auf einmal commited.
Das hat bei größeren commits den Vorteil, dass es sehr eure Änderungen nachvollziehbarer sind und macht am Ende die Fehlersuche einfacher.
Wenn das Gesamtfeature klein ist und die einzelnen Änderungen sehr überschaubar sind, könnt ihr natürlich alles auf einen Haufen packen.

## Merge-Requests

Wenn ihr fertig seid erstellt ihr einen merge-request.
Sobald der commit reviewed ist, wird dieser mit dem Master gemergt.

Änhlich wie beim Miniprojekt sollte jeder commit eine commit message enthalten die beschreibt an welchem feature ihr gearbeitet habt.
Haltet eure commits so klein wie möglich und erstellt ein commit für jede Art von Aufgabe.
Wenn ihr z.B. whitespaces entfernt und gleichzeitig ein feature in das Spielfeld einfügt, gehören beide in einen separaten commit.

Für die Merge Requets steht im Board (unter Issues -> Board) eine Spalte "Awaiting Review" bereit.
Die Devs legen alle Issues für die sie einen MR erstellt haben dort rein.
Die MR Manager schauen dann entsprechend nach ob etwas vorliegt und weisen sich selbst als assignee zu.
Da wir nicht mehre assignees zuweisen können, kann ein MR Manager auch dann das Issue reviewen, wenn ein anderer assignee eingetragen ist.
Dazu einfach wie oben beschrieben den assignee auf sich selbst setzen und anschließend das Issue in die "In Review" spalte schieben.

## Ticket API (Tags)

| Tag    | Description         | Relevant for      |
| ------ | ------------------- | ----------------- |
| DEV    | developement        | only assignee/s   |
| ORGA   | organisation        | everyone          |
| COORD  | coordination        | only SM and/or PO |
| DOCU   | documentation       | only assignee/s   |
| ART    | visual artwork      | only assignee/s   |
| BUG    | bug found/reported  | only SM and/or PO |
| BUGFIX | fixing reported bug | only assignee/s   |
