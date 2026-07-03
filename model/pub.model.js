import { pool } from '../db.js';

export const createPub = async (pubData) => {
    const result = await pool.query(
        `INSERT INTO publicites (titre, image_url, lien_url, position, actif, date_debut, date_fin) VALUES($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [pubData.titre, pubData.image_url, pubData.lien_url, pubData.position, pubData.actif, pubData.date_debut, pubData.date_fin]
    )

    return result.rows[0];
}

export const getPub = async () => {
    const result = await pool.query(
        `
        
        SELECT * FROM publicites ORDER BY id ASC

        `
    )

    return result.rows
}

export const getPubByPosition = async (position, last) => {
    const result = await pool.query(
        `SELECT *
            FROM publicites
            WHERE position = $1
            AND actif = TRUE
                AND ($2::int IS NULL OR id <> $2)
            ORDER BY random(), id
            LIMIT 1;
        `,
        [position, last]

    )
    return result.rows;
}

export const getPubById = async (id) => {
    const result = await pool.query(
        `SELECT * FROM publicites
            WHERE id = $1
        `, [id]
    )
    return result.rows[0];
}

export const updatePub = async (id, pubData) => {
    const result = await pool.query(
        `
        UPDATE publicites SET titre = COALESCE($1, titre),
            image_url = COALESCE($2, image_url),
            lien_url = COALESCE($3, lien_url),
            position = COALESCE($4, position),
            actif = COALESCE($5, actif),
            clicks = COALESCE($6, clicks),
            date_debut = COALESCE($7, date_debut),
            date_fin = COALESCE($8, date_fin) WHERE id=$9
            RETURNING *`,
        [
            pubData.titre,
            pubData.image_url,
            pubData.lien_url,
            pubData.position,
            pubData.actif,
            pubData.clicks,
            pubData.date_debut,
            pubData.date_fin,
            id
        ]
    );
    return result.rows[0];
}

export const deletePub = async (id) => {
    const result = await pool.query(
        `DELETE FROM publicites WHERE id=$1
        RETURNING *`,
        [id]
    )
    return result.rows[0]
}