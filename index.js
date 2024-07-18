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

    invertRegistry(){
        this.inverted = !this.inverted;
    }

    checkItem(item){
        return this.inverted + this.registry.has(item);
    }
}



const registry = new Registry();


app.post("/add", (req, res, next) => {
    const { item }  = req.body;

    if (typeof item === "string" && isAlphanumeric(item)){
        registry.addToRegistry(item);
        res.sendStatus(204).end();
    } else {
        res.status(422).send('Item contains non alphanumeric characters or item is not a string.');
    }

});

app.delete("/remove/:item", (req, res, next) => {
    const item = req.params.item;

    if (typeof item === "string" && isAlphanumeric(item)){
        registry.removeFromRegistry(item);
        res.sendStatus(204).end();
    } else {
        res.status(422).send('Item contains non alphanumeric characters or item is not a string.');
    }

});

app.post("/invert", (req, res, next) => {

    registry.invertRegistry();
    
    res.status(200).send('Registry is inverted: ' + registry.getInverted() + '.');

});

app.get("/check/:item", (req, res, next) => {
    const item = req.params.item;

    if (typeof item === "string" && isAlphanumeric(item)){
        if ( registry.checkItem(item) == 1){
            res.status(200).send( item + ' is in the registry.');
        } else {
            res.status(400).send( item + ' is not in the registry.');
        }
    } else {
        res.status(422).send('Item contains non alphanumeric characters or item is not a string.');
    }
});

app.post("/diff", (req, res, next) => {
    const { items }  = req.body;
});


// Function for check if string is alphanumeric using regex.
function isAlphanumeric(str) {
    return /^[a-zA-Z0-9]+$/.test(str);
}