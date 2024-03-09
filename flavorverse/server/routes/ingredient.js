/* eslint-disable no-undef */
const express = require("express");

const ingredientRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

ingredientRoutes.route('/add_recipe').get(async function (req, res) {
    let db_connect = dbo.getDb();
    let myquery = {};
    const results = await db_connect.collection('ingredients').find(myquery).toArray();
    if (!results) return res.json(false);
    return res.json(results);
})

// ingredientRoutes.route('/ingredient').post(async function (req, res) {

// })

module.exports = ingredientRoutes;