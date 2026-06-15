-- DROP TABLE IF EXISTS articles, subcategories, categories, users CASCADE;


/* Création des tables */
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'actif',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    address_home TEXT,
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subcategories (
    id SERIAL PRIMARY KEY,

    categorie_id INTEGER REFERENCES categories(id)
    ON DELETE CASCADE,

    name VARCHAR(100) NOT NULL,

    slug VARCHAR(120) UNIQUE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    status VARCHAR(50) NOT NULL,
    categorie_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    subcategorie_id INTEGER REFERENCES subcategories(id) ON DELETE SET NULL,
    author_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    planifier_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS article_views (
    id SERIAL PRIMARY KEY,
    article_id INT NOT NULL,
    ip_address TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE "session" (
  "sid" varchar NOT NULL,
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session"
ADD CONSTRAINT "session_pkey"
PRIMARY KEY ("sid");

CREATE INDEX "IDX_session_expire"
ON "session" ("expire");

ALTER TABLE articles
ALTER COLUMN planifier_date
TYPE TIMESTAMP WITH TIME ZONE;

ALTER TABLE articles
ADD COLUMN views INT DEFAULT 0;
