# Flat Pass

## Overview

A web-based password manager that saves your data. Built using the MEAN stack, a user can create an account and "login" to access their stored information. Flat Pass does not use sessions / cookies / tokens and does not store the master password/key in the database, this is done by design so that only the user can have access to his information. If a wrong key is provided, but an email is matched in the database, an error is provided but the data tied to that email address is still not returned, thus simulating a "login".

* User data is encrypted using the node module crypto, which converts the user data into one long string of random text.
* The master password / key is used to decrypt the user data that is stored in the database, and displays the decrypted data on the page
* An add account button is used to add more logins for that specific user, and all the data is encrypted again before being stored in the database.
* A nuke button is provided to erase the user data on the page, but does not affect the information stored in the database.

## Technologies & Frameworks

* HTML
* CSS
* Javascript
* Bootstrap
* AngularJS
* MongoDB
* Node.js
* Node modules:
  * Crypto
  * Mongoose
  * Express
  * Body-Parser

## Change or Functionality for future implementation.
1. Ability to delete a specific login from the database.
2. Ability to delete user information from the database.
3. Better form validation.

## Author

* [Regan Co](https://github.com/rrgn)

## Screenshots

## Live Link
