const bcrypt = require('bcryptjs');
const db = require('./utils/db');
const sns = require('./utils/sns');
const jwt = require('./utils/jwt');

exports.registerUser = async (req, res) => {
  const { username, password, phone, email, role } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if user already exists
    const [existing] = await db.execute(
      'SELECT id, username, phone, email, role FROM users WHERE email = ?',
      [email]
    );

    let user;

    if (existing.length > 0) {
      user = existing[0];
    } else {
      // Hash password and insert new user
      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await db.execute(
        'INSERT INTO users (username, password, phone, email, role) VALUES (?, ?, ?, ?, ?)',
        [username, hashedPassword, phone, email, role]
      );

      user = {
        id: result.insertId,
        username,
        phone,
        email,
        role
      };

      // Optionally send welcome message
      // await sns.publishWelcomeNotification(user);
    }

    const token = jwt.generateToken({
      userId: user.id,
      username: user.username,
      role: user.role
    });

    return res.status(200).json({ message: 'Token issued', token });

  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};