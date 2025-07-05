export const createBook = async (req, res) => {
  const { title, author, published_year } = req.body;

  try {
    const [result] = await global.db.execute(
      'INSERT INTO books (title, author, published_year) VALUES (?, ?, ?)',
      [title, author, published_year]
    );

    res.status(201).json({ id: result.insertId, title, author, published_year });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while creating book' });
  }
};

export const getBook = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await global.db.execute('SELECT * FROM books WHERE id = ?', [id]);

    if (rows.length === 0) return res.status(404).json({ message: 'Book not found' });

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while fetching book' });
  }
};

export const deleteBook = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only can delete books' });
  }

  const { id } = req.params;

  try {
    const [result] = await global.db.execute('DELETE FROM books WHERE id = ?', [id]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Book not found' });

    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error while deleting book' });
  }
};