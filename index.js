const express = require('express');
const app = express();
app.use(express.json());
const PORT = 3000;


let envelopes = [
  { id: 1, category: 'Groceries', budget: 200 },
  { id: 2, category: 'Entertainment', budget: 50 },
];
let nextId = 3; //

app.get('/', (req, res) => {
    res.send('Helloooooo');
});

app.get('/envelopes', (req, res) => {
    res.status(200).json(envelopes);
});

app.get('/envelopes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const envelope = envelopes.find(e => e.id === id);
    if(!envelope){
        res.status(404).send( {error: 'This envelope does not exist'});
    }
    res.status(200).json(envelope);
})

app.post('/envelopes', (req, res) => {
    const {category, budget} = req.body;

    if (!category || typeof budget !== 'number'){
         return res.status(400).json({ error: 'Category (string) and budget (number) are required' });
    }

    const newEnvelope = {
        id: nextId,
        category,
        budget,
    };

    envelopes.push(newEnvelope);
    res.status(201).json(newEnvelope);

});

app.put('/envelopes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const envelope = envelopes.find(e => e.id === id);

    if (!envelope){
       return res.status(404).json({error : 'Not id found'});
    }

    const {category, budget} = req.body; 
    if (!category || typeof budget !== 'number') {
        return res.status(400).json({ error: 'Category (string) and budget (number) are required' });
    }

    envelope.category = category;
    envelope.budget = budget;

    res.status(200).json(envelope);
});

app.delete('/envelopes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const envelope = envelopes.find(e => e.id === id)

    if(!envelope){
        return res.status(404).json({error: 'not found'});
    }
    envelopes = envelopes.filter(e => e.id !== id);
    res.status(200).json(envelope);
})

app.patch('/envelopes/:id/balance', (req, res) => {
    const id = parseInt(req.params.id);
    const envelope = envelopes.find(e => e.id === id);

    if(!envelope){
        return res.status(404).json({error: 'not found'});
    }

    const {amount} = req.body;

    if(typeof amount !== 'number') {
        return res.status(400).json({ error: 'Amount has to be a valid number' });
    }

    if((envelope.budget + amount)< 0){
        return res.status(400).json('insufficient funds');
    }

    envelope.budget += amount;
    res.status(200).send(envelope);

})

app.listen(PORT, () => {
    console.log(`Server is running on....`);
})

