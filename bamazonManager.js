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
	if (err) throw err;
	// console.log("connection sucessfully!")
	runSearch();
});




function runSearch(){
	connection.query("SELECT * FROM products", function(err, results){
		inquirer.prompt({
			name:"action",
			type:"rawlist",
			message:"what do you like to do?",
			choices:[
				"View Products for Sale",
				"View Low Inventory",
				"Add to Inventory",
				"Add New Product"
			]
		}).then(function(answer){
			switch(answer.action){
				case "View Products for Sale":
					viewProducts(results);
					// console.log("sucessfully");
				break;
				
				case "View Low Inventory":
					viewInventory(results);
					// console.log("sucessfully");
				break;
				
				case "Add to Inventory":
					addInventory(results);
					// console.log("sucessfully");
				break;
				
				case "Add New Product":
					// addProduct();
					// console.log("sucessfully");
				break;				
			}
		});
	})
}

function viewProducts(info){
	console.log("Here is a list of the current inventory:")
	for(var i=0; i< info.length; i++){
		console.log("Item id : " + info[i].item_id + "\nProduct_name : " + info[i].product_name +
			"\nDepartment name : " +info[i].department_name +"\nPrice : " +info[i].price, "\nStock quantity : " + info[i].stock_quantity);
	}
}

function viewInventory(info){
	console.log("The following the low inventory:")
	for (var i=0; i< info.length; i++ ){
		if(info[i].stock_quantity < 5){
			console.log("Item id : " + info[i].item_id + "\nProduct_name : " + info[i].product_name +
			"\nDepartment name : " +info[i].department_name +"\nPrice : " +info[i].price, "\nStock quantity : " + info[i].stock_quantity);
			
		}
	}
}	

function addInventory(info){
      inquirer.prompt([{
      name:"products",
      type:"list",
      message:"which product do you want to add more inventory of?",
      choices:   function(){
        var choicesArray = [];
        for( var i =0; i< info.length; i++){
          choicesArray.push(info[i].product_name, info[i].stock_quantity);
          // console.log("product_name: " + info[i].product_name);
       
        }
        	return choicesArray;
        	
     	},
     	
     	 },{
      		name:"quantity",
	     	type:"input",
	      	message:"How many do you want to add to inventory?",
	      	//is it number?
	      	validate: function(value){
	      		if(isNaN(value) == false){
	      			return true;
	      		}else{
	      			return false;
	      		}
	      	} 	

      	}]).then(function(answer){
      		for( var i =0; i< info.length; i++){
      			console.log("product: " + info[i].product_name);
      			 if (info[i].product_name == answer.products){
      			 	var newQuantity = info[i].stock_quantity +	answer.quantity;
      			 	connection.query("UPDATE products SET stock_quantity=? WHERE product_name=?",[newQuantity,info[i].item_id],
					function (error, results, fields) {
						if (error) throw error;
					})
					addInventory(info);
			

      		}
      	}
    })
 } 






	   