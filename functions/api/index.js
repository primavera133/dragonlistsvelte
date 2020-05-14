'use strict'

const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://dragonlistsvelte.firebaseio.com/'
})

const express = require('express')
const app = express()

// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const authenticate = async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer ')
  ) {
    res.status(403).send('Unauthorized')
    return
  }
  const idToken = req.headers.authorization.split('Bearer ')[1]
  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken)
    req.user = decodedIdToken
    next()
    return
  } catch (e) {
    res.status(403).send('Unauthorized')
    return
  }
}

app.use(authenticate)

// // POST /api/messages
// // Create a new message, get its sentiment using Google Cloud NLP,
// // and categorize the sentiment before saving.
// app.post('/api/messages', async (req, res) => {
//   const message = req.body.message

//   console.log(`ANALYZING MESSAGE: "${message}"`)

//   try {
//     const results = await client.analyzeSentiment({
//       document: { content: message, type: 'PLAIN_TEXT' }
//     })

//     const category = categorizeScore(results[0].documentSentiment.score)
//     const data = { message: message, sentiment: results[0], category: category }

//     await admin
//       .database()
//       .ref(`/users/${req.user.uid}/messages`)
//       .push(data)

//     res.status(201).json({ message, category })
//   } catch (error) {
//     console.log('Error detecting sentiment or saving message', error.message)
//     res.sendStatus(500)
//   }
// })

// GET /api/species
app.get('/species', async (req, res) => {
  let query = admin.database().ref(`/species`)

  try {
    const snapshot = await query.once('value')
    let list = []
    snapshot.forEach(childSnapshot => {
      list.push({
        key: childSnapshot.key,
        specie: childSnapshot.val().specie
      })
    })

    res.status(200).json(list)
  } catch (error) {
    console.log('Error getting species list', error.message)
    res.sendStatus(500)
  }
})

// // GET /api/message/{messageId}
// // Get details about a message
// app.get('/api/message/:messageId', async (req, res) => {
//   const messageId = req.params.messageId

//   console.log(`LOOKING UP MESSAGE "${messageId}"`)

//   try {
//     const snapshot = await admin
//       .database()
//       .ref(`/users/${req.user.uid}/messages/${messageId}`)
//       .once('value')

//     if (!snapshot.exists()) {
//       return res.status(404).json({
//         errorCode: 404,
//         errorMessage: `message '${messageId}' not found`
//       })
//     }
//     res.set('Cache-Control', 'private, max-age=300')
//     return res.status(200).json(snapshot.val())
//   } catch (error) {
//     console.log('Error getting message details', messageId, error.message)
//     return res.sendStatus(500)
//   }
// })

// Expose the API as a function
exports.api = functions.https.onRequest(app)
