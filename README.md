# Address Database (Smoke Trees Backend)

This is a simple Express-based backend for managing users and their addresses using SQLite as the database.

## Features

- User registration and address management.
- Creates a new user if they do not already exist.
- Allows adding multiple addresses for each user.
- Retrieves a list of all addresses along with user information.

## Technologies Used

- Node.js
- Express
- SQLite
- CORS
- Body-parser

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-directory>

2. Install the dependencies
   
   ```bash
   npm install

3. Database Setup
The application uses a SQLite database. The database file database.db will be created automatically when you run the server for the first time. The necessary tables will also be created.

Running the Server
To start the server, run:

   ```bash
   node index.js
