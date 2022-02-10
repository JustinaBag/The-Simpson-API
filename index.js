//darbas su failais
const fs = require('fs');
//darbas su serveriu
const http = require('http');
//darbas su routeriu
const url = require('url');

//sudedam i HTML templates duomenis
// {
//     "id":0,
//     "name": "Homer",
//     "position": "Junior JavaScript Dev"
// },

//{%IMG%}/g
const replaceTemplate = (temp, el) => {
    let output = temp.replace(/{%NAME%}/g, el.name);
    output = output.replace(/{%POSITION%}/g, el.position);
    output = output.replace(/{%ID%}/g, el.id);
    output = output.replace(/{%IMAGE%}/g, el.img);
    output = output.replace(/{%TEAM%}/g, el.team);
    output = output.replace(/{%DESCRIPTION%}/g, el.description);
    return output;
}

//2
//skaitome ir įkeliame templates
const tempIndex = fs.readFileSync("./templates/index.html", "utf-8");
const tempError = fs.readFileSync("./templates/template-error.html", "utf-8");
const tempCard = fs.readFileSync("./templates/template-card.html", "utf-8");
const tempPerson = fs.readFileSync("./templates/template-person.html", "utf-8");


//1 skaitome is failo duomenis tik viena karta
const data = fs.readFileSync("./templates/data.json", "utf-8");
const dataObj = JSON.parse(data);


//sukuriam serveri
const server = http.createServer((req, res) => {

    //kaip paimti ID
    // const {query, pathname} = url.parse(req.url, true);
    // console.log(query);

    const {
        query,
        pathname
    } = url.parse(req.url, true);
    //const pathname = req.url;
    //index

    if (pathname == "/" || pathname == "/index" ) {
        res.writeHead(200, {
            "Content-type": "text/html"
        });

        const pleopleCards = dataObj.map(el => replaceTemplate(tempCard, el)).join("");
        // console.log(pleopleCards);
        const newTempIndex = tempIndex.replace("{%PEOPLE_CARDS%}", pleopleCards);

        res.end(newTempIndex);

        //person page
    } else if (pathname === "/person" && dataObj[query.id]) {
        res.writeHead(200, {
            "Content-type": "text/html"
        });
        const person = dataObj[query.id];
        const output = replaceTemplate(tempPerson, person);
        res.end(output);

        //API
        } else if (pathname === "/api") {
            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            res.end(data);

        //ERROR 404
    } else {
        res.writeHead(404, {
            "Content-Type": "text/html"
        });
        res.end(tempError);
    }

    // 1
    // http://127.0.0.1:8000/index.html
    // Naršyklėje matysime: 
    // res.end("Serveris veikia :)");

});


server.listen(8004, "127.0.0.1", () => {
    // Terminale matysime:
    console.log("Klausome, ką paduosi į port 8002");
});


