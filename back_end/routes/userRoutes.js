const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer'); // for sending emails
const crypto = require('crypto'); // for generating random reset tokens
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
// const User_Roles = require('../models/UserRoles');
const Company = require('../models/Company');
const Customer = require('../models/Customer');
const Case = require('../models/Case');
const TeamMember = require('../models/TeamMember');
const CompanyServices = require('../models/CompanyServices');

function generateResetToken() {
  const resetToken = crypto.randomBytes(20).toString('hex');
  return resetToken;
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kendallhuntwork@gmail.com',
    pass: 'fmdg nahi nliw erdt'
  },
});

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

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const baseURL = req.protocol + '://' + req.get('host');

  try {
    // Check if a user with the provided email exists
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(404).json({ message: 'No account associated with that email' });
    }

    // Generate a reset token
    const resetToken = generateResetToken();

    // Update the user's account with the reset token
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token will expire in 1 hour
    await user.save();

    const resetLink = `http://localhost:19006/reset-password/${resetToken}`;
    const mailOptions = {
      from: 'kendallhuntwork@gmail.com', // Use the same email as the transporter
      to: email,
      subject: 'Password Reset Request',
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link to complete the process:\n\n${resetLink}\n\n
        If you did not request this, please ignore this email, and your password will remain unchanged.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Email could not be sent.' });
      }
      console.log('Email sent: ' + info.response);
      res.status(200).json({ message: 'Password reset email sent successfully' });
    });
  } catch (error) {
    console.error('Error handling forgot password request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/reset-password/:resetToken', (req, res) => {
  // Extract the reset token from the URL
  const resetToken = req.params.resetToken;

  // Here, you can render a reset password page or send a response back to your frontend.
  // For example:
  // res.render('reset-password', { resetToken }); // If using a template engine like EJS
  // Or, send a JSON response to your frontend with the resetToken
  res.status(200).json({ resetToken });
});

router.get('/get-customers', async (req, res) => {
  try {
    const companyId = req.query.company_id;

    const customers = await Customer.findAll({
      where: {
        company_id: companyId,
      },
    });

    res.status(200).json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error.message);
    res.status(500).json({ error: 'Error fetching customers' });
  }
});

router.get('/get-cases', async (req, res) => {
  try {
    const companyId = req.query.company_id;

    const cases = await Case.findAll({
      where: {
        company_id: companyId,
      },
    });

    res.status(200).json(cases);
  } catch (error) {
    console.error('Error fetching customers:', error.message);
    res.status(500).json({ error: 'Error fetching customers' });
  }
})

router.get('/get-team-members', async (req, res) => {
  try {
    const companyId = req.query.company_id;

    const teamMembers = await User.findAll({
      where: {
        company_id: companyId,
      },
    });

    res.status(200).json(teamMembers);
  } catch (error) {
    console.error('Error fetching customers:', error.message);
    res.status(500).json({ error: 'Error fetching customers' });
  }
})

router.get('/get-company-services', async (req, res) => {
  try {
    const company_id = req.query.company_id;

    // Find all services associated with the given company_id
    const companyServices = await CompanyServices.findAll({
      where: { company_id: company_id },
    });

    if (!companyServices) {
      return res.status(404).json({ error: 'No services found for the company' });
    }

    // Return the list of selected services
    console.log(companyServices)
    res.json(companyServices);
  } catch (error) {
    console.error('Error fetching company services:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/update-user-information', (req, res) => {
  const updatedUserInfo = req.body;

  User.update(updatedUserInfo, {
    where: { id: updatedUserInfo.id },
  })
    .then(() => {
      res.status(200).json({ message: 'User information updated successfully' });
    })
    .catch((error) => {
      console.error('Error updating user information:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
});

router.post('/assign-team-member', async (req, res) => {
  const { caseId, selectedTeamMembers } = req.body;

  try {
    const caseInstance = await Case.findOne({
      where: { case_id: caseId },
    });

    if (!caseInstance) {
      return res.status(404).json({ error: 'Case not found' });
    }

    // Find the selected team members by their user IDs
    const teamMembers = await User.findAll({
      where: { id: selectedTeamMembers },
    });

    // Perform the assignment action here, for example, updating the case's assigned_user field
    // You might have to modify your Case model to include an 'assigned_user' field.
    // Update the 'assigned_user' field of the case to be the selected team member's ID.
    caseInstance.assigned_user = teamMembers[0].id; // Assuming you're assigning a single team member

    // Save the changes to the case
    await caseInstance.save();

    // Send a success response
    res.status(200).json({ message: 'Team member assigned to the case successfully' });
  } catch (error) {
    console.error('Error assigning team member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

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

router.get('/get-case/:caseId', async (req, res) => {
  try {
    const { caseId } = req.params;

    // Query the database to find the case by case_id
    const caseData = await Case.findOne({
      where: { case_id: caseId },
    });

    if (!caseData) {
      return res.status(404).json({ error: 'Case not found' });
    }

    // Return the case data as JSON response
    res.json(caseData);
  } catch (error) {
    console.error('Error fetching case data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/update-case/:caseId', async (req, res) => {
  try {
    const { caseId } = req.params;
    const updatedData = req.body;
    
    // Query the database to find the case by case_id and update it
    const [updatedRowCount] = await Case.update(updatedData, {
      where: { case_id: caseId },
    });

    if (updatedRowCount === 0) {
      return res.status(404).json({ error: 'Case not found' });
    }

    // Case data updated successfully
    res.status(200).json({ message: 'Case data updated successfully' });
  } catch (error) {
    console.error('Error updating case data:', error);
    res.status(500).json({ error: 'Internal server error' });
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
      where: { company_id: company_id },
    });

    if (company) {
      for (const service of selected_services) {
        await CompanyServices.create({
          company_id: company_id,
          service_name: service.service_name,
          service_price: service.service_price,
          service_id: service.service_id
        });
      }

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
      const password = teamMember.password;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser = await User.create({
        first_name: teamMember.first_name,
        last_name: teamMember.last_name,
        email: teamMember.email,
        password: hashedPassword,
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

router.post('/post-add-customer', async (req, res) => {
  try {
    const customerData = req.body;

    // Create a new customer in the database
    const newCustomer = await Customer.create({
      customer_name: customerData.customerName,
      email: customerData.email,
      phone_number: customerData.phoneNumber,
      street_address: customerData.streetAddress,
      city: customerData.city,
      state: customerData.state,
      postal_code: customerData.postalCode,
      country: customerData.country,
      industry: customerData.industry,
      notes: customerData.notes,
      company_id: customerData.company_id
    });

    console.log('Customer added to DB:', newCustomer);

    res.status(201).json({ message: 'Customer added successfully' });
  } catch (err) {
    console.error('Error adding customer:', err);
    res.status(500).json({ error: 'Error adding customer. Please try again.' });
  }
});

router.post('/post-add-case', async (req, res) => {
  try {
    const {
      case_type,
      status,
      priority,
      customer_name,
      customer_email_address,
      customer_phone_number,
      case_details,
      user_id,
      company_id,
    } = req.body;

    // Create a new Case instance
    const newCase = await Case.create({
      case_type: case_type,
      status: status,
      priority: priority,
      customer_name: customer_name,
      customer_email_address: customer_email_address,
      customer_phone_number: customer_phone_number,
      case_details: case_details,
      user_id: user_id,
      company_id: company_id,
    });

    // Send a success response
    res.status(201).json({ message: 'Case added successfully', case: newCase });
  } catch (error) {
    console.error('Error adding case:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports = router;
