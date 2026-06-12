const categoriesContainer = document.getElementById('categoriesList');
const categoriesMessage = document.getElementById('categoriesMessage');

const fetchJson = async (url) => {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des données (${response.status})`);
    }

    const data = await response.json();
    return data;
};

const fetchArticles = async () => {
    try {
        const data = await fetchJson('/api/articles');
        
        return (data.articles || []).filter(
            article => article.status === 'publié'
        );

    } catch (error) {
        if (error.message.includes('(404)')) {
            return [];
        }
        throw error;
    }
};

const formatArticleSummary = (article) => {
    if (article.summary) {
        return article.summary;
    }
    if (article.content) {
        return article.content.slice(0, 120) + '...';
    }
    return 'Aucun résumé disponible.';
};

const buildCategoryCard = (category, articles = []) => {
    const card = document.createElement('div');
    card.className = 'category-card';

    const button = document.createElement('button');
    button.className = 'category-toggle';
    button.type = 'button';
    button.setAttribute('aria-expanded', 'false');

    const info = document.createElement('div');
    info.className = 'category-info';

    const title = document.createElement('span');
    title.className = 'category-name';
    title.textContent = category.name;

    const count = document.createElement('span');
    count.className = 'category-count';
    count.textContent = `${articles.length} article${articles.length > 1 ? 's' : ''}`;

    info.appendChild(title);
    info.appendChild(count);

    const icon = document.createElement('ion-icon');
    icon.setAttribute('name', 'chevron-down-outline');

    button.appendChild(info);
    button.appendChild(icon);

    const content = document.createElement('div');
    content.className = 'category-articles';
    content.setAttribute('aria-hidden', 'true');

    if (articles.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'category-empty';
        empty.textContent = 'Aucun article disponible pour cette catégorie.';
        content.appendChild(empty);
    } else {
        const list = document.createElement('ul');
        articles.forEach((article) => {
            const item = document.createElement('li');

            const name = document.createElement('strong');
            const link = document.createElement('a');
            link.href = `/lire-article?id=${article.id}`;
            link.textContent = article.title || 'Article sans titre';
            link.style.color = 'inherit';
            link.style.textDecoration = 'none';
            link.addEventListener('mouseover', () => {
                link.style.textDecoration = 'underline';
            });
            link.addEventListener('mouseout', () => {
                link.style.textDecoration = 'none';
            });
            name.appendChild(link);

            const summary = document.createElement('p');
            summary.textContent = formatArticleSummary(article);

            item.appendChild(name);
            item.appendChild(summary);
            list.appendChild(item);
        });
        content.appendChild(list);
    }

    const toggleCategories = (event) => {
        event.preventDefault();


            const expanded = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', String(!expanded));
            content.setAttribute('aria-hidden', String(expanded));
            card.classList.toggle('open', !expanded);




    }

        button.addEventListener('click', toggleCategories)


    card.appendChild(button);
    card.appendChild(content);
    return card;
};

const renderCategories = (categories, articles) => {
    categoriesContainer.innerHTML = '';
    if (categoriesMessage) {
        categoriesMessage.textContent = '';
        categoriesMessage.style.display = 'none';
    }

    const articleMap = categories.reduce((map, category) => {
        map[category.id] = [];
        return map;
    }, {});

    articles.forEach((article) => {
        if (article.categorie_id && articleMap[article.categorie_id]) {
            articleMap[article.categorie_id].push(article);
        }
    });

    categories.forEach((category) => {
        const categoryArticles = articleMap[category.id] || [];
        const card = buildCategoryCard(category, categoryArticles);
        categoriesContainer.appendChild(card);
    });
};

const showError = (message) => {
    if (categoriesMessage) {
        categoriesMessage.textContent = message;
        categoriesMessage.className = 'category-error';
    }
};

const initCategoriesPage = async () => {
    try {
        const categoriesData = await fetchJson('/api/categories');
        const articles = await fetchArticles();

        const categories = categoriesData.categories || [];

        if (categories.length === 0) {
            showError('Aucune catégorie trouvée pour le moment.');
            return;
        }

        renderCategories(categories, articles);
    } catch (error) {
        showError(error.message);
    }
};

if (categoriesContainer) {
    initCategoriesPage();
}
