# URL Shortener

A simple URL shortener web application built with Node.js, Express, and MongoDB.

## Deployed Site

https://url-shortner-9px4.onrender.com/

"Since it is deployed on a free account, it may take a while to load for the first time"

## Features

- User authentication (register, login, logout)
- Create shortened URLs
- View list of shortened URLs with click statistics
- Delete shortened URLs
- Redirect to original URLs

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- EJS templating
- JWT for authentication
- bcrypt for password hashing
- Bootstrap for styling

## Setup

1. Clone the repository:

git clone https://github.com/yourusername/url-shortener.git

```bash
cd url-shortener
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory and add the following:

MONGO_URI=your_mongodb_connection_string
TOKEN_SECRET=your_jwt_secret_key
ALLOWED_ORIGIN=http://localhost:3000

4. Start the server:

```bash
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Register a new account or log in to an existing one.
2. On the main page, enter a URL you want to shorten and click "Shorten".
3. View your shortened URLs, their click counts, and use the delete button to remove them.
4. Click on a shortened URL to be redirected to the original URL.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Author

Oluwatodimu Adegoke
