# Electron Flask Example

This project demonstrates how to integrate a Flask backend with an Electron frontend. The application fetches a message from the Flask server and displays it in the Electron app.

## Project Structure


```sh
.
├── README.md
├── backend
│   ├── app.py
│   ├── gunicorn_config.py
│   └── requirements.txt
└── frontend
    ├── index.html
    ├── main.js
    ├── package-lock.json
    ├── package.json
    └── preload.js
```


## Setup

### Prerequisites

Ensure you have the following installed:

- Python 3.x
- Node.js
- npm (Node Package Manager)

### Backend Setup

1. Navigate to the `backend` directory:

    ```sh
    cd backend
    ```

2. Create a virtual environment and activate it:

    ```sh
    python3 -m venv .venv
    source .venv/bin/activate  # On Windows use `.venv\Scripts\activate`
    ```

3. Install the required dependencies:

    ```sh
    pip install -r requirements.txt
    ```

4. Deactivate the virtual environment:

   ```sh
   deactivate
   ```

### Frontend Setup

1. Navigate to the `frontend` directory:

    ```sh
    cd frontend
    ```

2. Install the required dependencies:

    ```sh
    npm install
    ```

3. Start the Electron application in development mode:

    ```sh
    npm start
    ```

## Usage

- The Electron application will start, and the Flask server will be accessible at `http://127.0.0.1:8000/api/message`.
- Click the "Fetch Message" button in the Electron app to retrieve and display the message from the Flask server.

## Building the Application

### Build for Production

1. Ensure all necessary dependencies are installed and the backend is set up correctly.
2. From the `frontend` directory, run the build script:

    ```sh
    npm run build
    ```

This will create a production-ready build of the Electron application.

### Package the Application

1. Ensure you have completed the setup steps and built the application for production.
2. Package the application for your target platform:

    ```sh
    npm run build
    ```

This will create distribution files for your application, which can be found in the `dist` directory.

## Troubleshooting

- Ensure the Python virtual environment is activated before running the Flask application.
- If you encounter issues with ports, ensure no other process is using the same port.
- Check the console for any error messages and address them as needed.
