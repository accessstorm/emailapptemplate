# Backend Setup

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_app_password
```

## Gmail App Password Setup

1. Go to https://myaccount.google.com/apppasswords
2. Generate an app password for "Mail"
3. Use this app password (not your regular Gmail password) in the EMAIL_PASS variable

## Installation

```bash
cd backend
npm install
```

## Running the Server

```bash
npm start
```

The server will run on port 5000.
