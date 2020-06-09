import * as functions from 'firebase-functions'
import * as express from 'express'
import * as cors from 'cors'
import * as admin from 'firebase-admin'

const app = express()

admin.initializeApp()

app.use(cors({ origin: true }))

app.post('/', async (req, res) => {
  const chat_id = req.body.message.chat.id
  const { first_name } = req.body.message.from
  const photo_ids = req.body.message.photo?.sort((a : any, b : any) => a.width - b.width).map((photo_size : any) => photo_size.file_id)

  const message = {
    data: {
      Data: JSON.stringify({
        From: first_name,
        Timestamp: `${req.body.message.date}`,
        Text: req.body.message.text,
        Photos: photo_ids
      })
    },
    topic: 'teleprint'
  };

  let resp_message;
  try {
    await admin.messaging().send(message)
    resp_message = "👌"
  }
  catch(err) {
    resp_message = err
  }

  return res.status(200).send({
    method: 'sendMessage',
    chat_id,
    text: resp_message
  })
})

export const router = functions.https.onRequest(app)