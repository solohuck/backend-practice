// This will except as many parameters as we want with the rest operator (...). It looks just like the spread operator
const verifyRoles = (...allowedRoles) => {
  // This is the middleware funtion. It will need a request, response, and next
  return (req, res, next) => {
    // This will be all the code that the middleware does

    // If we have a request THEN it should have roles. If no roles with a request then send a 401 Unauthorized
    if (!req?.roles) return res.sendStatus(401);
    // define a roles array that is set equal to the roles passed in.
    const rolesArray = [...allowedRoles];
    // This will be the codes from the roles and not the roles names
    console.log(rolesArray)
    // This is coming from the jwt and will be compared to the rolesArray 
    console.log(req.roles);
    // Map creates a new array. For each role we should she true or false in the results array because of includes. [true, true, false]
    // Once we get all the true/false then Find will look for the first true IF there is no true then there will be nothing returned 
    const result = req.roles.map(role => rolesArray.includes(role)).find(value => value === true)
    if (!result) return res.sendStatus(401)
      // IF all is good then we will allow access to the route with next()
    next();
  }
}

module.exports = verifyRoles