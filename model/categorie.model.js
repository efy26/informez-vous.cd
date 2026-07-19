import { pool } from '../db.js';


export const slugs = (text) => {
    return text.toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // enlève les accents
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+|-+$/g, "");
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

export const deleteCategorie = async (id) => {
    const result = await pool.query(
        `
            DELETE FROM categories WHERE id=$1
            RETURNING *
        `, 
        [id]
    );

    return result.rows[0]
}
