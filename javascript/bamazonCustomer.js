var mysql = require("mysql");
var inquirer = require("inquirer");
// MAKE SURE TO ADD DASH TO CLI TABLE TO INSTALL CORRECT ONE
var Table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "bamazon1",
    database: "bamazon_db"
});

// Checks to make sure I am connected to the database
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
});

// Function to display items in store
var storeItems = function () {
    connection.query("SELECT * FROM bamazon_db.products;", function (err, res) {
        if (err) throw err;
        console.log("Welcome to Bamazon!");
        console.log("Please select from one of our products!")
        var table = new Table({
            head: ['ID', 'Product', 'Department', 'Price', 'Quantity']
            , colWidths: [5, 20, 20, 8, 10]
        });
        // table is an Array, so you can `push`, `unshift`, `splice` and friends
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            )
        }
        console.log(table.toString());
    })
};
storeItems();

// function to ask for input from user
function askQuestion() {
    var questions = [{
        name: "id",
        type: "input",
        message: "What is the ID of the product you would like to buy?",
        validate: function (value) {
            if (Number.isInteger(parseInt(value))) {
                return true;
            } else {
                return 'Please enter a number(s)';
            }
        },
    },
    {
        name: "quantity",
        type: "input",
        message: "How many would you like to buy?",
        validate: function (value) {
            if (Number.isInteger(parseInt(value))) {
                return true;
            } else {
                return 'Please enter a number(s)';
            }
        }
    }];
    inquirer.prompt(questions)
        .then(function (answer) {

            connection.end();
        });
}
askQuestion();