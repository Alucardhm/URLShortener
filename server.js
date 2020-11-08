if(process.env.NODE_ENV !== "production"){ // usar a database local apenas se estivermos no nosso ambiente de desenvolvimento
    require('dotenv').config()
}


const express = require('express')
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl')
const methodOverride = require('method-override')

const app = express()

mongoose.connect(process.env.DATABASE_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.set('view engine','ejs')
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

app.get('/', async(req,res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index',{shortUrls})
})

app.post('/shortUrls', async(req,res) => {
    await ShortUrl.create({full: req.body.fullUrl})
    res.redirect('/')
})

app.get('/:shortUrl', async(req,res) => {
    const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl})
    if(shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})

app.delete('/:shortUrl', async(req,res) => {
    try {
        await ShortUrl.findOne({short: req.params.shortUrl}).deleteOne()
        res.redirect('/')
    } catch (error) {
        console.log(error)
    }
})

app.listen(process.env.PORT || 5000)