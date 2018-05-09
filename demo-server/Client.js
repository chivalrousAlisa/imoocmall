var http = require("http");
http.get('http://www.imooc.com/u/card',(res) => {
  var data = '';
  res.on('data',(chunk) => {
    data += chunk;
  });
  res.on("end",() => {
    var result = JSON.parse(data);
    console.log(result);
  });
});
