/* eslint-disable no-undef */
const { MongoClient, ServerApiVersion } = require("mongodb");
const Db = process.env.ATLAS_URI;
const client = new MongoClient(Db, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

var _db;

module.exports = {
    connectToServer: async function () {
        try {
            await client.connect();
        } catch (e) {
            console.error(e);
        }

        _db = client.db("FlavorVerse");
        if (_db) {
            console.log("Successfully connected to the database");
        }
        else {
            console.log("There was an error connecting to the database");
        }
        return (_db === undefined ? false : true);
    },

    getDb: function () {
        return _db;
    },
};