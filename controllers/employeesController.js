const Employee = require("../model/Employee");

// FUNCTIONS
const getAllEmployees = async (req, res) => {
  // Define employees
  // Calling find() like this will return all of the employees
  const employees = await Employee.find();
  // IF there are no employees THEN we will return, send a 204, and an error message
  if (!employees)
    return res.status(204).json({ message: "No employees found" });
  res.json(employees);
};

const createNewEmployee = async (req, res) => {
  if (!req?.body?.firstname || !req?.body?.lastname) {
    return res
      .status(400)
      .json({ message: "First and last names are required" });
  }

  try {
    const result = await Employee.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    });

    res.status(201).json(result);
  } catch (err) {
    console.error(err);
  }
};

const updateEmployee = async (req, res) => {
  // IF there is no request, body, or ID then return a 400 error
  if (!req?.body?.id) {
    return res.status(400).json({ message: "ID parameter is required." });
  }
  const employee = await Employee.findOne({ _id: req.body.id }).exec();

  // If the employee does not exist, return an error response
  if (!employee) {
    return (
      res
        // This isnt a bad request but the ID request is on in the system
        .status(204)
        .json({ message: `No employee matches ID ${req.body.id}.` })
    );
  }

  // If the request sends a first name update, set it to employee.firstname
  if (req.body?.firstname) employee.firstname = req.body.firstname;

  // If the request sends a last name update, set it to employee.lastname
  if (req.body?.lastname) employee.lastname = req.body.lastname;

  const result = await employee.save();
  res.json(result);
};

const deleteEmployee = async (req, res) => {
  // Find the employee by ID from the request body.
  if (!req?.body?.id) {
    return res.status(400).json({ message: "ID parameter is required." });
  }

  const employee = await Employee.findOne({ _id: id.body.req }).exec();

  // If the employee does not exist, return an error response
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No Employee matches ${req.body.id} .` });
  }

  const result = await employee.deleteOne({ _id: req.body.id });

  res.json(result);
};

const getEmployee = async (req, res) => {
  // Find the employee by ID from the request parameter in the URL.
  if (!req?.params?.id) {
    return res.status(400).json({ message: "ID parameter is required" });
  }

  const employee = await Employee.findOne({ _id: req.params.id }).exec();

  // If the employee does not exist, return an error response
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.params.id} not found.` });
  }
  // return a single employees data
  res.status(200).json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
