// -------------------------------- model ------------------------------------
const mongoose = require('mongoose');
	
const Schema = mongoose.Schema;

const mySchema = new Schema({
  timestamp: Number,
  device_ID: String,
  temp: Number,
  humidity: Number,
  light: Number,
  
}, { collection: 'Invernadero' }, { versionKey: false });

const Model = mongoose.model('invernadero', mySchema);

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------

class DataService {

  constructor() {
    this.nDataGet = 60;
    this.last_id = -1;
    this.data = [];
    //this.create_1st_block();
  }

  create_1st_block() {
    const timestamp = Date.now();
    for (let i=0; i<100; i++){
      this.data.push({
        id: this.last_id + 1, //faker.datatype.uuid(),
        timestamp: timestamp,
        "Temp (°C)": "20.40",
        "Humidity (%)": "84.00",
        "Light": "0"
      });
      this.last_id += 1;
    }
  }

  async postData2mongo(data){
    const timestamp = Math.floor(Date.now()/1000);
    const newDataLog = {
        timestamp: timestamp,
        ...data

    }
    this.last_id += 1;
    const data2post = new Model(newDataLog);
    try{
      await data2post.save();                             // how to get status of connection to mongo before .save()
      return newDataLog;
    }
    catch {
      return "something went wrong with mongo";
    }

  }

  // async create(data) {
  //   const size = this.last_id + 1;
  //   const timestamp = Date.now();
  //   const newDataLog = {
  //       //id: size,
  //       timestamp: timestamp,
  //       ...data

  //   }
  //   this.data.push(newDataLog);
  //   this.last_id += 1;
  //   return newDataLog;
  // }

  async getData() {
      const data = await Model.find().sort({ _id: -1 }).limit(60)
      return data;    // this.data.slice(this.data.length - this.nDataGet, this.data.length)
  }

  async getAllData(){
    const data = await Model.find();
    return data;
  }

  // async getAll() {
  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //         resolve(this.data);
  //     }, 50);
  //   });
  //   //return this.urls;
  // }

  async getOne(ts) {
    //console.log(id);
    const oneData = Model.where('timestamp').gte(ts-250).lte(ts+250);
    return oneData;
  }

  async getLast(){
    const lastData = await Model.find().sort({ _id: -1 }).limit(1);
    return lastData;
  }

  async lastUpdated() {
    const DateNow = Math.floor(Date.now()/1000);
    const _date = await this.getLast()
    const lastUpdate = _date[0]["timestamp"];
    const difference = (DateNow - lastUpdate);
    
    let output = ``;
    if (difference < 60) {
        // Less than a minute has passed:
        output = `${difference} seconds ago`;
    } else if (difference < 3600) {
        // Less than an hour has passed:
        output = `${Math.floor(difference / 60)} minutes ago`;
    } else if (difference < 86400) {
        // Less than a day has passed:
        output = `${Math.floor(difference / 3600)} hours ago`;
    } else {
        // Less than a month has passed:
        output = `${Math.floor(difference / 86400)} days ago`;
    }
    return output;
  }

  async delete(id) {
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
        return -1;
    }
    const prod = this.data[index];
    this.data.splice(index, 1);
    return prod;
  }

  async update(id, changes) {
    const index = this.data.findIndex(item => item.id === id);
    //console.log(changes);
     if (index === -1) {
         return -1;
     } else {
      const  prod = this.data[index];
      this.data[index] = {
          ...prod,
          ...changes
      };
      return this.data[index];
     }
 }
}

module.exports = DataService;