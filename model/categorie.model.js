import { pool } from '../db.js';


export const slugs = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-') // Remplace les espaces par des tirets
        .replace(/[^\w-]+/g, '') // Supprime les caractères non valides
        .replace(/--+/g, '-') // Remplace les multiples tirets par un seul
        .replace(/^-+|-+$/g, ''); // Supprime les tirets en début et fin
}

/**
 * 
 * @param {object} dataCategorie 
 * @returns la catégorie créée
 */
export const createCategorie = async (dataCategorie) => {
    const slug = slugs(dataCategorie.name);

    const result = await pool.query(
        `
        INSERT INTO categories (name, slug) VALUES($1, $2)
        RETURNING *
        `, [dataCategorie.name, slug]
    )
    return result.rows[0];
}

export const getCategories = async () => {
    const result = await pool.query(
        `
        SELECT * FROM categories
        `
    );
    return result.rows;
}

export const getCategorieById = async (id) => {
    const result = await pool.query(
        `
        SELECT * FROM categories WHERE id =$1
        `,
        [id]
    );
    return result.rows[0];
}


export const updateCategorie = async (id, categorieData) => {
    if (categorieData.name) {
        categorieData.slug = slugs(categorieData.name);
    }

    const result = await pool.query(
        `
        UPDATE categories SET name = COALESCE($1, name), slug = COALESCE($2, slug) WHERE id=$3
        RETURNING *
        `, [categorieData.name, categorieData.slug, id]
    );
    return result.rows[0];
}
