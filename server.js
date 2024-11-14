const express = require("express")
const app = express();
prisma = require("./prisma");


app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json())
PORT = 3000;


app.get("/", (req, res) => {
  res.send("Welcome to the Prismatic Employees API");
});

app.get("/employees", async (req, res, next) => {
  try {
    const employees = await prisma.employee.findMany();
    res.json(employees)
  } catch (e) {
    next(e);
  }
});

app.post("/employees", async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return next({
      status: 400,
      message: "Name must be provided",
    });
  }
  try {
    const employee = await prisma.employee.create({ data: { name } });
    res.status(201).json(employee);
  } catch (e) {
    next(e);
  }
});

app.get("/employees/:id", async (req, res, next) => {
  const { id } = req.params
  const employee = await prisma.employee.findUnique({ where: { id: +id } })
  if (employee) {
    res.send(employee)
  } else {
    next({ status: 404, message: 'Employee Does Not Exist' })
  }
});

app.use((req, res, next) => {
  next({ status: 404, message: "Endpoint Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status ?? 500)
  res.json(err.message ?? `Something went wrong :(`)
})

app.listen(PORT, () => {
  console.log(`App is listening to Port: ${PORT}`)
});


module.exports = app