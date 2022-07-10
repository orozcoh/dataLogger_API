const express = require('express');
//const validatorHandler = require('../middlewares/validator.handler');
const DataService = require("../services/data.service");
//const { createProductSchema, updateProductSchema, getProductSchema } = require("../schemas/product.schema");

const router = express.Router();
router.use(express.json());
const data_service = new DataService();

const mongoose = require('mongoose');

// -------------------------------- mongodb ------------------------------------

const db_user = "User0"
const db_pass = "UserPass"
const db_port = "27017"
const db_name = "DataLogger"

const db_api2_path =  "mongodb://" + db_user + ":" + db_pass + "@localhost:" + db_port + "/" + db_name

mongoose.Promise = global.Promise;

mongoose.connect(db_api2_path).then(db => console.log("DB Connected to:", db.connection.host)).catch(err => console.error(err));

// -------------------------------------------------------------------------------------
// --------------------------------------- GET -----------------------------------------

router.get('/', async (req,res) => {
  try{
    const { id } = req.body;
    const data = await data_service.getData();
    res.json(data);
  } catch(error){
    res.status(404).json({
      message : "Something went wrong"
    });
  }
});

router.get('/getAll', async (req,res) => {
  try{
    const data_list = await data_service.getAllData();  //const data_list = await data_service.getAll();
    res.json(data_list);
  } catch(error){
      res.status(404).json({
        message : "Something went wrong"
      });
  }
});

router.get('/getLast', async(req, res, next) => {
  try{
    const last = await data_service.getLast();
    if (last === -1){
      res.status(404).json({message: "Error retrieving last data"});
    }
    else{
      res.status(200).json(last);
    }
  }
  catch(error) {
    //next(error);
    res.status(404).json({
      message : "Something went wrong, GET method does not need body"
    });
  }
});

router.get('/lastUpdated', async(req, res, next) => {
  try{
    const lastUpdate = await data_service.lastUpdated();
    res.status(200).json(lastUpdate);
  }
  catch(error) {
    //next(error);
    res.status(404).json({
      message : "Something went wrong, GET method does not need body"
    });
  }
});

router.get('/:id', async (req,res, next) => {
  try {
    const { id } = req.params;
    //console.log(id);
    const data = await data_service.getOne(parseInt(id));  //parseInt(id)
    if (data === -1){
    res.status(404).json({message: "ID not found", id: id});
    }
    else{
    res.status(200).json(data);
    }
  } catch (error) {
    //console.log("error");
      //next(error);
      res.status(404).json({
        message : "Something went wrong, GET method does not need body"
      });
  }
});
// ------------------------------------------------------------------------------------
// -------------------------------------- POST ----------------------------------------

router.post('/', async (req, res, next) => {
  try{
    const body  = req.body;
    if (whiteList_ApiKeys.includes(body[0]["API_KEY"])){
      //console.log("POST from: " + body[1]["Device ID"]);          //<<<<<<<<<<<<<< LOG POST DEVICE_ID
      // verify validity of data arriving
      const newData = await data_service.postData2mongo(body[1]);
      //console.log("done");
      //const newData = await data_service.create(body[1]);
      res.status(201).json([{"New Data (POST)": newData}]);
    }
    else{
      res.status(404).json({
        message : "Device is not allowed to POST - Wrong API_KEY"
      });
    }
  } catch(error) {
      //next(error);
      res.status(404).json({
        message : "Something went wrong, body might be needed with API_KEY"
      });
  }
});
// -------------------------------------------------------------------------------------
// ------------------------------------- DELETE ----------------------------------------

router.delete('/:ts', async (req,res) => {

  try{
    const { ts } = req.params;
    const body  = req.body;
    //console.log("ts: ", ts);
    //console.log("data:", body);

    if (whiteList_Users.includes(body["API_KEY"])){
      //console.log("DELETE from: " + body["API_KEY"]);          //<<<<<<<<<<<<<< LOG POST DEVICE_ID
      const dataDel = await data_service.delete(ts);
      //console.log("res:", dataDel);
      if (dataDel === null){
        res.status(404).json({
          message : "TimeStamp not found",
          timestamp: ts
        });
      }else {
        res.json({
          message : "Data deleted",
          timestamp: ts,
          data: dataDel
        });
      }
    }
    else{
      res.status(404).json({
        message : "User is not allowed to DELETE or PATCH - Wrong API_KEY"
      });
    } 
  } catch(error){
      //next(error);
      res.status(404).json({
        message : "Something went wrong, body might be needed with API_KEY"
      });
  }
});
// -------------------------------------------------------------------------------------
// -------------------------------------- PATCH ----------------------------------------

router.patch('/:ts',async (req,res) => {
  try {
    const { ts } = req.params;
    const body = req.body;
    //console.log("body:", body[1])
    if (whiteList_Users.includes(body[0]["API_KEY"])){
      //console.log("PATCH from: " + body[0]["API_KEY"]);               //<<<<<<<<<<<<<< LOG POST DEVICE_ID
      const data = await data_service.update(ts, body[1]);
      if (data === -1){
        res.status(404).json({message: "timeStamp not found", timestamp: ts});
      } else {
        res.json(data);
      }
    }
    else{
      res.status(404).json({
        message : "User is not allowed to DELETE or PATCH - Wrong API_KEY"
      });
    } 
  } catch(error){
      //next(error);
      res.status(404).json({
        message : "Something went wrong, body might be needed with API_KEY"
      });
  }
});
// -------------------------------------------------------------------------------------

module.exports = router;