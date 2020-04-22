import User from '../models/User';

export default async (req, res, next) => {
  const userExists = await User.findOne({
    where: {
      id_user: req.body.id_user,
    },
  });

  if (!userExists) {
    return res.status(400).json({ error: 'User not exists!' });
  }

  return next();
};
