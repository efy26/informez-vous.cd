let viewSent = false;

const articleId = new URLSearchParams(window.location.search).get('id');
const content = document.querySelector('.apercu-article-content-paragraphe-admin');
const viewsElement = document.getElementById('views-count');

const handleScroll = async () => {
    if (viewSent || !content || !articleId) return;

    const bottom = content.getBoundingClientRect().bottom;
    const windowHeight = window.innerHeight;

    if (bottom <= windowHeight) {
        viewSent = true;

        const response = await fetch(`/api/articles/${articleId}/view`, {
            method: 'POST'
        });

        // const data = await response.json();

        const responseArticleViews = await fetch(`/api/articles/${articleId}`, {
            method: 'GET'
        })

        const resultArticleViews = await responseArticleViews.json()

        // ✔ si vraiment nouvelle vue → update UI
        if (response.ok) {

            if (responseArticleViews.ok) {
                // const current = parseInt(viewsElement.textContent || "0");
                viewsElement.textContent = resultArticleViews.article.views;

                // console.log(resultArticleViews.article.views);
                
            }else {
                console.log(responseArticleViews.error);
                
            }

        }

        window.removeEventListener('scroll', handleScroll);
    }
};

window.addEventListener('scroll', handleScroll);