const fs = require('fs');
const http = require('http');
const url = require('url');
// const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8")
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8")
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8")

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8")
const dataObj = JSON.parse(data);

// const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
// console.log(slugs);

const server = http.createServer((req,res) =>{
    // console.log(req.url)
    // console.log(url.parse(req.url , true))
    const { query , pathname } = url.parse(req.url , true);

    // overview page
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200 , {
            'Content-type': 'text/html'
        })
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard , el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}' , cardsHtml)
        // console.log(cardsHtml);
        
        res.end(output);
    }
    
    // product page
    else if(pathname === '/product'){
        res.writeHead(200 , {
            'Content-type': 'text/html'
        })
        const product = dataObj[query.id];  // dataObj is an array
        const output = replaceTemplate(tempProduct , product)
        res.end(output);
    }
    // else if(pathname === '/api'){
    //     fs.readFile(`${__dirname}/dev-data/data.json`, "utf-8" , (err , data) =>{
    //         const productData = JSON.parse(data);
    //         // console.log(productData)
    //         res.writeHead(200 , {
    //             // 'Content-type': 'text/html'
    //             'Content-type': 'application/json'
    //         })
    //         res.end(data);
    //     })
    // }

    // API
    else if(pathname === '/api'){
            res.writeHead(200 , {
                'Content-type': 'application/json'
            })
            res.end(data);
    }

    // NOT found
    else{
        res.writeHead(404 , {
            'Content-type' : 'text/html',
            'my-own-header': 'hello-world'
        })
        res.end("<h1>Page Not found</h1>");
    }
})

server.listen(8000 ,'127.0.0.1', ()=>{
    console.log("Listening to requests on port 8000");
})