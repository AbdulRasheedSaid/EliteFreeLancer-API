const fs = require('fs');

const rawData = fs.readFileSync('users.json');
const users = JSON.parse(rawData);

const sqlValues = users.map(user => 
  `('${user._id.$oid}', '${user.name}', '${user.email}', ${user.age || 'NULL'}, '{${user.skills.join(",")}}')`
).join(",\n");

const sqlQuery = `
INSERT INTO "User" (id, name, email, age, skills)
VALUES ${sqlValues};
`;

fs.writeFileSync('import.sql', sqlQuery);
console.log('SQL file generated: import.sql');
