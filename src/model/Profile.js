const Database = require('../db/config')

module.exports = {
    async get(){
        // Chamando a conexao com o banco, executando a busca dos dados da tabela profile e os retornando
        const db = await Database()
        
        const data = await db.get(`SELECT * FROM profile`)

        await db.close()

        return {
            name: data.name,
            avatar: data.avatar,
            "monthly-budget": data.monthly_budget,
            "days-per-week": data.days_per_week,
            "hours-per-day": data.hours_per_day,
            "vacation-per-year": data.vacation_per_year,
            "value-hour": data.value_hour,
        };
    },

    async update(newData){
        // Executando comando SQL para atualizar os campos da tabela profile
        const db = await Database()

        db.run(`UPDATE profile SET
                name = "${newData.name}",
                avatar = "${newData.avatar}",
                monthly_budget = ${newData["monthly-budget"]},
                hours_per_day = ${newData["hours-per-day"]},
                vacation_per_year = ${newData["vacation-per-year"]},
                value_hour = ${newData["value-hour"]}
        `)
    }
}