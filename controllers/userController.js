const User = require('../models/User');
const Booking = require('../models/Booking');

const getUserStats = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Get total bookings
    const totalBookings = await Booking.countDocuments({ 
      user: userId,
      status: 'confirmed' 
    });
    
    // Get bookings for current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const monthlyBookings = await Booking.countDocuments({
      user: userId,
      status: 'confirmed',
      createdAt: { $gte: startOfMonth }
    });
    
    // Calculate total spent from confirmed bookings
    const bookings = await Booking.find({ 
      user: userId,
      status: 'confirmed'
    });
    
    const totalSpent = bookings.reduce((sum, booking) => 
      sum + (booking.totalAmount || 0), 0).toFixed(2);

    // Get user details including createdAt
    const user = await User.findById(userId);

    res.json({
      success: true,
      stats: {
        totalBookings,
        monthlyBookings,
        totalSpent
      },
      user: {
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics'
    });
  }
};

module.exports = {
  getUserStats
}; 