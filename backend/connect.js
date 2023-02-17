import mysql from "mysql"
export const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Vamsi@307',
    database: 'social'
  });
  
  connection.connect((err) => {
    if (err) {
      console.error('Error connecting: ' + err.stack);
      return;
    }
    console.log('Connected as id ' + connection.threadId);
  });