const express = require('express');
const bodyParser = require('body-parser');
const mysql      = require('mysql');
const router = express.Router();

// https://github.com/mysqljs/mysql
const connection = mysql.createConnection({
  host     : 'localhost',
  port     : '3306',
  user     : 'root',
  password : '',
  database : 'amazon'
});

router.get('/products', function(req, res, next) {
  //res.send('respond with a resource');
  connection.query('SELECT * FROM QUERY_TABLE ORDER BY PID LIMIT 50;', function(err, rows, fields) {
   if (!err)
     res.json(rows);
   else
     console.log('Error while performing Query: ', err);
  });

});

router.post('/query', function(req, res) {
  var query = req.body.query;
  var queryType = req.body.queryType;
  var filter = req.body.filter;
  var ratingFilter = req.body.ratingFilter;
  var filter_query = ';';
  var rating_query = '';


  //parse category query
  if(filter.length !== 0){
    filter_query = ' AND ('
    for (var i = 0; i < filter.length; i++) {
      (i === filter.length - 1) ?
        filter_query = filter_query + 'CAT_TITLE LIKE "%' + filter[i] + '%"' :
        filter_query = filter_query + 'CAT_TITLE LIKE "%' + filter[i] + '%" OR '
    }
    filter_query = filter_query + ");"
  }


  //switch case based on ratingFilter
  switch(ratingFilter){
    case 'Only 5 ✩ reviews':
      rating_query = ' AND PID NOT IN (SELECT REVIEW_PID FROM REVIEWS WHERE SCORE BETWEEN 1 AND 4)';
      break;
    case 'Only > 4 ✩ reviews':
      rating_query = ' AND PID NOT IN (SELECT REVIEW_PID FROM REVIEWS WHERE SCORE BETWEEN 1 AND 3)';
      break;
    case 'Average > 4 ✩':
      rating_query = ' AND PID IN (SELECT PID FROM QUERY_TABLE WHERE AVERAGE_REVIEW_RATING > 4)';
      break;
    case 'Average > 3 ✩':
      rating_query = ' AND PID IN (SELECT PID FROM QUERY_TABLE WHERE AVERAGE_REVIEW_RATING > 3)';
      break;
    case 'Average > 2 ✩':
      rating_query = ' AND PID IN (SELECT PID FROM QUERY_TABLE WHERE AVERAGE_REVIEW_RATING > 2)';
      break;
    default: break;
  }

  //switch based on queryType
  switch(queryType){
    case 'Product Name':
      connection.query('SELECT * FROM QUERY_TABLE WHERE PNAME LIKE "%' + query + '%"' + rating_query + filter_query, function(err, rows, fields) {
       if (!err)
          res.json(rows)
       else
         console.log('Error while performing Query: ', err);
      });
      break;

    case 'Product Name':
      connection.query('SELECT * FROM QUERY_TABLE WHERE PNAME LIKE "%' + query + '%"' + rating_query  + filter_query , function(err, rows, fields) {
       if (!err)
         res.json(rows);
       else
         console.log('Error while performing Query: ', err);
      });
      break;

    case 'Product ID':
      connection.query('SELECT * FROM QUERY_TABLE WHERE PID = ' + query + rating_query + filter_query, function(err, rows, fields) {
       if (!err)
         res.json(rows);
       else
         console.log('Error while performing Query: ', err);
      });
      break;

    case 'Manufacturer':
      connection.query('SELECT * FROM QUERY_TABLE WHERE MANUFACTURER_NAME LIKE "%' + query+ '%"' + rating_query + filter_query, function(err, rows, fields) {
       if (!err)
         res.json(rows);
       else
         console.log('Error while performing Query: ', err);
      });
      break;

    default: break;
  }
})

router.delete('/query', function(req, res) {
  const pid = req.body.pid;
  connection.query('DELETE FROM PRODUCTS WHERE PID = ' + pid +';', function(err, rows, fields) {
   if (!err)
     res.send({"msg": "Delete Success"})
   else
     res.send({"msg": err.sqlMessage})
  });
})

router.put('/query', function(req, res) {
  const pid = req.body.pid;
  const content = req.body.content;
  const score = req.body.score;
  connection.query(`INSERT INTO REVIEWS (REVIEW_PID, SCORE, INFO) VALUES(${pid}, ${score}, \"${content}\");`, function(err, rows, fields) {
   if (!err)
     res.send({"msg": "Review Sent"})
   else{
     console.log(err)
     res.send({"msg": err.sqlMessage})
   }
  });
})

router.put('/updateQuery', function(req, res) {
  const pid = req.body.pid;
  const price = req.body.price;

  connection.query(`UPDATE PRODUCTS SET PRICE = ${price} WHERE PID=${pid};`, function(err, rows, fields) {
   if (!err)
     res.send({"msg": "Successfully Updated"})
   else{
     console.log(err)
     res.send({"msg": err.sqlMessage})
   }
  });
})

module.exports = router;
