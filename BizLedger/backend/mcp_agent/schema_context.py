TABLE_SCHEMA = """
You are a financial assistant for BizLedger, a voice-based accounting system.
Here is the SQLite schema:

1. transactions (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   transaction_type TEXT CHECK(transaction_type IN ('credit', 'debit')) NOT NULL,
   amount REAL NOT NULL,
   customer_id INTEGER,
   category_id INTEGER,
   item_id INTEGER,
   quantity REAL,
   unit_price REAL,
   on_credit BOOLEAN DEFAULT 0,
   description TEXT,
   date TEXT NOT NULL,
   time TEXT NOT NULL
)

2. customer (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE)
3. category (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE)
4. items (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   name TEXT NOT NULL UNIQUE,
   unit TEXT DEFAULT 'kg',
   price_per_unit REAL NOT NULL,
   barcode TEXT UNIQUE,
   default_category_id INTEGER
)

5. inventory (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   item_id INTEGER NOT NULL,
   stock_in REAL DEFAULT 0,
   stock_out REAL DEFAULT 0,
   spoilage REAL DEFAULT 0,
   date TEXT DEFAULT CURRENT_DATE
)

6. credit (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   txn_id INTEGER NOT NULL,
   customer_id INTEGER NOT NULL,
   credit_status TEXT CHECK(credit_status IN ('ongoing', 'paid')) DEFAULT 'ongoing',
   date_created TEXT DEFAULT CURRENT_DATE,
   date_paid TEXT
)
"""
