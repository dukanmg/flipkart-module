const router=require('express').Router();
const fk = require('./scapper')

//check
router.get('/check',(req,res)=>{
    res.send('server ready and running')
})



// Flipkart Live data 
router.post('/flipkartlivedatabyurl',fk.flipkartlivedatabyurl)

module.exports=router;