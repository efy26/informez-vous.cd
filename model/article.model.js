import { pool } from '../db.js';


export const createArticle = async (articleData) => {
    const result = await pool.query(
        `
        INSERT INTO articles (title, summary, content, image, status, categorie_id, subcategorie_id, author_id, planifier_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
        `, [articleData.title, articleData.summary, articleData.content, articleData.image, articleData.status, articleData.categorie_id, articleData.subcategorie_id, articleData.author_id, articleData.planifier_date]
    )
    return result.rows[0];
}
export const getArticleViewCount = async () => {
    const result = await pool.query(
        `
        SELECT SUM(views) AS total_views FROM articles
        `
    );
    return result.rows[0].total_views || 0;
}

export const getArticles = async () => {
    const result = await pool.query(
        `
        SELECT * FROM articles
        `
    );
    return result.rows;
}
export const getArticlesForRedacteur = async (authorId) => {
    const result = await pool.query(
        `
        SELECT * FROM articles WHERE author_id = $1
        `,
        [authorId]
    );
    return result.rows;
}

export const getArticleStatusCounts = async () => {
    const result = await pool.query(
        `
        SELECT status, COUNT(*)::int AS count
        FROM articles
        GROUP BY status
        `
    );
    return result.rows;
}

export const getArticleCountByCategory = async () => {
    const result = await pool.query(
        `
        SELECT c.name AS category, COUNT(*)::int AS count
        FROM articles a
        LEFT JOIN categories c ON a.categorie_id = c.id
        GROUP BY c.name
        ORDER BY count DESC
        `
    );
    return result.rows;
}

export const getArticleById = async (id) => {
    const result = await pool.query(
        `
        SELECT * FROM articles WHERE id =$1
        `,
        [id]
    );
    return result.rows[0];
}
export const getArticleByStatus = async (status, authorId) => {

    const result = await pool.query(
        `
        SELECT * FROM articles WHERE status =$1  AND author_id = $2 AND planifier_date > NOW() 
        ORDER BY planifier_date ASC
        `,
        [status, authorId]
    );
    return result.rows;
}
export const getArticleByStatusBrouillons = async (status, authorId) => {
    const result = await pool.query(
        `
        SELECT *
        FROM articles
        WHERE author_id = $2
        AND (
            status = $1
            OR (
                    status = 'planifié'
                    AND planifier_date < NOW()
                )
            )
        ORDER BY created_at DESC
        `,
        [status, authorId]
    );

    return result.rows;
}
export const updateArticle = async (id, articleData) => {
    const result = await pool.query(
        `
        UPDATE articles SET title = COALESCE($1, title),
            summary = COALESCE($2, summary),
            content = COALESCE($3, content),
            image = COALESCE($4, image),
            status = COALESCE($5, status),
            categorie_id = COALESCE($6, categorie_id),
            subcategorie_id = COALESCE($7, subcategorie_id),
            planifier_date = COALESCE($8, planifier_date) WHERE id=$9
        RETURNING *
        `, [
        articleData.title,
        articleData.summary,
        articleData.content,
        articleData.image,
        articleData.status,
        articleData.categorie_id,
        articleData.subcategorie_id,
        articleData.planifier_date,
        id
    ]
    );
    return result.rows[0];
}

export const deleteArticle = async (id) => {
    const result = await pool.query(
        `
        DELETE FROM articles WHERE id=$1
        RETURNING *
        `, [id]
    );
    return result.rows[0];
}

export const incrementArticleViews = async (articleId, ip) => {

    // 1. vérifier si déjà vu
    const check = await pool.query(
        `SELECT 1 FROM article_views
         WHERE article_id = $1 AND ip_address = $2`,
        [articleId, ip]
    );

    if (check.rows.length > 0) {
        return { alreadyViewed: true };// déjà compté
    }

    // 2. enregistrer la vue
    await pool.query(
        `INSERT INTO article_views (article_id, ip_address)
         VALUES ($1, $2)`,
        [articleId, ip]
    );

    // 3. incrémenter article
    await pool.query(
        `UPDATE articles SET views = views + 1 WHERE id = $1`,
        [articleId]
    );
};

export const getAticleViewsByIdArticle = async (id) => {
    const result = await pool.query(
        `
        SELECT COUNT(*) AS views
        FROM article_views
        WHERE article_id = $1
        `,
        [id]
    );

    return result.rows[0];
}