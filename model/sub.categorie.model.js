import { pool } from '../db.js';
import { slugs } from './categorie.model.js';

/**
 * 
 * @param {object} dataCategorie 
 * @returns la sous-catégorie créée
 */
export const createSubCategorie = async (dataCategorie) => {
    const slug = slugs(dataCategorie.name);

    const result = await pool.query(
        `
        INSERT INTO subcategories (categorie_id, name, slug) VALUES($1, $2, $3)
        RETURNING *
        `, [dataCategorie.categorie_id, dataCategorie.name, slug]
    )
    return result.rows[0];
}

export const getSubCategories = async () => {
    const result = await pool.query(
        `
        SELECT * FROM subcategories
        `
    );
    return result.rows;
}

export const getSubCategorieById = async (id) => {
    const result = await pool.query(
        `
        SELECT * FROM subcategories WHERE id =$1
        `,
        [id]
    );
    return result.rows[0];
}

export const getSubCategoriesByCategoryId = async (id) => {
    const result = await pool.query(
        `
        SELECT * FROM subcategories WHERE categorie_id = $1
        `,
        [id]

    )
    return result.rows
}

export const updateSubCategorie = async (id, subCategorieData) => {
    let slug;
    if (subCategorieData.name) {
         slug = slugs(subCategorieData.name);
    }

    const result = await pool.query(
        `
        UPDATE subcategories SET name = COALESCE($1, name), slug = COALESCE($2, slug) WHERE id=$3
        RETURNING *
        `, [subCategorieData.name, slug, id]
    );
    return result.rows[0];
}
