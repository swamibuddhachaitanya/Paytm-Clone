//backend\routes\account.js

const { Router } = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { Account } = require("../db/db");
const router = Router();
const mongoose = require("mongoose");

router.get("/balance", authMiddleware, async function (req, res) {
  //? the header should be "authorization" with a 'z' and the value should be Bearer <token> without "" enclosing it
  //the request should hit this endpoint with the right token
  // if the token is right, then the authMiddleware stores the userId in the req.userId
  //next step is to return the balance of the account of the user
  try {
    console.log("hii youre at the balance section the id is "+ req.userId);
    const userId = req.userId;
    //now find the account of the user using this userId
    const accountBalanceFound = await Account.findOne(
      { userId: userId }, //query condition
      { _id: 0, balance: 1 } //field to include in the output
    );
    
    if (accountBalanceFound) {
      console.log("its returning the balance:"+ accountBalanceFound.balance)
      return res.status(200).json({balance:accountBalanceFound.balance});
    } else {
      return res.status(404).json({ message: "Couldnt find the account" });
    }
  } catch (error) {
    res
      .send(500)
      .json({ msg: "getting error while checking balance of the user." });
  }
});

router.post("/transfer", authMiddleware, async function (req, res) {
  //to tranfer from one accont to another
  //req.body contains the userId of the account of the user to be Transfered in 'to'
  // {
  // 	to: string,
  // 	amount: number
  // }
  const session = await mongoose.startSession();
  

  const { to, amount } = req.body;
    
  try {
    session.startTransaction();
    //there can be certain scenarios

    //fetch the account within the transaction
    const account = await Account.findOne({userId: req.userId}).session(session);
    
    //if account is not found or balance is < req amount then abort the session
    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({message: "Insufficient balance"})
    }

    //the to: userId can be invalid
    const toAccount = await Account.findOne({userId: to}).session(session);

    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        })
    }   
    //perform the transfer
    await Account.updateOne({userId: req.userId},{$inc: {balance: -amount } }).session(session);
    await Account.updateOne({userId: to},{$inc:{balance: amount}}).session(session);
    
    //commit the transaction
    await session.commitTransaction();
    return res.status(200).json({message: "Transfer successful"});

  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({error: "error occurred during transfer."})
  }
});

module.exports = router;
