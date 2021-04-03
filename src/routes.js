const express = require("express")
const routes = express.Router()

const views = __dirname + "/views/"

const Profile = {
    data: {
        name: "Vitor Hugo",
        avatar: "https://avatars.githubusercontent.com/u/51717305?v=4",
        "monthly-budget": 3000,
        "days-per-week": 5,
        "hours-per-day": 5,
        "vacation-per-year": 4,
        "value-hour": 75,
    },
    
    controllers: {
        index(req, res){
            res.render(views + "profile", { profile: Profile.data })
        },

        update(req, res) {
            // req.body para pegar os dados
            const data = req.body
            
            // Definir quantas semanas tem em um ano
            const weeksPerYear = 52

            // Remover as semanas de ferias do ano, para pegar quantas semanas tem em um mes
            const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12

            // total de horas trabalhadas na semanas
            const weekTotalHours = data["hours-per-day"] * data["days-per-week"]

            // horas trabalhadas no mes
            const monthlyTotalHours = weekTotalHours * weeksPerMonth

            // Qual sera o valor da minha horas
            const valueHour =  data["monthly-budget"] / monthlyTotalHours

            Profile.data = {
                ...Profile.data,
                ...req.body,
                "value-hour": valueHour
            }

            return res.redirect('/profile')
        }
    }
}

const Job = {
    data: [
        {
            id: 1,
            name: "Pizzaria Guloso",
            "daily-hours": 2,
            "total-hours": 1,
            created_at: Date.now()
        },
        {
            id: 2,
            name: "OneTwo Project",
            "daily-hours": 3,
            "total-hours": 47,
            created_at: Date.now()
        },
    ],
    controllers: {
        index(req, res){
            const updatedJobs = Job.data.map((job) => {
                const remaining = Job.services.remainingDays(job)
                const status = remaining <= 0 ? 'done' : "progress"
        
                return {
                    ...job,
                    remaining,
                    status,
                    budget: Profile.data["value-hour"] * job["total-hours"]
                }
            })
        
            return res.render(views + "index", { jobs: updatedJobs })  
        },
        create(req, res){
           return res.render(views + "job")
        },
        save(req, res) {
            const lastId = Job.data[Job.data.length - 1]?.id || 1; // Verificando se ha algum elemento no array, caso nao, atribui id 1 ao primeiro elemento
     
            Job.data.push({
                id: lastId + 1, // atribuindo + 1 no id dos proximos elementos
                name: req.body.name,
                "daily-hours": req.body["daily-hours"],
                "total-hours": req.body["total-hours"],
                created_at: Date.now() // Atribuindo a data de quando o job foi criado
            })

            return res.redirect('/')
        }
    },
    services: {
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
        }
    }
}

routes.get('/', Job.controllers.index);

routes.get('/job', Job.controllers.create);
routes.post('/job', Job.controllers.save);

routes.get('/job/edit', (req, res) => res.render(views + "job-edit"));

routes.get('/profile', Profile.controllers.index);
routes.post('/profile', Profile.controllers.update);

module.exports = routes;