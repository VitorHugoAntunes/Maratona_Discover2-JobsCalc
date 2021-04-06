module.exports = {
    remainingDays(job){
        // ajuestes no jobs
        // calculo de tempo restante
    
        const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed() // Arredondando o numero de dias restantes para evitar numero decimal
    
        const createdDate = new Date(job.created_at)
        const dueDay = createdDate.getDate() + Number(remainingDays) // Calculando dia de vencimento a partir do dia de criacao do projeto
    
        // Data exata do vencimento
        const dueDateInMs = createdDate.setDate(dueDay)
    
        // Diferenca entre a data de vencimento e a data atual
        const timeDifferenceInMs = dueDateInMs - Date.now()
    
        // transformar milli em dias
        const dayInMs = 1000 * 60 * 60 * 24
        const dayDifference = Math.floor(timeDifferenceInMs / dayInMs)
    
        // restam x dias
        return dayDifference
    },
    calculateBudget: (job, valueHour) => valueHour * job["total-hours"]
}