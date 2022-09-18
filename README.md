# Gantri Art Collection Application

This application is used to store and retrieve information about The Tate art collection, users and user comments on art in the collection

# Getting Started

## Downloading the project

The project source code can be downloaded using the following command:

<pre>
git clone https://github.com/pacman433/Gantri.git
</pre>

## Installing dependencies

The project dependencies can be installed using the following command from the root project directory:

<pre>
npm install
</pre>

## Loading the database

The project uses a MySQL server to store and retrieve data.

To initialize the database import the_tate_collection_int.sql file from the root of your project into your MySQL database with the following command:

<pre>
mysql -u(your-user-name) -p(your-password) < the_tate_collection_init.sql
</pre>

This SQL file will import all of the art entries into your database along with the first user in a database titled "the_tate_collection"

## Setting up .env file

The .env file is used to store sensitve information like usernames and passwords and system settings
In order to use the application you need to set the following values in your .env file located in the root of the project directory

<pre>
DB_USER=(your-user-name)
DB_PASS=(your-password)
DB_NAME=the_tate_collection
SERVER_PORT=3000
</pre>

## Starting the server

To start the application on a specified port run the following command from the root of your project directory:
<pre>
npm start
</pre>

## System Notes:

The first user in the system is the "Anonymous" user. This user is used for users who want to make comments without having a user account. This user should have the following record in the database
<br>
<pre>
+---------+-----------+-----+-----------+
| user_id | name      | age | location  |
+---------+-----------+-----+-----------+
|       1 | anonymous |   0 | anonymous |
+---------+-----------+-----+-----------+
</pre>

API calls that use a user ID of 1 will be treated as an API call with no User ID provided

## Helper Scripts
There is a helper script in the helperScripts directory that allows you to import data from a csv directly into the database using the following command:

<pre>
node importData.js (your-file-name)
</pre>

This use of the importData helper script requires that the database schema has already been loaded

## Swagger page
There is a swagger page available for testing the various API routes in the application.

<pre>
http://localhost:(application port)/api-docs/
</pre>

## Running tests

Testing can be run on the system through the use of the following command:

<pre>
npm run test
</pre>

Example output:
$ npm run test

<pre>
> interview-project@1.0.0 test
> mocha tests/\**/*spec.js --exit

Connected to database
Example app listening on port 3000

Query art tests
✔ Query art by ID with bad ID value (48ms)

Add comments on art with bad values
✔ Add comment with bad art ID (80ms)
✔ Add comment with no user ID or name (226ms)

Create user test
✔ create user test no name
✔ create user test no age
✔ create user test no location

6 passing (446ms)
</pre>
