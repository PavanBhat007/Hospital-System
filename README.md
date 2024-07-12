# Hospital Management System

## Steps to run locally

**Project Setup**
1. git clone `https://github.com/PavanBhat007/Hospital-System`
2. cd `Hospital-System`
3. cd `hospital`
4. npm i
5. cd `../backend`
6. npm i


**Database Setup** 
1. Download [MySQL Server and MySQL Workbench](https://dev.mysql.com/downloads/installer/) installer.
2. Run the installer, select **Full** installation, and while configuring the server, make note of the TCP/IP port (if the default 3306 port is in use, identifiable by the red exclamation mark, change the port number), username and password. (we will need it later to connect to the MySQL Server).
3. After installation, open MySQL Workbench, and launch any one instances shown (remember the port of the instance launched).
4. Create a new Schema (4th icon in the toolbar) and name it `hospitaldb` (if you change the schema name here you will need to make corresponding change in the `backend/sequelize.js` file by replacing the `hospitaldb` with the name you have chosen).
5. Ensure MySQL Workbench is running in the background while using the app.

**Environment Variables**
1. cd `hospital`
2. Create a `.env` file at the root level of the `hospital` directory.
3. Add `VITE_REACT_APP_BACKEND_URL="http://localhost:5000"` in it.
4. cd `../backend`
5. Create a `.env` file at the root level of the `backend` directory.
6. Add the following lines:
     ```
     BACKEND_PORT=5000
     DB_PORT=<MySQL-server-port>
     DB_USER="root"
     DB_PWD=<MySQL-password>
     ```
     Replace `<MySQL-server-port>` with the TCP/IP port provided during server configuration, and `<MySQL-password>` with the password you have given in the setup of MySQL Server. If you have'nt deliberately changed the MySQL username, leave it as `"root"`, else replace `"root"` with the username you have provided during configuration.

**Running the App/Website**
1. Open 2 terminals
2. In 1 terminal, run the following commands,
   ```sh
   Hospital-System> cd backend
   Hospital-System/backend> node index.js
     Server is running on port 5000 ...
      Database & tables created!
   ```
   If you are getting the proper success message of server running and the database initialization, you are good to go. Else, revisit the previous steps, there might be some mistake with the MySQL configurations.
4. In the other terminal, run the following commands,
   ```sh
   Hospital-System> cd hospital
   Hospital-System/hospital> npm run dev
   ```
   It will launch a development server, and upon clicking the link, you will be redirected to the local deployment of the website.

> If you get any error saying `MODULE_NOT_FOUND`, just `npm i <missing_module>` to fix the issue.
