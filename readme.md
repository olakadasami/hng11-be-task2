# User Authentication and Organization Management API

This project implements a RESTful API for user authentication and organization management using NestJS and PostgreSQL.

## Getting Started

1. Clone the repository
2. Install Node.js (version 14 or later) if not already installed
3. Install Nodemon globally:

   ```bash
   npm install -g nodemon

   ```

4. Install project dependencies:
   ```bash
   npm install
   ```
5. Set up your PostgreSQL database
6. Configure your environment variables
7. Start the server: `npm run start:dev`

## Features

- User registration and authentication
- JWT-based authentication
- Organization creation and management
- User-organization associations
- Input validation and error handling

## API Endpoints

### Authentication

- `POST /auth/register`: Register a new user and create a default organization
- `POST /auth/login`: Log in a user

### Users

- `GET /api/users/:id`: Get user details (protected)

### Organizations

- `GET /api/organisations`: Get all organizations for the logged-in user (protected)
- `GET /api/organisations/:orgId`: Get a single organization (protected)
- `POST /api/organisations`: Create a new organization (protected)
- `POST /api/organisations/:orgId/users`: Add a user to an organization (protected)

## Technologies Used

- ExpressJs
- PostgreSQL
- Prisma
- Passport JWT
- Joi
- Jest

## Testing

- Run unit tests: `npm run test`

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License.
