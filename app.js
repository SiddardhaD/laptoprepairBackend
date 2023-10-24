const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "myapp", // Change to your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.get("/", (req, res) => {
  // Test the MySQL connection
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to MySQL:", err);
      res.status(500).send("Error connecting to MySQL");
      return;
    }

    // If connected successfully, release the connection
    connection.release();
    res.send("Connected to MySQL!");
  });
});

// Signup User API route
app.post("/signup_user", (req, res) => {
  const { mobile, password } = req.body;

  const checkMobileQuery = `SELECT COUNT(*) AS count FROM users WHERE mobile = '${mobile}'`;

  pool.execute(checkMobileQuery, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: false, error: "Database error" });
    }
    if (results[0]["count"] > 0) {
      return res
        .status(409)
        .json({ status: false, error: "User already exists" });
    }

    bcrypt.hash(password, 10, (hashErr, hash) => {
      if (hashErr) {
        return res
          .status(500)
          .json({ status: false, error: "Password hashing error" });
      }
      const insertUserQuery = `INSERT INTO auth (mobile, password_hash) VALUES ('${mobile}', '${hash}')`;
      pool.execute(insertUserQuery, (insertErr) => {
        if (insertErr) {
          console.error(insertErr);
          return res
            .status(500)
            .json({ status: false, error: "User registration error" });
        }
      });

      const insertAuthQuery = `INSERT INTO users (firstname, lastname, mobile, email, birthdate, fcm, created_at, updated_at) VALUES ('','',${mobile},null,null,'',CURRENT_DATE,CURRENT_DATE)`;
      pool.execute(insertAuthQuery, (authInsertErr) => {
        if (authInsertErr) {
          console.error(authInsertErr);
          return res.status(500).json({ error: "User registration error" });
        }
      });
      res
        .status(200)
        .json({ status: true, message: "User registered successfully" });
    });
  });
});

// Signup User API route
app.post("/signup_agent", (req, res) => {
  const {
    mobile,
    password,
    name,
    email,
    business_type,
    address,
    pincode,
    fcm,
  } = req.body;

  const checkMobileQuery = `SELECT COUNT(*) AS count FROM agents WHERE mobile = '${mobile}'`;

  pool.execute(checkMobileQuery, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: false, error: "Database error" });
    }
    if (results[0]["count"] > 0) {
      return res
        .status(409)
        .json({ status: false, error: "User already exists" });
    }

    bcrypt.hash(password, 10, (hashErr, hash) => {
      if (hashErr) {
        return res
          .status(500)
          .json({ status: false, error: "Password hashing error" });
      }
      const insertUserQuery = `INSERT INTO auth (mobile, password_hash) VALUES ('${mobile}', '${hash}')`;
      pool.execute(insertUserQuery, (insertErr) => {
        if (insertErr) {
          console.error(insertErr);
          return res
            .status(500)
            .json({ status: false, error: "User registration error" });
        }
      });

      const insertAuthQuery = `INSERT INTO agents(name, email, mobile, business_type, address, pincode, fcm) VALUES ('${name}','${email}','${mobile}','${business_type}','${address}','${pincode}','${fcm}')`;
      pool.execute(insertAuthQuery, (authInsertErr) => {
        if (authInsertErr) {
          console.error(authInsertErr);
          return res.status(500).json({ error: "User registration error" });
        }
      });
      res
        .status(200)
        .json({ status: true, message: "User registered successfully" });
    });
  });
});

//signin api

app.post("/signin_user", (req, res) => {
  const { mobile, password } = req.body;
  const fetchUserQuery =
    "SELECT id, mobile, password_hash FROM auth WHERE mobile = ?";

  pool.execute(fetchUserQuery, [mobile], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(200).json({ error: "User not found" });
    }
    const user = results[0];
    const hashedPassword = user["password_hash"];

    bcrypt.compare(password, hashedPassword, (bcryptErr, result) => {
      if (bcryptErr) {
        console.error(bcryptErr);
        return res
          .status(200)
          .json({ status: false, error: "Password comparison error" });
      }

      if (!result) {
        return res
          .status(200)
          .json({ status: false, error: "Incorrect password" });
      }
      if (result) {
        const getquiery = `SELECT * FROM users WHERE mobile = ${mobile}`;
        pool.execute(getquiery, (authInsertErr, resultsValue) => {
          if (authInsertErr) {
            console.error(authInsertErr);
            return res
              .status(200)
              .json({ status: false, error: "User registration error" });
          }
          res.status(200).json({ status: true, data: resultsValue[0] });
        });
      }

      // Password is correct; user is authenticated
      // You can generate a JWT token here if needed and send it back to the client
      // Example: const token = generateToken(user.id);
    });
  });
});

//getUserData
app.get("/get_user", (req, res) => {
  const { mobile } = req.query;
  const fetchUserQuery = `SELECT * FROM users WHERE mobile = ${mobile}`;
  pool.execute(fetchUserQuery, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: false, error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(200).json({ status: false, error: "User not found" });
    }
    if (results.length) {
      return res.status(200).json({ status: true, data: results[0] });
    }
    return res.status(500).json({ status: true, error: "Please Try Again" });
  });
});
//signinAgent api

app.post("/signin_agent", (req, res) => {
  const { mobile, password } = req.body;
  const fetchUserQuery =
    "SELECT id, mobile, password_hash FROM auth WHERE mobile = ?";

  pool.execute(fetchUserQuery, [mobile], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(200).json({ error: "User not found" });
    }
    const user = results[0];
    const hashedPassword = user["password_hash"];

    bcrypt.compare(password, hashedPassword, (bcryptErr, result) => {
      if (bcryptErr) {
        console.error(bcryptErr);
        return res
          .status(200)
          .json({ status: false, error: "Password comparison error" });
      }

      if (!result) {
        return res
          .status(200)
          .json({ status: false, error: "Incorrect password" });
      }
      if (result) {
        const getquiery = `SELECT * FROM agents WHERE mobile = ${mobile}`;
        pool.execute(getquiery, (authInsertErr, resultsValue) => {
          if (authInsertErr) {
            console.error(authInsertErr);
            return res
              .status(200)
              .json({ status: false, error: "User login error" });
          }
          res.status(200).json({ status: true, data: resultsValue[0] });
        });
      }

      // Password is correct; user is authenticated
      // You can generate a JWT token here if needed and send it back to the client
      // Example: const token = generateToken(user.id);
    });
  });
});
//getstore data
app.get("/getmystoredata", (req, res) => {
  const { mobile } = req.query;
  const fetchUserQuery = `SELECT * FROM agents WHERE mobile = ${mobile}`;
  pool.execute(fetchUserQuery, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: false, error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(200).json({ status: false, error: "User not found" });
    }
    if (results.length) {
      return res.status(200).json({ status: true, data: results[0] });
    }
    return res.status(500).json({ status: true, error: "Please Try Again" });
  });
});


//updateStore
app.post("/updateStore", (req, res) => {
  const { id,storeid } =
    req.body;
  const updateQuery = `UPDATE agents SET Store_id= ${storeid} WHERE id = ${id}`;
  const getQuery = `select * from agents WHERE id = ${id}`;
  pool.execute(updateQuery, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: false, error: "Database error" });
    }
    if (results) {
      pool.execute(getQuery, (authInsertErr,result) => {
        if (authInsertErr) {
          console.error(authInsertErr);
          return res
            .status(200)
            .json({ status: false, error: "Error Fetching Data" });
        }
        return res.status(200).json({ status: true, "data": result[0] });
      });
    }
  });
});

//createOrder api

app.post("/createOrder", (req, res) => {
  const { name, email, address, mobile, model, serial, repair, description } =
    req.body;
  const insertOrderQuery = `INSERT INTO orders(name, email, address, mobile, model, serial, repair, description) VALUES ('${name}','${email}','${address}','${mobile}','${model}','${serial}','${repair}','${description}')`;
  const createOrderQuery = `INSERT INTO assignedorders(customername, customermobile, model, serial, repair, assignedto, status) VALUES ('${name}','${mobile}','${model}','${serial}','${repair}',null,null)`;
  pool.execute(insertOrderQuery, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: false, error: "Database error" });
    }
    if (results) {
      pool.execute(createOrderQuery, (authInsertErr) => {
        if (authInsertErr) {
          console.error(authInsertErr);
          return res
            .status(200)
            .json({ status: false, error: "User registration error" });
        }
        return res.status(200).json({ status: true, error: "Order created" });
      });
    }
  });
});

//getOrders API
app.get("/getallorders", (req, res) => {
  const getOrderQuery = `select * from orders`;

  pool.execute(getOrderQuery, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: false, error: "Database error" });
    }
    if (results) {
      return res.status(200).json({ status: true, data: results });
    }
  });
});

//getUserOrders
app.get("/getuserorder", (req, res) => {
  const { mobile } = req.query;
  const fetchUserQuery = `SELECT * FROM orders WHERE mobile = ${mobile}`;
  pool.execute(fetchUserQuery, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: false, error: "Database error" });
    }
    if (results.length === 0) {
      return res.status(200).json({ status: false, error: "User not found" });
    }
    if (results.length) {
      return res.status(200).json({ status: true, data: results });
    }
    return res.status(500).json({ status: true, error: "Please Try Again" });
  });
});


app.post("/createstore", (req, res) => {
  const { storename, storeemail, storephone, storecategory, openingHours,closingHours, storeOwner, facebooklink, instagramLink,storepincode,storeaddress,latitude,longitude,gST } =
    req.body;
  const insertOrderQuery = `INSERT INTO stores(store_name, store_email, store_phone, store_category, opening_hours, closing_hours, store_owner, facebook_link, instagram_link, store_pincode, store_address, latitude, longitude, gst_number) VALUES ('${storename}','${storeemail}','${storephone}','${storecategory}','${openingHours}','${closingHours}','${storeOwner}','${facebooklink}','${instagramLink}','${storepincode}','${storeaddress}','${latitude}','${longitude}','${gST}')`;
  pool.execute(insertOrderQuery, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: false, error: "Database error" });
    }
    if (results) {
        return res.status(200).json({ status: true, error: "Store created" });
    }
  });
});

app.post("/createService", (req, res) => {
  const { service_name,	service_description,	service_price,	service_duration,	service_category,	service_provider,	created_at,	Store_id } =
    req.body;
  const insertOrderQuery = `INSERT INTO services (service_name, service_description, service_price, service_duration, service_category, service_provider,created_at,Store_id)  VALUES ('${service_name}', '${service_description}', ${service_price},${service_duration}, '${service_category}', '${service_provider}','${created_at}',${Store_id})`;
  pool.execute(insertOrderQuery, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ status: false, error: "Database error" });
    }
    if (results) {
        return res.status(200).json({ status: true, error: "Service created" });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
