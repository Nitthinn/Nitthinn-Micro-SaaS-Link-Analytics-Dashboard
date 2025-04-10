import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/userModel';
import { generateToken } from '../utils/generateToken';

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400).json({ message: 'User already exists' });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ email, password: hashedPassword });

  const token = generateToken(newUser._id.toString());
  res.status(201).json({
    token,
    user: {
      id: newUser._id,
      email: newUser.email,
      message:'user signed up sucessfully'
    },
  });
};

export const signin = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const token = generateToken(user._id.toString());
  res.json({
    token,
    user: {
      id: user._id,
      email: user.email,
      message:"user logged in sucessfully"
    },
  });
};
