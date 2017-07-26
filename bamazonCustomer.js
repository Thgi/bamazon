var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
	host:"localhost",
	port:"8889",
	user:"root",
	password:"root",
	database:"bamazon"
});

connection.connect(function(err){
	// console.log("connected as id: " + connection.threadId);
	if(err) throw err;
	start();
});

function start(){
  	connection.query("SELECT * FROM products", function(err, results){
    	inquirer.prompt([{
      	name:"id",
      	type:"rawlist",
      	choices:  function(){
        	var choicesArray = [];
        	for( var i =0; i< results.length; i++){
          	choicesArray.push(results[i].product_name);
        	}
        	return choicesArray;
      	},message:"What is the ID of the product you want to buy?"
   		},{
    	name:"quantity",
     	type:"input",
      	message:"How many do you want to buy?",
      	//is it number?
      	validate: function(value){
      		if(isNaN(value) == false){
      			return true;
      		}else{
      			return false;
      		}
      	}
	    }]).then(function(answer){
	    	for( var i =0; i< results.length; i++){
	    		//if the result of the product name matching the id product name 
	          	if (results[i].product_name == answer.id){
	          		// console.log("it is work"); test
	          		//check inventory answer.quanity < reuslt[i].stock_quantity
	          		if (answer.quantity < results[i].stock_quantity){
	          		var total = results[i].price * answer.quantity;
	          		console.log("Your total is: $" + total);
	          		//update inventory : result[i].stockquanity - answer.quantity
	          		var newQuantity = results[i].stock_quantity - answer.quantity;
	          		//talk to server to update stock_quantity .query(sqlString, callback)
	          		//we can write newQuantity in sqlString because it in the javascript not mysql
	          		//query take up to three parameters 
					connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?",[newQuantity,results[i].item_id],
						function (error, results, fields) {
							if (error) throw error;
						}
					);
	          		console.log("Remaining quantity: " + newQuantity);
					}else{
	          			console.log("Insufficient quantity!");
	          			//start again!
	          			start();
	          		}
          		}
        	} 
		});
  	})
}






