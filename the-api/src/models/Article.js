const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

exports.createArticle = ({
  id,
  sender_id,
  title,
  content,
}) => {
  db.run(
    `INSERT INTO articles (id,sender_id,title,content)
      VALUES (?,?,?,?)`,
    [
      id,
      sender_id,
      title,
      content
    ],
    (err) => {
      if (err) {
        console.log(err);
        throw new Error('error when creating article ');
      }
    }
  );
}