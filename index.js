const Joi = require("joi");
const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "cruddatabase",
});

app.use(express.json()); // middleware

// ];
app.get("/", (req, res) => {
  res.send("Root page");
});

app.get("/api/get", (req, res) => {
  const sqlSelect = "SELECT * FROM pwmrestapiexpress832018";
  db.query(sqlSelect, (err, result) => {
    res.send(result);
  });
});

app.post("/api/insert", (req, res) => {
  console.log(req.body);
  const { error } = validateCourse(req.body); // result.error
  console.log(error);
  if (error) return res.status(400).send(error.details[0].message);

  const name = req.body.name;
  console.log(name);

  const sqlInsert = "INSERT INTO pwmrestapiexpress832018 (name) VALUES (?)";
  db.query(sqlInsert, [name], (err, result) => {
    console.log(err);
  });
});

app.put("/api/courses/:id", (req, res) => {
  //look up the course
  //if not existing return 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found");

  // validate
  // if invalid return 400 bad request
  //const result = validateCourse(req.body)
  const { error } = validateCourse(req.body); // result.error
  if (error) return res.status(400).send(error.details[0].message);

  // update course
  course.name = req.body.name;
  // retuirn the updated course
  res.send(course);
});

function validateCourse(course) {
  const schema = Joi.object({ name: Joi.string().min(3).required() });

  return schema.validate(course);
}

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found");
  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  // look up the course
  // not existing return 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    return res.status(404).send("The course with the given ID was not found");

  // delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  // return the same course
  res.send(course);
});

// PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
