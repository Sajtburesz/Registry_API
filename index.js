const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();


// Some swagger config based on a tutorial I found
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Registry API',
            version: '1.0.0',
            description: 'API for managing a registry set'
        },
        servers: [
            {
                url: 'http://localhost:3000'
            }
        ]
    },
    apis: ['./index.js']
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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

/**
 * @swagger
 * /add:
 *   post:
 *     summary: Add an item to the registry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               item:
 *                 type: string
 *     responses:
 *       204:
 *         description: Item added successfully
 *       422:
 *         description: Invalid item format
 */
app.post("/add", (req, res, next) => {
    const { item }  = req.body;

    if (typeof item === "string" && isAlphanumeric(item)){
        registry.addToRegistry(item);
        res.sendStatus(204).end();
    } else {
        res.status(422).json({ error: 'Item contains non alphanumeric characters or item is not a string.' });
    }

});

/**
 * @swagger
 * /remove/{item}:
 *   delete:
 *     summary: Remove an item from the registry
 *     parameters:
 *       - in: path
 *         name: item
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Item removed successfully
 *       422:
 *         description: Invalid item format
 */
app.delete("/remove/:item", (req, res, next) => {
    const item = req.params.item;

    if (typeof item === "string" && isAlphanumeric(item)){
        registry.removeFromRegistry(item);
        res.sendStatus(204).end();
    } else {
        res.status(422).json({ error: 'Item contains non alphanumeric characters or item is not a string.' });
    }

});

/**
 * @swagger
 * /invert:
 *   post:
 *     summary: Invert the registry
 *     responses:
 *       200:
 *         description: Registry inverted
 */
app.post("/invert", (req, res, next) => {

    registry.invertRegistry();
    
    res.status(200).json({ message: `Registry is inverted: ${registry.getInverted()}.` });

});

/**
 * @swagger
 * /check/{item}:
 *   get:
 *     summary: Check if an item is in the registry
 *     parameters:
 *       - in: path
 *         name: item
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item is in the registry
 *       400:
 *         description: Item is not in the registry
 *       422:
 *         description: Invalid item format
 */
app.get("/check/:item", (req, res, next) => {
    const item = req.params.item;

    if (typeof item === "string" && isAlphanumeric(item)){
        if ( registry.checkItem(item) == 1){
            res.status(200).json({ message: `${item} is in the registry.` });
        } else {
            res.status(400).json({ message: `${item} is not in the registry.` });
        }
    } else {
        res.status(422).json({ error: 'Item contains non alphanumeric characters or item is not a string.' });
    }
});

/**
 * @swagger
 * /diff:
 *   post:
 *     summary: Get the difference between the registry and a provided set
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Diff was successful
 *       422:
 *         description: Invalid items format
 */
app.post("/diff", (req, res, next) => {
    const { items }  = req.body;

    if (Array.isArray(items) || items instanceof Set) {
        for (let i of items) {
            if (typeof i === "string" && isAlphanumeric(i)){
                continue;
            }else {
                return res.status(422).json({ error: `${i} in provided set is not a string or is not alphanumerical.` });
            }
        }
    } else{
        return res.status(422).json({ error: 'Items is not a list or a set.' });
    }

    const diff_registry = new Set(items);
    const diff_items = Array.from(diff_registry).filter(item => !registry.getRegistry().has(item)); 
    res.status(200).json({diff: diff_items});


});


// Function for check if string is alphanumeric using regex.
function isAlphanumeric(str) {
    return /^[a-zA-Z0-9]+$/.test(str);
}