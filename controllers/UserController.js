import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {validationResult} from 'express-validator';
import UserModel from '../models/UserModel.js';

export const register = async (req,res) => {
    try{
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
    
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash: hash,
            avatarUrl: req.body.avatarUrl,
        });
    
        const user = await doc.save();
    
        const token = jwt.sign({
            _id: user._id,
            
        }, 'key321', {        });
    
        const {passwordHash, ... userData} = user._doc;
    
        res.json({
            ...userData, token});
    } catch(err){
        console.log(err);
        res.json({
            message: 'Not successfull register'
        });
    }
    }
export const login = async (req, res) => {
    try{
        const user = await UserModel.findOne({email: req.body.email});

        if(!user) {
            return req.status(404).json({ message: 'User not found'
        });
        }

        const isValidPass = await bcrypt.compare(req.body.pass, user._doc.passwordHash);

        if (!isValidPass) {
            return res.status(404).json({ message: 'Incorrect password'
            });
        }

        const token = jwt.sign({
            _id: user._id,
            
        }, 'key321', {
            expiresIn: '30d'
        });

        const {passwordHash, ... userData} = user._doc;

        res.json({
            ...userData, token});

    
    } catch (err){
        console.log(err);
        res.json({
            message: 'Login not successful'
        });
    }
}
export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if(!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const {passwordHash, ... userData} = user._doc;

        res.json({userData});
    
    } catch(err) {
        console.log(err);
        res.json({
            message: 'Login not successful'
        });
    }
}