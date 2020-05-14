const functions = require('firebase-functions')
const { ssrServer } = require('./__sapper__/build/server/server')
const { api } = require('./api/index')

exports.ssr = functions.https.onRequest(ssrServer)
exports.api = functions.https.onRequest(api)
