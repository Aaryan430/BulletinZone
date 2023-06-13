const express = require("express");
const bodyParser = require("body-parser");

const https = require("https");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  // console.log("hello!");

  res.sendFile(__dirname + "/index.html");

  //   res.send("hello!");
});

app.post("/weather", function (req, res) {
  const cityName = req.body.city;
  const apikey = "ef756b276e8c83a4073743efae3c39a0";
  const tempUnit = "metric";
  var url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    apikey +
    "&units=" +
    tempUnit;
  https.get(url, function (response) {
    // console.log(response);
    console.log(response.statusCode);

    if (response.statusCode !== 200) {
      res.send("<html><h1 style=color:#A10035; >Uh ho! Something Went Wrong .<br> Please Try Again!</h1></html>")
    }

    response.on("data", function (data) {
      const weatherData = JSON.parse(data);

      const tempture = weatherData.main.temp;
      // console.log(tempture);

      const weatherDesc = weatherData.weather[0].description;
      // console.log(weatherDesc);

      const weatherIcon = weatherData.weather[0].icon;

      res.write("<html><link rel=stylesheet href=/css/news.css></html>");
      res.write(
        "<html>  <link rel=stylesheet href=/css/nav.css> <ul class=navbar ><li><a href=/>Bulletin Zone</a></li> <li><a href=/>Home</a></li> </ul> </html>"
      );

      const img = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";
      res.write(
        "<html><meta charset=UTF-8><link rel=stylesheet href=/css/weather.css></html>"
      );
      res.write(
        "<html><h2>The Weather is currently " + weatherDesc + ".</h2></html>"
      );
      res.write(
        "<h1>The Temperature of " + cityName + " is " + tempture + " °C.</h1>"
      );
      res.write("<html><img src=" + img + "></html>");
      res.send();
    });
  });
});

// ------------------
app.post("/", function (req, res) {
  // const language=req.body.lang;
  const newsCategory = req.body.Category;
  console.log(newsCategory);
  const newsLang = req.body.Language;
  console.log(newsLang);
  const newsapiKey = "pub_97473da9fe525bbfe9a93ff6ab271295b5de";
  //   var newsUrl ="https://newsdata.io/api/1/news?country=in&apikey=" + newsapiKey;

  var newsUrl =
    "https://newsdata.io/api/1/news?apikey=" +
    newsapiKey +
    "&country=in&language=" +
    newsLang +
    "&category=" +
    newsCategory;

  // var newsUrl ="https://newsdata.io/api/1/news?apikey=pub_97473da9fe525bbfe9a93ff6ab271295b5de&country=in&language=en&category=business";

  https.get(newsUrl, function (response) {
    // console.log(response);
    console.log(response.statusCode);

    if (response.statusCode !== 200) {
      // res.send("failed")
      res.send("<html><h1 style=color:#A10035; >Uh ho! Something Went Wrong .<br> Please Try Again!</h1></html>")
    }

    // response.on("data",function(data){
    //     // console.log(data);
    //     // const newsData = JSON.parse(data)
    //     // const newsData = JSON.parse(JSON.stringify(data));
    //     console.log(newsData);
    //     // res.send();
    // })

    let chunks = [];
    response
      .on("data", function (data) {
        chunks.push(data);
      })
      .on("end", function () {
        let data = Buffer.concat(chunks);
        let newsData = JSON.parse(data);
        // console.log(newsData);
        // const newsLink1=newsData.results[0].link;
        // const newsLink2=newsData.results[2].link;
        // console.log(newsLink1,newsLink2);

        res.write("<html><link rel=stylesheet href=/css/news.css></html>");
        res.write(
          "<html>  <link rel=stylesheet href=/css/nav.css> <ul class=navbar ><li><a href=/>Bulletin Zone</a></li> <li><a href=/>Home</a></li> </ul> </html>"
        );
        res.write(
          "<html><h2>CATEGORY:" + newsCategory.toUpperCase() + "</h2></html>"
        );
        for (var i = 0; i < 8; i++) {
          const newsTitle = newsData.results[i].title;
          const newsLink = newsData.results[i].link;
          const pubsDate = newsData.results[i].pubDate;
          const newsDesc = newsData.results[i].description;
          // console.log(newsTitle);
          res.write(
            "<html><meta charset=UTF-8><h3 lang=hi> " +
              newsTitle +
              ".</h3></html>"
          );

          // res.write("<html><button id=descBtn>Try it</button> <script src=/js/index.js></script></html>")
          res.write("<p>" + newsDesc + "</p>");
          res.write("<p>" + pubsDate + "</p>");
          res.write(
            "<a href=" + newsLink + " target=_blank>Read Full Article</a>"
          );
        }

        // res.write("<html><form action=/ method=post> <button type=submit>Search</button> </form> </html>");
        // const pubsDate=newsData.results[0].pubDate;
        // console.log(pubsDate);
        // res.write("<a href="+newsLink1+">Visit W3Schools.com!</a>");
        res.send();
      });
  });
});


app.listen(process.env.PORT || 3000, function () {
  console.log("server started!");
});
