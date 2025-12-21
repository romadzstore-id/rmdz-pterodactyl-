const express = require('express');
const app = express();
app.use(express.json());

app.post('/create-invoice',(req,res)=>{
  res.json({invoice:"INV123"});
});

app.get('/check-payment',(req,res)=>{
  setTimeout(()=>{
    res.json({
      status:"SUCCESS",
      data:{
        url:"https://panel.romadzstore.com",
        password:"AutoPass123!"
      }
    });
  },1000);
});

app.listen(3000,()=>console.log("Server running"));