const express = require('express')
const app = express()
const mongoose = require('mongoose')
// import the model here
const ShortURL = require('./models/url')

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
    const allData = await ShortURL.find()
    res.render('index', { shortUrls: allData })
})

app.post('/short', async (req, res) => {
    const { fullUrl } = req.body;

    try {
        // insert record
        await ShortURL.create({
            full: fullUrl
        })

        res.redirect('/')
    } catch (err) {
        res.sendStatus(404)
    }

})

app.get('/:shortid', async (req, res) => {
    // grab the :shortid param
    const shortid = req.params.shortid

    // perform the mongoose call to find the long URL
    const urlData = await ShortURL.findOne({ short: shortid })

    // if null, set status to 404 (res.sendStatus(404))
    if (urlData === null) {
        res.sendStatus(404)
    }

    // if not null, increment the click count in database
    if (urlData) {
        await ShortURL.updateOne({ short: shortid }, {
            $set: {
                clicks: urlData.clicks + 1
            }
        })

        // redirect the user to original link
        res.redirect(urlData.full)
    }
})

// Setup your mongodb connection here
mongoose.connect('mongodb://localhost/codedamn', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

mongoose.connection.on('open', async () => {
    // Wait for mongodb connection before server starts

    app.listen(process.env.PUBLIC_PORT, () => {
        console.log('Server started')
    })
})
