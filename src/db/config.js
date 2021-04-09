const sqlite3 = require("sqlite3")
const {open} = require("sqlite")

// Abrindo a conexao com o banco
module.exports = () => open({
        filename: "./database.sqlite",
        driver: sqlite3.Database,
    });
;