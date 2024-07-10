const data = {
  employees: require("../model/employees.json"),
  setEmployees: function (data) {
    this.employees = data;
  },
};

// FUNCTIONS

const getAllEmployees = (req, res) => {
  res.json(data.employees);
};

const createNewEmployee = (req, res) => {
  const newEmployee = {
    id: data.employees?.length
      ? data.employees[data.employees.length - 1].id + 1
      : 1,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  };

  if (!newEmployee.firstname || !newEmployee.lastname) {
    return res
      .status(400)
      .json({ message: "First and last name are required." });
  }

  data.setEmployees([...data.employees, newEmployee]);
  res.status(201).json(data.employees);
};

const updateEmployee = (req, res) => {
  // Find the employee by ID from the request body. parseInt converts '2' to 2
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.body.id)
  );

  // If the employee does not exist, return an error response
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.body.id} not found.` });
  }

  // If the request sends a first name update, set it to employee.firstname
  if (req.body.firstname) employee.firstname = req.body.firstname;

  // If the request sends a last name update, set it to employee.lastname
  if (req.body.lastname) employee.lastname = req.body.lastname;

  // Filter out the employee being updated from the employees data
  const filteredArray = data.employees.filter(
    (emp) => emp.id !== parseInt(req.body.id)
  );

  // Add the updated employee back into the employees array
  const unsortedArray = [...filteredArray, employee];

  // Sort the employees array by ID
  data.setEmployees(
    unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
  );

  // Respond with the updated employees data
  res.status(200).json(data.employees);
};

const deleteEmployee = (req, res) => {
  // Find the employee by ID from the request body. parseInt converts '2' to 2
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.body.id)
  );

  // If the employee does not exist, return an error response
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.body.id} not found.` });
  }

  // Filter out the employee being updated from the employees data
  const filteredArray = data.employees.filter(
    (emp) => emp.id !== parseInt(req.body.id)
  );

  data.setEmployees([...filteredArray]);

  res.status(200).json(data.employees);
};

const getEmployee = (req, res) => {
  // Find the employee by ID from the request body. parseInt converts '2' to 2
  const employee = data.employees.find(
    (emp) => emp.id === parseInt(req.body.id)
  );

  // If the employee does not exist, return an error response
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.body.id} not found.` });
  }
  // return a single employee data
  res.sataus(200).json(employee);
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};
