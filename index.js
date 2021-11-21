const express = require('express');
const mongoose = require('mongoose');
const UserModel = require('./userModel');
const cors = require('cors');

require('dotenv').config();

const app = express();

app.use(cors());

mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {
	useNewUrlParser: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
});

app.get('/user', async (req, res) => {
	const { username, password } = req.query;

	if (!username || !password) {
		return res.status(400).json({ message: 'Invalid credentials' });
	}

	const user = await UserModel.findOne({ username }).exec();

	if (!user) {
		return res.status(404).json({ message: 'User not found' });
	}

	if (password !== user.password) {
		return res.status(401).json({ message: 'Incorrect password' });
	}

	return res.status(200).json({ username, message: 'Authorized successfully' });
});

app.listen(4000, () => {
	console.log('Example app listening at http://localhost:4000');
});
