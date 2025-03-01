const Showtime = require('../models/Showtime');
const Movie = require('../models/Movie');

const showtimeController = {
  getShowtimes: async (req, res) => {
    try {
      const { movieId, date } = req.query;
      const query = {};
      
      if (movieId) query.movie = movieId;
      if (date) query.date = new Date(date);

      const showtimes = await Showtime.find(query)
        .populate('movie', 'title')
        .sort('date time');

      res.json(showtimes);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching showtimes'
      });
    }
  },

  getShowtimeById: async (req, res) => {
    try {
      const showtime = await Showtime.findById(req.params.id)
        .populate('movie', 'title poster');

      if (!showtime) {
        return res.status(404).json({
          success: false,
          message: 'Showtime not found'
        });
      }

      res.json(showtime);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching showtime'
      });
    }
  }
};

module.exports = showtimeController; 