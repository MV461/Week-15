const express = require('express');
const mongodb = require('mongodb')
const options = require('./options');


const app = express();
app.use(express.json());

const MongoClient = mongodb.MongoClient;


const url = `mongodb+srv://mv461:uZDFRgnuQ297HPPi@myfirstcluster.5zcjeqz.mongodb.net/`;
const client = new MongoClient(url);

// client.connect()
//  .then(() => console.log('Connected to MongoDB'))
//  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`));

let db;
let collection;
// const THEATERS_GET_FIND_OPTIONS = { theaterId: { $gte: 1, $lte: 50 } };
// const THEATERS_GET_SORT_OPTIONS = { theaterId: 1 };

client.connect()
    .then(() => {
        db = client.db('sample_mflix');
        collection = db.collection('theaters');

        app.listen(options.PORT, () => console.log('Server started on port 3000'));
    })
    .catch(err => console.error(`Failed to connect to MongoDB: ${err}`));

app.get('/theaters', (req, res) => {
    console.log('Before retrieving records')
    collection
        .find()
        .sort(options.THEATERS_GET_SORT_OPTIONS)
        .toArray()
        .then(result => {
            console.log(result);
            // console.log('After retrieving records')
            res.json(result); // Send the result as a JSON response
        })
        .catch(err => console.error(`Failed to retrieve records: ${err}`));
});

app.get('/theater/:theaterId', (req, res) => {
    let theaterId = req.params.theaterId;

    collection.findOne({ theaterId: parseInt(theaterId) })
        .then(result => {
            if (!result) {
                res.status(404).send("Theater not found.");
            } else {
                res.json(result);
            }
        })
        .catch(err => console.error(`Failed to retrieve record: ${err}`));
});

app.put('/updateOneTheater', (req, res) => {

    let theaterId = req.body.the
    let updatedData = req.body;

    collection.updateOne({ theaterId: parseInt(theaterId) }, { $set: updatedData })
        .then(result => {
            if (!result.acknowledged) {
                res.status(500).send('Update operation not acknowledged');
            } else if (result.matchedCount === 0) {
                res.status(404).send('Theater not found');
            } else if (result.modifiedCount === 0) {
                res.status(200).send('No changes made');
            } else {
                res.status(200).send('Theater updated');
            }
        })
        .catch(err => console.error(`Failed to update record: ${err}`));


})


