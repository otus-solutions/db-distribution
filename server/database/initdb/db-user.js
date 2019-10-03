db = db.getSiblingDB('db-distribution');

db.createUser({
  user: USER,
  pwd: PASS,
  roles: [{
    role: "dbOwner",
    db: "db-distribution"
  }]
});

db.grantRolesToUser(USER, [ { role: "executeFunctions", db: "admin" } ]);
