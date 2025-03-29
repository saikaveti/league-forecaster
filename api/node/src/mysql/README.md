# MySQL
https://www.geeksforgeeks.org/how-to-install-mysql-on-fedora/

Using MySQL 8.0.40

## Create Database

`mysql -u root -p`

```sql
CREATE DATABASE LeagueForecaster;
```

`quit` then `mysql -u root -p LeagueForecaster`

## Create Table for Logins

```sql
CREATE TABLE Logins (
    id SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
```

## Insert Login Into Table

```sql
INSERT INTO Logins (email, phone, password) VALUES ('bepen@gmail.com', '1234567890', 'P@ssw0rd');
```

## Fetch Login ID From Table

```sql
SELECT id,email FROM Logins WHERE email = 'bepen@gmail.com' AND password = 'P@ssw0rd';
```
