const express = require('express');
const router = express.Router();

router.get('/hotelbookingproject', (req, res) => {
    res.render('projects/booking.ejs');
});

router.get("/portfolioproject", (req, res) => {  
    res.render("projects/portfolio.ejs");
});

module.exports = router;