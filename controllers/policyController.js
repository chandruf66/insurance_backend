const Policy = require('../models/Policy');
const User = require('../models/User');

exports.searchByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    console.log("Searching for:", username);

    const user = await User.findOne({ firstName: { $regex: new RegExp(`^${username}$`, 'i') } });

    if (!user) {
      console.log("No user found");
      return res.json([]); // No 404, just empty array
    }

    console.log("Found user:", user._id);

    const policies = await Policy.find({ user_id: user._id });
    res.json(policies);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
};




// exports.aggregateByUser = async (req, res) => {
//   try {
//     const result = await Policy.aggregate([
//       {
//         $group: {
//           _id: "$userId",
//           policies: { $push: "$$ROOT" },
//           count: { $sum: 1 }
//         }
//       },
//       {
//         $lookup: {
//           from: "users",
//           localField: "_id",
//           foreignField: "_id",
//           as: "userDetails"
//         }
//       },
//       {
//         $unwind: "$userDetails"
//       }
//     ]);
//     res.json(result);
//   } catch (err) {
//     console.error("Aggregate Error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };

exports.aggregatePolicies = async (req, res) => {
  try {
    const result = await Policy.aggregate([
      {
        $lookup: {
          from: 'users', // collection name in MongoDB
          localField: 'user_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $group: {
          _id: '$user._id',
          userName: { $first: '$user.firstName' },
          totalPolicies: { $sum: 1 }
        }
      }
    ]);
    console.log('Aggregation Result:', result);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
