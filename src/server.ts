import * as express from 'express'
import * as dotenv from 'dotenv'
import * as bodyParser from 'body-parser'

dotenv.config({ path: ".env.local" });


const app = express()

app.use(bodyParser.urlencoded({ extended: false, limit: '2mb' }))
app.use(bodyParser.json())

const PORT = process.env.SERVER_PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
});