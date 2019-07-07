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
    password: "",
    database: "bamazon_db"
});

// Checks to make sure I am connected to the database
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    listChoices();

});

// Function to display items in store
function listChoices() {
    inquirer
        .prompt({
            name: "managerOptions",
            type: "list",
            message: "What would you like to do?",
            choices: ["View Store Items", "View Low Inventory", "Add to Inventory", "Add New Product"]
        })
        .then(function (answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.managerOptions === "View Store Items") {
                storeItems();
                // figure out how to list choices again
                // listChoices();
            } else if (answer.managerOptions === "View Low Inventory") {
                lowInventory();
            } else if (answer.managerOptions === "Add to Inventory") {
                addInventory();
            } else if (answer.managerOptions === "Add New Product") {
                addProduct();
            }
        })
};
// Displays items in store
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
    backToMenu();
};

// lets manager view low stock
function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
        if (err) throw err;
        console.log("-------------------------------------------------------");
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
    backToMenu();
};

// lets manager add stock
function addInventory() {
    inquirer.prompt({
        name: "id",
        type: "input",
        message: "What is the ID of the product you would like to add to?",
        validate: function (value) {
            if (Number.isInteger(parseInt(value))) {
                return true;
            } else {
                return 'Please enter a number(s)';
            }
        }
    }).then(function (idAnswer) {
        var idSelected = idAnswer.id;
        connection.query("SELECT * FROM products WHERE ?", idSelected, function (err, res) {
            if (err) throw err;
            if (res.length === 0) {
                console.log("Please select an id from the table.");
                addInventory();
            } else {
                inquirer.prompt({
                    name: "quantity",
                    type: "input",
                    message: "How much would you like to add?",
                    validate: function (value) {
                        if (Number.isInteger(parseInt(value))) {
                            return true;
                        } else {
                            return 'Please enter a number(s)';
                        }
                    }
                }).then(function (quantityAnswer) {
                    var quantitySelected = quantityAnswer.quantity;
                    connection.query("UPDATE products SET stock_quantity=stock_quantity + " + quantitySelected + " WHERE id=" + idSelected,
                        function (err) {
                            if (err) throw err;
                            console.log("Product updated!");
                            backToMenu()
                        })
                })
            }
        }
        )
    })
};

// lets manager add a product
function addProduct() {
    inquirer.prompt([{
        name: "newName",
        type: "input",
        message: "What is the name of the new product?"
    },
    {
        name: "newDepartment",
        type: "input",
        message: "What department do you want it in?"
    },
    {
        name: "newPrice",
        type: "input",
        message: "What is the price for this product?"
    },
    {
        name: "newQuantity",
        type: "input",
        message: "How many will be available for purchase?",
        validate: function (value) {
            if (Number.isInteger(parseInt(value))) {
                return true;
            } else {
                return 'Please enter a number(s)';
            }
        }
    }]).then(function (answers) {
        var name = answers.newName;
        var department = answers.newDepartment;
        var price = answers.newPrice;
        var quantity = answers.newQuantity;

        connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: name,
                department_name: department,
                price: price || 0,
                stock_quantity: quantity || 0
            },
            function (err) {
                if (err) throw err;
                console.log("Your product was created!");
                backToMenu();
            }
        );
    })
};

function backToMenu() {
    inquirer.prompt({
        name: "returnToMenu",
        type: "list",
        message: "Did you want to do something else?",
        choices: ["Return to menu", "Close program"]
    }).then(function (answer) {
        if (answer.returnToMenu === "Return to menu") {
            listChoices();
        } else if (answer.returnToMenu === "Close program") {
            connection.end();
        }
    })
};