
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const user = require('./user.js');

mongoose.connect('mongodb+srv://22h51a6747:M7mRjpxtyEdiTJCo@cluster0.axcsud9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
const app = express()

app.set('view engine', 'ejs')

const port = 3000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


app.use(express.static('src'))
app.use('/static',express.static('static'))

app.post('/saveData', async (req, res) => {
  console.log("Using Body-parser: ", req.body.nam, req.body.prc, req.body.qyt);

  try {
    const print = new user({
      name: req.body.nam,
      price: req.body.prc,
      quantity: req.body.qyt,
    });

    await print.save();
    console.log('User saved successfully');

    const fop = await user.find({});
    console.log(fop);

    res.render(__dirname + '/src/add.ejs', { fop });
  } catch (error) {
    console.error('Error saving user:', error);
    // Handle the error appropriately (e.g., send an error response)
    res.status(500).send('Error saving user');
  }
});

app.post('/findbill', async (req, res) => {
  console.log("Using Body-parser: ", req.body.bilf);

  try {

    const bin =req.body.bilf
    const npp = await user.find({name:bin});
    console.log(npp);

    res.render(__dirname + '/src/bill.ejs', {npp});
  } catch (error) {
    console.error('Error saving user:', error);
    // Handle the error appropriately (e.g., send an error response)
    res.status(500).send('Error bill');
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/home.html')
})

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/src/test.html')
})

app.get('/out', (req, res) => {
  res.send('thank you')
})

app.get('/add', async(req, res) => {
  const fop = await user.find({});
  res.render(__dirname + '/src/add.ejs',{fop});
})
app.get('/bill', async(req, res) => {
  const bin=0;
  const npp = await user.find({name:bin})
  res.render(__dirname + '/src/bill.ejs', {npp});
})
app.get('/dash', (req, res) => {
  res.render(__dirname + '/src/dash.ejs');
})


app.get('/bil', async (req, res) => {
  try {
    const items = await user.find(); // Fetch all items from the database
    res.render(__dirname + '/src/billing.ejs', { items }); // Render the EJS template with the fetched items
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching items');
  }
});


// Assuming you have the product and user schemas defined elsewhere

app.post('/updateBill', async (req, res) => {
  try {
    const productIds = req.body['productIds[]'];
  const quantities = req.body['quantities[]'];
    console.log(req.body);
  
    // productIds is an array of product IDs, e.g. ["id1", "id2", "id3"]
    // quantities is an array of quantities, e.g. [1, 2, 3]
  
    // Do something with the product IDs and quantities arrays
    console.log(productIds);
    console.log(quantities);

    if (!Array.isArray(productIds) || !Array.isArray(quantities)) {
      return res.status(400).send('Invalid input format');
    }

    let totalBill = 0;

    for (let i = 0; i < productIds.length; i++) {
      const productId = productIds[i];
      const quantity = parseInt(quantities[i], 10);

      if (quantity > 0) {
        const product = await user.findById(productId);
        if (!product) {
          return res.status(404).send(`Product with ID '${productId}' not found`);
        }

        if (quantity > product.quantity) {
          return res.status(400).send(`Insufficient quantity available for product '${product.name}'`);
        }

        const billAmount = product.price * quantity;
        totalBill += billAmount;

        const updatedQuantity = product.quantity - quantity;
        await user.updateOne({ _id: productId }, { quantity: updatedQuantity });
        let dbbil=product.bill
        if(dbbil==null){
          dbbil=0;
        }
        const rem = quantity+dbbil;
        await user.updateOne({ _id: productId }, { bill:rem});

      }
    }

    res.send(`Total bill amount:₹${totalBill}`);
  } catch (error) {
    console.error('Error updating bill:', error);
    res.status(500).send('Error updating bill');
  }
});

app.post('/login', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (username === 'admin' && password === 'admin') {
    res.render(__dirname + '/src/dash.ejs',{hello:"i am in ejs"});
  }
  else {
      res.send("incorrect username or password")
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
