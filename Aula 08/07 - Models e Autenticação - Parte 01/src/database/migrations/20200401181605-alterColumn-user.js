module.exports = {
  up: queryInterface => {
    return queryInterface.renameColumn('users', 'update_at', 'updated_at');
  },
};
