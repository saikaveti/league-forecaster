import { connection } from './connection.js';

// TODO: need error handling on all of these. and make sure frontend is working as expected when these error

export async function db_login(email = '', phone = '') {
    const res = await connection.query(
        `SELECT id,email,password FROM Logins WHERE (email = ? OR phone = ?)`,
        [email, phone]
    );
    const rows = res[0];
    return rows;
}

export async function db_check_for_unique_user(email, phone) {
    const res = await connection.query(
        `SELECT email,phone FROM Logins WHERE email = ? OR phone = ?`,
        [email, phone]
    );
    const rows = res[0];
    return rows;
}

export async function db_check_for_unique_phone(phone) {
    const res = await connection.query(`SELECT phone FROM Logins WHERE phone = ?`, [phone]);
    const rows = res[0];
    return rows;
}

export async function db_signup(email, phone, password) {
    await connection.query('INSERT INTO Logins (email, phone, password) VALUES (?, ?, ?)', [
        email,
        phone,
        password,
    ]);
}

export async function db_check_for_existing_user(email, phone) {
    const res = await connection.query(`SELECT email FROM Logins WHERE email = ? OR phone = ?`, [
        email,
        phone,
    ]);
    const rows = res[0];
    return rows;
}

export async function db_change_password(email, password) {
    await connection.query('UPDATE Logins SET password = ? WHERE email = ?', [password, email]);
}
