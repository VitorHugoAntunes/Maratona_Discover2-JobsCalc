const express = require("express")
const routes = express.Router()
const ProfileController = require("./controllers/ProfileController")

const Job = {
    data: [
        {
            id: 1,
            name: "Pizzaria Guloso",
            "daily-hours": 2,
            "total-hours": 1,
            created_at: Date.now(),
        },
        {
            id: 2,
            name: "OneTwo Project",
            "daily-hours": 3,
            "total-hours": 47,
            created_at: Date.now(),
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
                    budget: Job.services.calculateBudget(job, Profile.data["value-hour"])
                }
            })
        
            return res.render("index", { jobs: updatedJobs })  
        },
        create(req, res){
           return res.render("job")
        },
        save(req, res) {
            const lastId = Job.data[Job.data.length - 1]?.id || 0; // Verificando se ha algum elemento no array, caso nao, atribui id 1 ao primeiro elemento
     
            Job.data.push({
                id: lastId + 1, // atribuindo + 1 no id dos proximos elementos
                name: req.body.name,
                "daily-hours": req.body["daily-hours"],
                "total-hours": req.body["total-hours"],
                created_at: Date.now() // Atribuindo a data de quando o job foi criado
            })

            return res.redirect('/')
        },
        show(req, res) {
            const jobId = req.params.id

            const job = Job.data.find(job => Number(job.id) === Number(jobId)) // Buscando o id de job e verificando se bate com o id da Url (jobId), se true, atribui a variavel Job
            
            if(!job) {
                return res.send('Job not found!')
            }

            job.budget = Job.services.calculateBudget(job, Profile.data["value-hour"])

            res.render("job-edit", { job })
        },

        update(req, res){
            const jobId = req.params.id

            const job = Job.data.find(job => Number(job.id) === Number(jobId)) // Buscando o id de job e verificando se bate com o id da Url (jobId), se true, atribui a variavel Job
            
            if(!job) {
                return res.send('Job not found!')
            }

            const updatedJob = {
                ...job,
                name: req.body.name,
                "total-hours": req.body["total-hours"],
                "daily-hours": req.body["daily-hours"],
            }

            Job.data = Job.data.map(job => {
                if(Number(job.id) === Number(jobId)) {
                    job = updatedJob
                }

                return job
            })

            res.redirect('/job/' + jobId)
        },

        delete(req, res) {
            const jobId = req.params.id

            Job.data = Job.data.filter(job => Number(job.id) !== Number(jobId))

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
        },
        calculateBudget: (job, valueHour) => valueHour * job["total-hours"]
    }
}

routes.get('/', Job.controllers.index);

routes.get('/job', Job.controllers.create);
routes.post('/job', Job.controllers.save);

routes.get('/job/:id', Job.controllers.show);
routes.post('/job/:id', Job.controllers.update);
routes.post('/job/delete/:id', Job.controllers.delete);

routes.get('/profile', ProfileController.index);
routes.post('/profile', ProfileController.update);

module.exports = routes;