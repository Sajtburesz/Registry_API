const express = require('express');
const app = express();

// Start application
app.listen(3000, () => {
 console.log("Server running on port 3000");
});
app.use(express.json());

// Registry DataType
class Registry {
    constructor() {
      this.registry = new Set();
      this.inverted = false;
    }
   
    getRegistry() {
      return this.registry;
    }

    addToRegistry(item){
        this.registry.add(item);
    }

    removeFromRegistry(item){
        this.registry.delete(item);
    }

    getInverted(){
        return this.inverted;
    }

    setInverted(bool){
        this.inverted = bool;
    }
}



const registry = new Registry();



app.post("/add", (req, res, next) => {
    const { item }  = req.body;
    console.log(item);
});