import * as EmailValidator from 'email-validator';

export const checkLength = (string = '', minLength = 1, maxLenght = 10) => {
	return string.length >= minLength && string.length <= maxLenght;
};

export const nameValidator = (name = '') => {
	const lettersRegEx = /^[A-Za-z]+$/;
	if (typeof name === 'string') {
		const trimmedName = name.trim();
		if (checkLength(trimmedName, 3, 15)) {
			return lettersRegEx.test(trimmedName);
		}
	}
	return false;
};

export const emailValidator = (email = '') => {
	return EmailValidator.validate(email);
};

export const passwordValidator = (passowrd = '') => {
	if (typeof passowrd === 'string') {
		const trimmedPassword = passowrd.trim();
		if (checkLength(trimmedPassword, 8, 12)) {
			return !trimmedPassword.includes(' ');
		}
	}
	return false;
};

export default {
	nameValidator,
	emailValidator,
	passwordValidator
};
