const admin = require('firebase-admin')
const serviceAccount = require('../dragonlistsvelte-firebase-adminsdk-6b71h-12f7060dd9.json')
const data = require('./counties.json')
const collectionKey = 'counties' //name of the collection
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://dragonlistsvelte.firebaseio.com'
})
const firestore = admin.firestore()
const settings = { timestampsInSnapshots: true }
firestore.settings(settings)

if (data && typeof data === 'object') {
  Object.keys(data).forEach(docKey => {
    firestore
      .collection(collectionKey)
      .doc(docKey)
      .set(data[docKey])
      .then(res => {
        console.log('Document ' + docKey + ' successfully written!')
      })
      .catch(error => {
        console.error('Error writing document: ', error)
      })
  })
}
