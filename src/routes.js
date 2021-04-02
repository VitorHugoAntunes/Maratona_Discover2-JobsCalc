const express = require("express")
const routes = express.Router()

const views = __dirname + "/views/"

const profile = {
    name: "Vitor Hugo",
    avatar: "https://avatars.githubusercontent.com/u/51717305?v=4",
    "monthly-budget": 3000,
    "days-per-week": 5,
    "hours-per-day": 5,
    "vacation-per-year": 4
}

const jobs = [
    {
        id: 1,
        name: "Pizzaria Guloso",
        "daily-hours": 2,
        "total-hours": 60,
        created_at: Date.now()
    },
    {
        id: 2,
        name: "OneTwo Project",
        "daily-hours": 3,
        "total-hours": 47,
        created_at: Date.now()
    },
]

routes.get('/', (req, res) => res.render(views + "index", { jobs }));

routes.get('/job', (req, res) => res.render(views + "job"));
routes.post('/job', (req, res) => {
    const lastId = jobs[jobs.length - 1]?.id || 1; // Verificando se ha algum elemento no array, caso nao, atribui id 1 ao primeiro elemento
     
    jobs.push({
        id: lastId + 1, // atribuindo + 1 no id dos proximos elementos
        name: req.body.name,
        "daily-hours": req.body["daily-hours"],
        "total-hours": req.body["total-hours"],
        created_at: Date.now() // Atribuindo a data de quando o job foi criado
    })
    return res.redirect('/')
});

routes.get('/job/edit', (req, res) => res.render(views + "job-edit"));

routes.get('/profile', (req, res) => res.render(views + "profile", { profile }));

module.exports = routes;