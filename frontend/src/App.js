import React, { Component } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import ReCAPTCHA from 'react-google-recaptcha';

import validators from './utils/validators';
import './App.css';
import axiosInstance from './services/AxiosService';

import RegistrationSuccess from './page/RegistrationSuccess';
import ErrorPage from './page/ErrorPage';
class App extends Component {
	state = {
		name: '',
		email: '',
		password: '',
		nameValid: false,
		nameTouched: false,
		emailValid: false,
		emailTouched: false,
		passwordValid: false,
		passwordTouched: false,
		showRecaptcha: false,
		recaptchaSolvedToken: '',
		recaptchaError: false,
		showSuccessPage: false
	};

	componentWillUnmount() {}
	componentDidUpdate() {}

	inputHandler = (event) => {
		const field = event.target.id;
		const value = event.target.value.trim();
		const validity = validators[`${field}Validator`](value);
		this.setState({
			[field]: value,
			[`${field}Valid`]: validity,
			[`${field}Touched`]: true
		});
	};

	onRecaptchaChange = (successToken) => {
		if (successToken === null) {
			this.setState({ showRecaptcha: true });
		} else if (successToken === undefined) {
			this.setState({ showRecaptcha: true, recaptchaError: true });
		} else {
			console.log(successToken);

			axiosInstance
				.post('/users/register', {
					name: this.state.name,
					email: this.state.email,
					password: this.state.password,
					reCaptchaToken: successToken
				})
				.then((response) => {
					console.log(response.data);
					if (response.data.showRecaptcha) {
						this.setState({
							showSuccessPage: false,
							showRecaptcha: true
						});
					} else {
						this.setState({
							showSuccessPage: true,
							showRecaptcha: false,
							recaptchaError: false
						});
					}
				})
				.catch((error) => {
					alert(
						error.response
							? error.response.data.error
							: 'Check your Internet Connection'
					);
					this.setState({ showErrorPage: true });
				});
			this.setState({ showRecaptcha: false, recaptchaError: false });
		}
	};

	registerUser = (event) => {
		event.preventDefault();
		axiosInstance
			.post('/users/register', {
				name: this.state.name,
				email: this.state.email,
				password: this.state.password
			})
			.then((response) => {
				console.log(response.data);
				if (response.data.showRecaptcha) {
					this.setState({
						showSuccessPage: false,
						showRecaptcha: true
					});
				} else {
					this.setState({
						showSuccessPage: true,
						showRecaptcha: false,
						recaptchaError: false
					});
				}
			})
			.catch((error) => {
				alert(
					error.response
						? error.response.data.error
						: 'Check your Internet Connection'
				);
				this.setState({ showErrorPage: true });
			});
	};

	render() {
		console.log(process.env);
		return (
			<Container component='main' maxWidth='xs'>
				{this.state.showErrorPage ? (
					<ErrorPage></ErrorPage>
				) : this.state.showSuccessPage ? (
					<RegistrationSuccess></RegistrationSuccess>
				) : this.state.showRecaptcha ? (
					<div className='center-align'>
						{this.state.recaptchaError ? (
							<span>
								Something Happened! Please verify your network and make sure
								that you are a human!
							</span>
						) : null}
						<div className='recaptcha'>
							<img
								src={`${process.env.PUBLIC_URL}/assets/images/recaptcha.jpg`}
								height='321px'
								width='303px'
							></img>
							<ReCAPTCHA
								sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
								onChange={this.onRecaptchaChange}
								onErrored={this.onRecaptchaChange}
							/>
						</div>
					</div>
				) : (
					<div className='center-align'>
						<Avatar>
							<AccountCircleIcon />
						</Avatar>
						<Typography component='h1' variant='h5'>
							Registeration Form
						</Typography>
						<form noValidate autoComplete='off' onSubmit={this.registerUser}>
							<TextField
								value={this.state.name}
								variant='outlined'
								margin='normal'
								required
								fullWidth
								id='name'
								label='Name'
								name='name'
								autoFocus
								onChange={this.inputHandler}
								error={this.state.nameTouched ? !this.state.nameValid : false}
								helperText='Length: 3-15, Only Alphabets accepted.'
							/>
							{/* <span className='error-message'>This is an error message</span> */}
							<TextField
								value={this.state.email}
								variant='outlined'
								margin='normal'
								required
								fullWidth
								id='email'
								label='Email Address'
								name='email'
								onChange={this.inputHandler}
								error={this.state.emailTouched ? !this.state.emailValid : false}
								helperText='Should be in this format: example@org.com'
							/>
							<TextField
								value={this.state.password}
								variant='outlined'
								margin='normal'
								required
								fullWidth
								name='password'
								label='Password'
								type='password'
								id='password'
								onChange={this.inputHandler}
								error={
									this.state.passwordTouched ? !this.state.passwordValid : false
								}
								helperText='Length: 8-12, No Spaces Allowed'
							/>

							<Button
								type='submit'
								fullWidth
								variant='contained'
								color='primary'
								disabled={
									!(
										this.state.nameValid &&
										this.state.emailValid &&
										this.state.passwordValid
									)
								}
							>
								Register
							</Button>
						</form>
					</div>
				)}
			</Container>
		);
	}
}

export default App;
