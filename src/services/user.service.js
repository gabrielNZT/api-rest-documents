const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async ({ name, email, password }) => {
    const existingUser = await prisma.user.findUnique({
    where: {
        email: email,
      },
    });

  if (existingUser) {
    throw new Error('Este e-mail já está em uso.');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user =  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash,
    },
  });

  return prisma.user.safe(user);
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

  return { user: prisma.user.safe(user), token };
};

const getMe = (user) => {
  return prisma.user.safe(user);
}

module.exports = {
  register,
  login,
  getMe,
};