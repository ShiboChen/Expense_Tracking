const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mysql = require("mysql");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

dotenv.config();
const app = express();
const port = process.env.PORT || 3001


app.use(express.json());
app.use(cors());

const connectionUrl =
  "mysql://shch9617:201de1bca9a422a3f3cf@applied-sql.cs.colorado.edu:3306/shch9617";

const connection = mysql.createConnection(connectionUrl);

connection.connect();


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
  });
}else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

app.post("/register", (req, res) => {
  try {
    const { name, email, password } = req.body;

    const sql = "INSERT INTO User (username, email, password) VALUES (?, ?, ?)";
    connection.query(sql, [name, email, password], (err, results) => {
      if (err) throw err;

      if (results) {
        res.status(200).json({
          userId: results.insertId,
          name,
          email,
        });
      }
    });
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
});

app.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;
    const sql = "SELECT * FROM User WHERE email = ?";

    connection.query(sql, [email], (err, results) => {
      if (err) throw err;
      if (results.length == 1) {
        const user = results[0];
        if (user.password == password) {
          res.status(200).json({
            userId: user.userID,
            name: user.username,
            email,
          });
        } else {
          res.status(404).json({ success: false, message: "Invalid password" });
        }
      } else {
        res.status(404).json({ success: false, message: "User Not Found" });
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
});

app.post("/getAllTransactions", (req, res) => {
  try {
    let total;
    let categoryExpense;
    const combinedSumQuery = `
    SELECT
      SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END) AS sumPositive,
      SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END) AS sumNegative,
      SUM(amount) AS overallSum
    FROM Transaction
    WHERE userID = ?;
  `;

    connection.query(combinedSumQuery, [req.body.userId], (err, results) => {
      if (err) throw err;
      total = results[0];
    });

    const sumByCategoryQuery = `
    SELECT
      categoryID,
      SUM(amount) AS totalAmount
    FROM Transaction
    WHERE userID = ?
    GROUP BY categoryID;
  `;

    connection.query(sumByCategoryQuery, [req.body.userId], (err, results) => {
      if (err) throw err;
      categoryExpense = results;
    });

    const transaction = `SELECT * FROM Transaction WHERE userID = ? ORDER BY date DESC LIMIT 10;`;

    connection.query(transaction, [req.body.userId], (err, results) => {
      if (err) throw err;
      res.json({
        transactions: results,
        total,
        categoryExpense,
      });
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.post("/addTransaction", async (req, res) => {
  try {
    const categoryMapping = {
      salary: 1,
      food: 2,
      bill: 3,
      service: 4,
      entertainment: 5,
      shopping: 6,
      travel: 7,
      other: 8,
    };

    const { userId, amount, category, date, description } = req.body;
    let incomeID = null;
    let expenseID = null;
    const categoryID = categoryMapping[category];

    if (amount >= 0) {
      const uuidString = uuidv4();

      const transaction =
        "INSERT INTO Transaction (userID, categoryID, incomeID, expenseID, amount, description, date) VALUES (?, ?, ?, ?, ?, ?, ?)";

      connection.query(
        transaction,
        [userId, categoryID, uuidString, expenseID, amount, description, date],
        async (err, results) => {
          if (err) throw err;
          console.log("Record inserted successfully");

          const sql =
            "INSERT INTO Income (incomeID, userID, categoryID, transactionID, amount, description, date) VALUES (?, ?, ?, ?, ?, ?, ?)";

          await connection.query(
            sql,
            [
              uuidString,
              userId,
              categoryID,
              results.insertId,
              amount,
              description,
              date,
            ],
            (err, result) => {
              if (err) throw err;
              res
                .status(201)
                .json({ success: true, message: "New Transaction Created!" });
            }
          );
        }
      );
    } else {
      const uuidString = uuidv4();

      const transaction =
        "INSERT INTO Transaction (userID, categoryID, incomeID, expenseID, amount, description, date) VALUES (?, ?, ?, ?, ?, ?, ?)";

      connection.query(
        transaction,
        [userId, categoryID, incomeID, uuidString, amount, description, date],
        async (err, results) => {
          if (err) throw err;
          console.log("Record inserted successfully");

          const sql =
            "INSERT INTO Expense (expenseID, userID, categoryID, transactionID, amount, description, date) VALUES (?, ?, ?, ?, ?, ?, ?)";

          await connection.query(
            sql,
            [
              uuidString,
              userId,
              categoryID,
              results.insertId,
              amount,
              description,
              date,
            ],
            (err, result) => {
              if (err) throw err;
              res
                .status(201)
                .json({ success: true, message: "New Transaction Created!" });
            }
          );
        }
      );
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.post("/getIncome", (req, res) => {
  try {
    const getAllIncomeQuery = `SELECT * FROM Income WHERE userID = ? ORDER BY date DESC;`;

    connection.query(getAllIncomeQuery, [req.body.userId], (err, results) => {
      if (err) throw err;
      res.json({ incomeData: results });
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.post("/getExpense", (req, res) => {
  try {
    const getAllExpenseQuery = `SELECT * FROM Expense WHERE userID = ? ORDER BY date DESC;`;

    connection.query(getAllExpenseQuery, [req.body.userId], (err, results) => {
      if (err) throw err;
      res.json({ expenseData: results });
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.post("/deleteIncome", async (req, res) => {
  try {
    const { userID, incomeID, transactionID } = req.body.record;
    const incomeQuery = "DELETE FROM Income WHERE userId = ? AND incomeID = ?";
    await connection.query(incomeQuery, [userID, incomeID]);
    const query =
      "DELETE FROM Transaction WHERE userId = ? AND transactionID = ?";
    await connection.query(query, [userID, transactionID]);
    res.json({ message: "Delete Successfully" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.post("/deleteExpense", async (req, res) => {
  try {
    const { userID, expenseID, transactionID } = req.body.record;
    const expenseQuery =
      "DELETE FROM Expense WHERE userId = ? AND expenseID = ?";
    await connection.query(expenseQuery, [userID, expenseID]);
    const query =
      "DELETE FROM Transaction WHERE userId = ? AND transactionID = ?";
    await connection.query(query, [userID, transactionID]);

    res.json({ message: "Delete Successfully" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
