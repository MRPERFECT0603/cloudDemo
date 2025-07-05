export const createUser = async (req, res) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only can create users' });
  }

  const { name, email } = req.body;

  try {
    const [result] = await global.db.execute(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );

    res.status(201).json({ id: result.insertId, name, email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while creating user' });
  }
};


export const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await global.db.execute('SELECT * FROM users WHERE id = ?', [id]);

    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching user' });
  }
};

export const deleteUser = async (req, res) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only can delete users' });
  }

  const { id } = req.params;

  try {
    const [result] = await global.db.execute('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
};