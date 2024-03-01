const fileSys = require("fs");
const httpReq = require("http");
const url = require('url');
const events = require('events');
const eventEmitter = new events.EventEmitter();



// we can also write fileSys obj inside create server also but it will call every time when my createServer is called so, write it outside of it
const overviewData = fileSys.readFileSync("./template-overview.html", "utf-8");
const templateCardData = fileSys.readFileSync("./template-card.html", "utf-8");
const templateProductData = fileSys.readFileSync("./template-product.html", "utf-8");
const dataObj = fileSys.readFileSync("./data.json", "utf-8");
const result = JSON.parse(dataObj);

const templateFunction = (template, apiData) => {
  let output = template.replace(/{%PRODUCTNAME%}/g, apiData.productName);
  output = output.replace(/{%IMAGE%}/g, apiData.image);
  output = output.replace(/{%QUANTITY%}/g, apiData.quantity);
  output = output.replace(/{%PRICE%}/g, apiData.price);
  output = output.replace(/{%ID%}/g, apiData.id);
  output = output.replace(/{%DESCRIPTION%}/g, apiData.description);
  output = output.replace(/{%NUTRIENTS%}/g, apiData.nutrients);
  output = output.replace(/{%FROM%}/g, apiData.from);

  if (!apiData.organic) output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  return output;
};


let serverData = httpReq.createServer((req, res) => {
  const entirePathName = req.url
  const { query, pathname } = url.parse(req.url, true);  // parse is default method provided by url module true indicates that query parameters should parsed into an object

  // console.log(pathname, search)
  if (pathname === "/" || pathname === "/overview") {
    let myEventHandler = function () {
      console.log('I hear a scream!');
    }
    
    //Assign the eventhandler to an event:
    eventEmitter.on('scream', myEventHandler);
    
    //Fire the 'scream' event:
    eventEmitter.emit('scream');
    res.writeHead(200, { "content-type": "text/html" });
    let jsonData = result
      .map((el) => templateFunction(templateCardData, el))
      .join("");
    let resultData = overviewData.replace(/{%PRODUCT_CARDS%}/g, jsonData);
    res.end(resultData);
  } else if (pathname === "/product") {
    res.writeHead(200, { "content-type": "text/html" });
    const product = result[query.id];  // this query.id will give 0, 1, 2, 3 (what ever we pass in the query params of url)
    const output = templateFunction(templateProductData, product)
    res.end(output)
    // res.end("I am from products page");
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "content-type": "application/json",
    });
    res.end(dataObj);
  } else {
    res.writeHead(404, {
      "content-type": "text.html",
    });

    res.end("<h1>page not found!</h1>");
  }
});
serverData.listen(3001);
