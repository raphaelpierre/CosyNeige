const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connection successful!')
    
    // Count records in each table
    const userCount = await prisma.user.count()
    const reservationCount = await prisma.reservation.count()
    const messageCount = await prisma.message.count()
    const contactMessageCount = await prisma.contactMessage.count()
    
    console.log(`📊 Database statistics:`)
    console.log(`   - Users: ${userCount}`)
    console.log(`   - Reservations: ${reservationCount}`)
    console.log(`   - Messages: ${messageCount}`)
    console.log(`   - Contact Messages: ${contactMessageCount}`)
    
    // Get sample data
    console.log('\n📝 Sample data:')
    
    const users = await prisma.user.findMany({
      take: 3,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    })
    console.log('Users:', users)
    
    const reservations = await prisma.reservation.findMany({
      take: 3,
      select: {
        id: true,
        guestName: true,
        email: true,
        checkIn: true,
        checkOut: true,
        status: true,
        totalPrice: true,
        createdAt: true
      }
    })
    console.log('Reservations:', reservations)
    
    const messages = await prisma.message.findMany({
      take: 3,
      select: {
        id: true,
        subject: true,
        fromName: true,
        fromEmail: true,
        read: true,
        createdAt: true
      }
    })
    console.log('Messages:', messages)
    
  } catch (error) {
    console.error('❌ Database error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()