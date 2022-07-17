const {Router} = require('express');
const Transaction = require('../modals/Transaction')


const router = Router();

router.get('/' , async (req , res) => {
    try {
        const transactions = await Transaction.find()
        if (!transactions) {
            throw new Error('no transaction')
        }
        res.status(200).json(transactions)
    }catch (err) {
        res.send(400).json({message: err.message})
    }
})

router.post('/' , async (req , res) => {
    console.log(req.body)
    const {value}   = req.body;
    const newTransaction = new Transaction({value})

    try {
        const transaction = await newTransaction.save();
        if (!transaction) {
            throw new Error('there was an error saving the transaction')
        }
        res.status(200).json(transaction)
    }catch (err) {
        res.status(500).json({message: err.message})
    }
})

router.delete('/:id' , async (req , res) => {
    const {id} = req.params;
    try {
        const transaction = Transaction.findById(id);

        if (!transaction) {
            throw new Error("no transaction found")
        }
        const removed = await transaction.remove();

        if (!removed) {
            throw new Error('could not remove the transaction')
        }
        res.status(200).json({id})
    }catch (err) {
        res.status(404).json({message: err.message})
    }
})

module.exports = router