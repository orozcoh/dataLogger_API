const express = require('express');
//const validatorHandler = require('../middlewares/validator.handler');
const DataService = require("../services/data.service");
//const { createProductSchema, updateProductSchema, getProductSchema } = require("../schemas/product.schema");

const router = express.Router();
router.use(express.json());
const data_service = new DataService();

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
    const data_list = await data_service.getAll();
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
      console.log("POST from: " + body[1]["Device ID"]);          //<<<<<<<<<<<<<< LOG POST DEVICE_ID
      const newData = await data_service.create(body[1]);
      res.status(201).json(newData);
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

router.delete('/:id', async (req,res) => {

  try{
    const { id } = req.params;
    const body  = req.body;

    if (whiteList_Users.includes(body["API_KEY"])){
      console.log("DELETE from: " + body["API_KEY"]);          //<<<<<<<<<<<<<< LOG POST DEVICE_ID
      const dataDel = await data_service.delete(parseInt(id));
      if (dataDel === -1){
        res.status(404).json({
          message : "ID not found",
          id: id
        });
      }else {
        res.json({
          message : "Data deleted",
          id: id
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

router.patch('/:id',async (req,res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    if (whiteList_Users.includes(body[0]["API_KEY"])){
      console.log("PATCH from: " + body[0]["API_KEY"]);               //<<<<<<<<<<<<<< LOG POST DEVICE_ID
      const data = await data_service.update(parseInt(id), body[1]);
      if (data === -1){
        res.status(404).json({message: "ID not found", id: id});
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