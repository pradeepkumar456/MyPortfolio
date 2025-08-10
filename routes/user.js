const express = require('express');
const router = express.Router();

router.get('/resume', (req, res) => {
    res.render('routes/resume.ejs');
});

router.get("/project",(req,res)=>{
    res.render("routes/project.ejs")
});

router.get("/about", (req, res) => {    
res.render("routes/about.ejs");
});

router.get("/contact", (req, res) => {
    res.render("routes/contactUs.ejs");   
}); 

module.exports = router;