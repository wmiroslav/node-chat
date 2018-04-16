
const path = require('path');
const express = require('express');
const app = express();

const publicPath = path.join(__dirname, '..', 'public')
app.use(express.static(publicPath)); // express static middleware
                                    // da uzima index.html iz public foldera

                                    
                                    

const port = process.env.port || 3000;
app.listen(port, ()=>{
    console.log('Listening on ' + port);
})



