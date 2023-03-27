import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// REGISTERING USER //
// ---It should be async as we are dealing with mongo DB.
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000), //Assigning random number
      impression: Math.floor(Math.random() * 10000),
    });

    const savedUSer = await newUser.save();
    res.status(201).json(savedUSer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN USER //
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user)
      return res.status(400).json({ message: "User doesn't exists !!" });

    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch)
      return res.status(400).json({ message: 'Invalid Credentials :(' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
    delete user.password; // deleting password so that password will not get back by the frontend.
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
