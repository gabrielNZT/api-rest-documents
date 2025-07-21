const { PrismaClient, defineExtension } = require('@prisma/client');

const userSafeExtension = defineExtension({
  name: 'userSafe',
  model: {
    user: {
      safe(user) {
        if (!user) return null
        const { passwordHash, ...safeUser } = user
        return safeUser
      }
    }
  }
})

const prisma = new PrismaClient().$extends(userSafeExtension)

export default prisma
