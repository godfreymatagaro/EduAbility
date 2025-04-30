const Technology = require('../models/technology.models');
const Review = require('../models/review.models');

// Search logic for assistive technologies
const searchTechnologies = async (query, filter = {}) => {
  // Step 1: Build the base query for full-text search
  const searchCriteria = {
    $or: [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { keyFeatures: { $regex: query, $options: 'i' } },
      { category: { $regex: query, $options: 'i' } },
    ],
  };

  // Step 2: Enhance search with review tags
  const reviews = await Review.find({
    tags: { $elemMatch: { $regex: query, $options: 'i' } },
  });
  const techIdsFromReviews = reviews.map((review) => review.technologyId);
  if (techIdsFromReviews.length > 0) {
    searchCriteria.$or.push({ techId: { $in: techIdsFromReviews } });
  }

  // Step 3: Apply filters (one at a time)
  let sortOption = { rating: -1 }; // Default sort by rating
  const filterCriteria = {};

  if (filter.rating) {
    filterCriteria.rating = { $gte: parseFloat(filter.rating) };
    sortOption = { rating: -1 };
  } else if (filter.popularity) {
    sortOption = { reviewsCount: -1 }; // Sort by number of reviews
  } else if (filter.recency) {
    sortOption = { createdAt: -1 }; // Sort by creation date
  } else if (filter.highestRatings) {
    sortOption = { rating: -1 }; // Same as rating filter
    filterCriteria.rating = { $gte: 4 }; // Example threshold for "highest"
  } else if (filter.cost) {
    filterCriteria.cost = filter.cost;
    sortOption = { createdAt: -1 }; // Default sort when filtering by cost
  } else if (filter.category) {
    filterCriteria.category = filter.category;
    sortOption = { rating: -1 }; // Default sort when filtering by category
  }

  // Step 4: Combine search and filter criteria
  const finalQuery = { $and: [searchCriteria, filterCriteria] };

  // Step 5: Execute the search with sorting
  const technologies = await Technology.find(finalQuery)
    .sort(sortOption)
    .limit(20); // Limit to 20 results for performance

  return technologies;
};

module.exports = { searchTechnologies };