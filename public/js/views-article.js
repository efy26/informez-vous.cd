//Views article
        let viewSent = false;


const articleId = new URLSearchParams(window.location.search).get('id');

const content = document.querySelector('.apercu-article-content-paragraphe-admin');

window.addEventListener('scroll', async () => {
    if (viewSent || !content || !articleId) return;

    const contentBottom = content.getBoundingClientRect().bottom;
    const windowHeight = window.innerHeight;

    // si le bas du contenu est visible
    if (contentBottom <= windowHeight) {
        viewSent = true;

        await fetch(`/api/articles/${articleId}/view`, {
            method: 'POST'
        });
    }
});