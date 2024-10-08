import { connectToDatabase } from '../configDatabase.js';

export default async function blogRepository() {
  const db = await connectToDatabase();
  const [result] = await db.query('SELECT * FROM blogs;');
  console.log(result);
  return result;
}
export async function saveMessage(w3lName, w3lSubect, w3lMessage) {
  const db = await connectToDatabase();

  const query = "INSERT INTO blogs (title, description, author, createdDate) VALUES (?, ?, ?, now())";

  const values = [w3lName, w3lMessage, w3lSubect];

  const [result] = await db.query(query, values);
  return result;
}
export async function getPostById(id) {
  const db = await connectToDatabase();
  const query = "SELECT * FROM blogs WHERE id = ?";
  const [result] = await db.query(query, [id]);
  return result[0];
}