require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require("cors")
const bodyParser = require('body-parser')
const sequelize = require('./src/db/sequelize')

const app = express()
const port = 3000
//autorisé la connection
app.use(cors())

app
    .use(bodyParser.json())
    .use(morgan('dev'))
  
require('./src/routes/ebookroute')(app)
require('./src/routes/categorieroute')(app)
require('./src/routes/serieroute')(app)
require('./src/routes/liaisonroute')(app)
require('./src/routes/userroute')(app)
require('./src/routes/bibliothequeRoutes')(app)
require('./src/routes/authRoutes')(app)
require('./src/routes/auteurroute')(app)
require('./src/routes/aleatoireroute')(app)

//initilise la bdd, attention remet tout a 0 !!!!
//sequelize.initDb()


//ajout gestion des erreur 404
app.use(({res}) => {
    const message = "nous n'avons pas trouvé la ressource demandé"
    res.status(404).json({message})
})
// le if permet de lancer ces test sans avoir de conflits
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => console.log(`http://localhost:${port}`))
  }

module.exports = app
