const Database = require('./config')

const initDb = {
    async init(){
        
// Aguardando a conexao com o banco
const db = await Database()

// Executando o SQL criando as tabelas
await db.exec(`CREATE TABLE profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    avatar TEXT,
    monthly_budget INT,
    days_per_week INT,
    hours_per_day INT,
    vacation_per_year INT,
    value_hour INT
)`);

await db.exec(`CREATE TABLE jobs(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    daily_hours INT,
    total_hours INT,
    created_at DATETIME
)`);

// Inserindo informacoes nos campos das tabelas
await db.run(`INSERT INTO profile (
    name,
    avatar,
    monthly_budget,
    days_per_week,
    hours_per_day,
    vacation_per_year
) VALUES (
    "Vitor Hugo",
    "https://avatars.githubusercontent.com/u/51717305?v=4",
    3000,
    5,
    5,
    4
);`)

await db.run(`INSERT INTO jobs (
    name,
    daily_hours,
    total_hours,
    created_at
) VALUES (
    "Pizzaria Guloso",
    2,
    1,
    1617514376018
);`)

await db.run(`
INSERT INTO jobs (
    name,
    daily_hours,
    total_hours,
    created_at
) VALUES (
    "OneTwo Project",
    3,
    47,
    1617514376018
);`)

//Fechando a conexao com o banco
await db.close()
    }
}

initDb.init();