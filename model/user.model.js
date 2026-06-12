import { pool } from '../db.js';
import bcrypt from 'bcrypt';

/**
 * 
 * @param {object} userData 
 * @returns User crée
 */

console.log(await bcrypt.hash("Michee2020", 10))
export const createUser = async (userData) => {
    let passwordHash = await bcrypt.hash(userData.password, 10);
    userData.password = passwordHash;
    const result = await pool.query(
        `
        INSERT INTO users (username, email, password, role, status, first_name, last_name, phone, address_home, city, postal_code, country ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
        `,
        [userData.username, userData.email, userData.password, userData.role, 'actif', userData.first_name, userData.last_name, userData.phone, userData.address_home, userData.city, userData.postal_code, userData.country]
    )
    return result.rows[0];
}

/**
 * 
 * @returns Tous les user
 */
export const getusers = async () => {
    const result = await pool.query(
        `
        SELECT * FROM users
        `
    );
    return result.rows;
}

/**
 * 
 * @param {number} id 
 * @returns User récuperé
 */
export const getUserById = async (id) => {
    const result = await pool.query(
        `
        SELECT * FROM users WHERE id =$1
        `,
        [id]
    );
    return result.rows[0];
}

/**
 * 
 * @param {email} email 
 * @returns User récuperé
 */
export const getUserByEmail = async (email) => {
    const result = await pool.query(
        `
        SELECT * FROM users WHERE email =$1
        `,
        [email]
    );
    return result.rows[0];
}

/**
 * 
 * @param {number} id 
 * @param {object} userData 
 * @returns User modifié
 */
export const updateUser = async (id, userData) => {
        if (userData.password) {
            let passwordHash = await bcrypt.hash(userData.password, 10);
            userData.password = passwordHash;
        }

    const result = await pool.query(
        `
        UPDATE users SET username = COALESCE($1, username), email = COALESCE($2, email), password = COALESCE($3, password), role = COALESCE($4, role), status = COALESCE($5, status), first_name = COALESCE($6, first_name), last_name = COALESCE($7, last_name), phone = COALESCE($8, phone), address_home = COALESCE($9, address_home), city = COALESCE($10, city), postal_code = COALESCE($11, postal_code), country = COALESCE($12, country) WHERE id = $13
        RETURNING *
        `,
        [userData.username, userData.email, userData.password, userData.role, userData.status, userData.first_name, userData.last_name, userData.phone, userData.address_home, userData.city, userData.postal_code, userData.country, id]
    );
    return result.rows[0];
}

/**
 * 
 * @param {number} id 
 * @returns True si l'utilisateur a été supprimé, sinon false
 */
export const deleteUser = async (id) => {
    const result =await pool.query(
        `
        DELETE FROM users WHERE id = $1
        RETURNING *`,
        [id]
    ) 
    return result.rows[0]; 

}