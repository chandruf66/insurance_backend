const { parentPort, workerData } = require('worker_threads');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const connectDB = require('../config/db');
const User = require('../models/User');
const Policy = require('../models/Policy');
const Agent = require('../models/Agent');
const Account = require('../models/Account');
const PolicyCarrier = require('../models/PolicyCarrier');
const PolicyCategory = require('../models/PolicyCategory');

(async () => {
  try {
    await connectDB();

    const { filePath } = workerData;
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    console.log(`📥 Rows read: ${rows.length}`);

    const agentCache = new Map();
    const carrierCache = new Map();
    const categoryCache = new Map();

    const users = [];
    const accounts = [];
    const policies = [];

    for (const row of rows) {
      // 1. Agent
      let agent = agentCache.get(row.agent);
      if (!agent) {
        agent = await Agent.findOneAndUpdate(
          { name: row.agent },
          { name: row.agent },
          { upsert: true, new: true }
        );
        agentCache.set(row.agent, agent);
      }

      // 2. Category
      let category = categoryCache.get(row.category_name);
      if (!category) {
        category = await PolicyCategory.findOneAndUpdate(
          { category_name: row.category_name },
          { category_name: row.category_name },
          { upsert: true, new: true }
        );
        categoryCache.set(row.category_name, category);
      }

      // 3. Carrier
      let carrier = carrierCache.get(row.company_name);
      if (!carrier) {
        carrier = await PolicyCarrier.findOneAndUpdate(
          { company_name: row.company_name },
          { company_name: row.company_name },
          { upsert: true, new: true }
        );
        carrierCache.set(row.company_name, carrier);
      }

      // 4. Prepare User
      const user = {
        firstName: row.firstname,
        dob: new Date(row.dob),
        address: row.address,
        phone_number: row.phone_number,
        state: row.state,
        zip_code: row.zip_code,
        email: row.email,
        gender: row.gender,
        userType: row.userType || 'Client',
      };
      users.push(user);
    }

    // Insert all users
    const insertedUsers = await User.insertMany(users);

    // For each inserted user, insert related Account and Policy
    insertedUsers.forEach((user, index) => {
      const row = rows[index];

      accounts.push({
        name: row.account_name,
        user_id: user._id,
      });

      if (row.policy_number) {
        policies.push({
          policy_number: row.policy_number,
          policy_start_date: new Date(row.policy_start_date),
          policy_end_date: new Date(row.policy_end_date),
          category_id: categoryCache.get(row.category_name)._id,
          company_id: carrierCache.get(row.company_name)._id,
          user_id: user._id,
        });
      }
    });

    // Insert accounts and policies
    await Account.insertMany(accounts);
    await Policy.insertMany(policies);

    fs.unlinkSync(filePath);

    parentPort.postMessage({
      status: 'done',
      usersInserted: insertedUsers.length,
      policiesInserted: policies.length,
    });
  } catch (err) {
    console.error('❌ Worker Error:', err);
    parentPort.postMessage({ error: err.message });
  }
})();
