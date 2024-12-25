import validator from 'validator';

export const validateEmail = (email) => {
    if (!validator.isEmail(email)) {
        throw new Error('Invalid email format');
    }
}

export const validateCode = (code) => {
    if(!code || typeof code !== 'string' || !validator.isNumeric(code) || code.length !== 6) {
        return res.status(400).json({ success: false, message: 'Invalid verification code Format' });
    }
};