
class DataService {

  constructor() {
    this.nDataGet = 60;
    this.last_id = -1;
    this.data = [];
    this.create_1st_block();
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

  async create(data) {
    const size = this.last_id + 1;
    const timestamp = Date.now();
    const newDataLog = {
        id: size,
        timestamp: timestamp,
        ...data

    }
    this.data.push(newDataLog);
    this.last_id += 1;
    return newDataLog;
  }

  async getData() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.data.slice(this.data.length - this.nDataGet, this.data.length));
      }, 50);
    });
    //return this.urls;
  }

  async getAllData() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
          resolve(this.data);
      }, 50);
    });
    //return this.urls;
  }

  async getOneData(id) {
    console.log(id);
    const index = this.data.findIndex(item => item.id === id);
    //const a = this.funcionQueRompe();
    const prod = this.data.find(item => item.id === id);
    console.log(prod)
    if (index === -1){
      return -1;
    }
    else{
      return prod;
    }
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
    console.log(changes);
     if (index === -1) {
         return -1;
     } else {
      const url = this.data[index];
      this.urls[index] = {
          ...url,
          ...changes
      };
      return this.data[index];
     }
 }
}

module.exports = DataService;