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
  const data = await data_service.getData();
  res.json(data);
});

router.get('/get-all', async (req,res) => {
  const data_list = await data_service.getAllData();
  res.json(data_list);
});

router.get('/:id', async (req,res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const data = await data_service.getOneData(parseInt(id));  //parseInt(id)
    if (data === -1){
    res.status(404).json({message: "URL not found", id: id});
    }
    else{
    res.status(200).json(data);
    }
  } catch (error) {
    console.log("error");
      next(error);
  }
});
// ------------------------------------------------------------------------------------
// -------------------------------------- POST ----------------------------------------

router.post('/', async (req, res) => {
    const body  = req.body;
    const newData = await data_service.create(body);

    res.status(201).json(newData);
});
// -------------------------------------------------------------------------------------
// ------------------------------------- DELETE ----------------------------------------

router.delete('/:id', async (req,res) => {
  const { id } = req.params;
  const dataDel = await data_service.delete(parseInt(id));

  if (dataDel === -1){
    res.status(404).json({
      message : "URL not found",
      id: id
    });
  }else {
    res.json({
      message : "URL deleted",
      id: prodDel
    });
  }
});
// -------------------------------------------------------------------------------------
// -------------------------------------- PATCH ----------------------------------------

router.patch('/:id',async (req,res) => {
  const { id } = req.params;
  const body = req.body;
  const data = await data_service.update(parseInt(id), body);
  if (data === -1){
    res.status(404).json({message: "Product not found", id: id});
  } else {
    res.json(data);
  }
});
// -------------------------------------------------------------------------------------

module.exports = router;