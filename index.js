const express=require('express')
const app=express();
const bodyParser=require('body-parser')
const route=require('./routes')
const port=process.env.PORT || 4100;
var cors = require('cors')


// app.use(express.urlencoded({ extended: true , limit:'50mb'}));
// app.use(express.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({ extended: true ,limit:'50mb'}));
app.use(bodyParser.json({limit:'50mb'}));
app.use(cors());
app.use('/',route);

app.listen(port,()=>{
    console.log("server started : ",port)
})