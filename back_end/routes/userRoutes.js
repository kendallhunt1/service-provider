const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
// const User_Roles = require('../models/UserRoles');
const Company = require('../models/Company');
const TeamMember = require('../models/TeamMember');

router.post('/signup', async (req, res) => {
  try {
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const email = req.body.email;
    const phone_number = req.body.phone_number;
    const company_name = req.body.company_name;
    const reason_for_signup = req.body.reason_for_signup;
    
    // Only create the company if the user creation was successful
    const company = await Company.create({
      company_name: company_name,
      owner: first_name, // Assuming owner is associated with user's email
      operator: first_name,
      employees: JSON.stringify([]),
      selected_services:  JSON.stringify([])// Initialize with empty array
    });
    
    const user = await User.create({
      first_name: first_name,
      last_name: last_name,
      email: email,
      password: hashedPassword,
      phone_number: phone_number,
      company_name: company_name,
      user_role: 'Operator',
      reason_for_signup: reason_for_signup
    });

    await user.setCompany(company)

    console.log("User and Company data successfully posted to DB.");
    res.status(201).json({ message: 'User signed up successfully' });
  } catch (err) {
    console.log("Error: ", err);
    res.status(500).json({ error: 'Error signing up. Please try again.' });
  }
});

router.post('/login', async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { user: user },
      'user_sec_key',
      { expiresIn: '1h' }
    );

    res.status(200).json({ token: token, user: user });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({ error: 'Error logging in. Please try again.' });
  }
});

router.get('/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByPk(userId); // Assuming you're using Sequelize

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // You can modify the response structure based on your needs
    const userData = {
      id: user.id,
      name: user.name,
      company: user.company,
      // ... other user properties
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error('Error fetching user data', error);
    res.status(500).json({ error: 'Error fetching user data' });
  }
});

router.post('/post-add-services', async (req, res) => {
  const { user_id, user_role, selected_services, company_id } = req.body; // Get data from the request body

  try {
    await User.update(
      {
        user_role: user_role,
        selected_services: JSON.stringify(selected_services), // Assuming selected_services is an array
      },
      {
        where: { id: user_id },
      }
    );
    // Find the associated Company using the user's user_id
    const company = await Company.findOne({
      where: { company_id: company_id }, // Assuming user_id is associated with a Company
    });

    if (company) {
      // Update the selected_services of the Company
      await company.update({
        selected_services: JSON.stringify(selected_services), // Assuming selected_services is an array
      });

      console.log('Selected services data submitted successfully for the company');
      res.status(201).json({ message: 'Selected services data submitted successfully for the company' });
    } else {
      console.error('Company not found for the given user ID');
      res.status(404).json({ error: 'Company not found for the given user ID' });
    }
  } catch (error) {
    console.error('Error submitting selected services data:', error.message);
    res.status(500).json({ error: 'Error submitting selected services data. Please try again.' });
  }
})


router.post('/post-team-members', async (req, res) => {
  try {
    const teamMembers = req.body.teamMembers; // Extract the array from the request body

    // Loop through the team members and create them one by one
    for (const teamMember of teamMembers) {
      const newUser = await User.create({
        first_name: teamMember.first_name,
        last_name: teamMember.last_name,
        email: teamMember.email,
        password: teamMember.password,
        phone_number: teamMember.phone_number,
        company_name: teamMember.company_name,
        company_id: teamMember.company_id,
        user_role: teamMember.user_role,
        reason_for_signup: teamMember.reason_for_signup,
      });

      const userId = newUser.id; // Get the generated user ID

      // Fetch the associated company
      const company = await Company.findByPk(teamMember.company_id);

      // Deserialize employees data
      const employees = JSON.parse(company.employees || '[]');

      // Add the new employee with user ID
      employees.push({
        name: teamMember.first_name + ' ' + teamMember.last_name,
        user_id: userId,
      });

      // Serialize and update the company
      await company.update({ employees: JSON.stringify(employees) });
    }

    console.log('Team members data successfully posted to DB');
    res.status(201).json({ message: 'Team members added successfully' });
  } catch (err) {
    console.log('Error:', err);
    res
      .status(500)
      .json({ error: 'Error adding team members. Please try again.' });
  }
});




module.exports = router;