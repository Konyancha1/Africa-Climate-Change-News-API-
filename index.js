const PORT = process.env.PORT || 3000
const express = require("express")
const cheerio = require("cheerio")
const axios = require("axios")

const app = express()

const articles = []

const newspapers = [
    {
        name: "world economic forum",
        address:"https://www.weforum.org/agenda/2021/10/state-of-the-climate-in-africa/",
        base: ''
    },
    {
        name: "Africa renewal",
        address: "https://www.un.org/africarenewal/magazine/december-2018-march-2019/global-warming-severe-consequences-africa",
        base: ''
    },
    {
        name:"unep",
        address: "https://www.unep.org/news-and-stories/story/verge-record-drought-east-africa-grapples-new-climate-normal",
        base: ''
    },
    {
        name:"mongobay",
        address: "https://news.mongabay.com/2022/01/in-africa-temperatures-rise-but-adaptation-lags-on-wests-funding-failure/",
        base: ''
    },
    {
        name:"voa",
        address: "https://www.voanews.com/a/report-africa-must-adapt-to-climate-change-effects/6287674.html",
        base: ''
    },
    {
        name:"Foreign Policy Research Institute",
        address: "https://www.fpri.org/article/2021/10/the-impact-of-climate-change-on-africas-economies/",
        base: ''
    },
    {
        name:"WMO",
        address: "https://public.wmo.int/en/media/press-release/climate-change-triggers-mounting-food-insecurity-poverty-and-displacement-africa",
        base: ''
    },
    {
        name:"African Arguments",
        address: "https://africanarguments.org/2022/01/2022-is-africas-year-to-lead-the-world-on-climate-change/",
        base: ''
    },
]

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then(response => {
        const html_data = response.data
        const $ = cheerio.load(html_data)

        $('a:contains("climate")', html_data).each(function () {
            const title = $(this).text()
            const url = $(this).attr('href')
            articles.push({
                title,
                url: newspaper.base + url,
                source: newspaper.name
            })
        })
    })
})

app.get('/', (req, res) => {
    res.json("Welcome to the Climate Change News API")
})

app.get('/news', (req, res) => {
        res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})
   

app.listen(PORT, () => console.log('Server listening on port',PORT, '.....'))
