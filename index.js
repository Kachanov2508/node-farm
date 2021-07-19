const fs = require("fs");
const http = require("http");
const url = require("url");

const slugify = require('slugify')
const replaceTempate = require('./modules/replaceTempate')

///////////////////////////////////////////////////////////////////////////
// FILE

// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(textIn)
// const texrOut = `This is what we know thw awocado ${textIn}.\nCreated on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt', texrOut);
// console.log('File writen!')

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2)
//         fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
//             console.log(data3)

//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('File has been written')
//             })
//         })
//     })
// })

// console.log('will read file!')

///////////////////////////////////////////////////////////////////////////
// SERVER



const templateOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const templateCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
const templateProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);


const slugs = dataObj.map(el => slugify(el.productName, {lower: true}))
console.log(slugs)


console.log(slugify('Fresh avocado', {lower: true}))

const server = http.createServer((req, res) => {
    const {query, pathname} = url.parse(req.url, true)
    console.log(query)

	// Overview page
	if (pathname === "/" || pathname === "/overview") {
        res.writeHead(200, { "Content-type": "text/html" });

        const cardsHtml = dataObj.map((el) => replaceTempate(templateCard, el)).join('')
        const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)
		res.end(output);

	// Product page
	} else if (pathname === "/product") {
        res.writeHead(200, { "Content-type": "text/html" });
        const product = dataObj[query.id]
        const output = replaceTempate(templateProduct, product);
		res.end(output);

	// API
	} else if (pathname === "/api") {
		res.writeHead(200, { "Content-type": "application/json" });
		res.end(data);

	// Not found
	} else {
		res.writeHead(404, { "Content-type": "text/html" });
		res.end("<h1>Page not found!</h1>");
	}
});

server.listen(8000, "127.0.0.1", () => {
	console.log("Listening to requests on port 8000");
});
