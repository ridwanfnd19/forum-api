/* eslint-disable camelcase */
exports.up = (pgm) => {
  pgm.createTable('commentlikes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'threads(id)',
      onDelete: 'cascade',
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'cascade',
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'comments(id)',
      onDelete: 'cascade',
    },
    date: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.addConstraint('commentlikes',
      'unique_owner_and_comment_id_and_thread_id', 'UNIQUE(owner, comment_id, thread_id)',
  );
};

exports.down = (pgm) => {
  pgm.dropTable('commentlikes');
};

