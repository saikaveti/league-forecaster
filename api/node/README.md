# league-forecaster-server

A server for League Forecaster.

## Setup

### Environment variables

-   jwt_secret. this can be anything.
-   mysql_secret. this is your mysql database password

### MySQL

https://www.geeksforgeeks.org/how-to-install-mysql-on-fedora/

Make sure systemctl started it with `systemctl start mysqld`

### Redis

v8.0.1

run redis server by typing `redis-server` in command line

## First Time Setup
1. set environment variables from above
2. Make sure mysql and redis are installed on local computer
3. set up mysql using [this document](./src/mysql/README.md)