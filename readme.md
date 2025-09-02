# StayFinder

StayFinder is a modern Airbnb-inspired web application built with Node.js, Express, MongoDB, and EJS. It allows users to create, browse, review, and manage property listings with authentication, image uploads, and a beautiful UI.

## Features

- User authentication (signup, login, logout)
- Create, edit, and delete property listings
- Upload listing images (Cloudinary integration)
- Leave reviews and ratings for listings
- Delete your own reviews
- Flash messages for feedback
- Responsive, modern UI with Bootstrap and custom styling
- Error handling with friendly error pages
- Social links and contact info in the footer

## Tech Stack

- Node.js
- Express 5
- MongoDB & Mongoose
- Passport.js (local strategy)
- EJS & EJS-Mate
- Bootstrap 5 & Bootstrap Icons
- Cloudinary (image storage)
- Multer & multer-storage-cloudinary
- Joi (validation)
- connect-flash (flash messages)
- dotenv (environment variables)

## Getting Started

### Prerequisites

- Node.js & npm
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/stayfinder.git
   cd stayfinder
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory:
   ```
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   ```

4. **Start MongoDB** (if running locally):
   ```sh
   mongod
   ```

5. **Run the app:**
   ```sh
   npm start
   ```
   The app will run on [http://localhost:3000](http://localhost:3000).

## Usage

- Sign up for a new account.
- Log in to create, edit, or delete listings.
- Upload images for your listings.
- Leave reviews and ratings for any listing.
- Delete your own reviews.
- Enjoy a modern, responsive UI!

## Folder Structure

```
Airbnb/
├── controllers/
├── models/
├── routes/
├── views/
│   ├── includes/
│   ├── layouts/
│   ├── listings/
│   └── users/
├── public/
│   ├── css/
│   └── js/
├── utils/
├── .env
├── app.js
├── package.json
└── README.md
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License.

## Credits

- [Bootstrap](https://getbootstrap.com/)
- [Cloudinary](https://cloudinary.com/)
- [Font Awesome](https://fontawesome.com/)
- [Unsplash](https://unsplash.com/) (demo images)

---
**Made with ❤️
