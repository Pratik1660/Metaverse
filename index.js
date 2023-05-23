const express = require('express');
const app = express();
const port= 8000;

//setup library express-ejs-layouts for creating layout 
const expressLayouts = require('express-ejs-layouts');
app.use(express.static('./assests'));
app.use(expressLayouts);

//extract style & script from the sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


//use express router
app.use('/', require('./routes'));

//setup the view engine
app.set('view engine', 'ejs');
app.set('views', './views')

app.listen(port, function(err){ 
    if(err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});