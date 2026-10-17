import sqlite3
from pathlib import Path

BASE = Path("src/data/bible")

databases = [
    ("kjv.sqlite", "book_id", "number"),
    ("asv.sqlite", "book", "verse"),
    ("ha_con.sqlite", "book", "verse"),
]

for filename, book_column, verse_column in databases:
    path = BASE / filename

    connection = sqlite3.connect(path)

    print()
    print("=" * 70)
    print(filename)
    print("=" * 70)

    rows = connection.execute(
        f"""
        SELECT
            {book_column},
            COUNT(*) AS verse_count,
            MIN(chapter) AS first_chapter,
            MAX(chapter) AS last_chapter
        FROM verses
        GROUP BY {book_column}
        ORDER BY {book_column}
        """
    ).fetchall()

    print(
        "book | verses | first chapter | last chapter"
    )
    print("-" * 50)

    for row in rows:
        print(row)

    connection.close()