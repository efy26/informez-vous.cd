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

        //  si vraiment nouvelle vue → update UI
        if (response.ok) {

            if (responseArticleViews.ok) {
                // const current = parseInt(viewsElement.textContent || "0");
                viewsElement.textContent = resultArticleViews.article.views;

                // console.log(resultArticleViews.article.views);

            } else {
                console.log(responseArticleViews.error);

            }

        }

        window.removeEventListener('scroll', handleScroll);
    }
};

// const containerPubHeader = document.querySelector('#pub-header')
const divImagePubHeader = document.querySelector('.pub-un')
const titrePubHeader = document.querySelector('#pub-header p')
const lienPubHeader = document.querySelector('#lien-site-header')

const divImagePubFooter = document.querySelector('.pub-deux')
const titrePubFooter = document.querySelector('#pub-footer p')
const lienPubFooter = document.querySelector('#lien-site-footer')

let dernierePubId = -1;
let dernierePubIdFooter = -1;

const afficherPub = async () => {


    const header = 'header'
    const footer = 'footer'

    const afficherPubHeader = async () => {

        const response = await fetch(`/api/pub/${header}?last=${dernierePubId ?? ""}`, {
            method: 'GET'
        })

        const result = await response.json()

        if (response.ok) {

            const pub = result.pub[0]

            if (!pub) {
                return;
            } else {
                dernierePubId = pub.id
                

                divImagePubHeader.style = `background-image: url(${pub.image_url}); background-repeat: no-repeat; width: 100%;
                height: 10rem;   background-size: contain;`
                titrePubHeader.innerHTML = pub.titre
                lienPubHeader.href = "#"
                lienPubHeader.setAttribute('data-id', `${pub.id}`)
                lienPubHeader.setAttribute('data-clicks', `${pub.clicks}`)
                document.querySelector('#un-pub').style.display = 'unset'

                setTimeout(afficherPubHeader, 10000);
                
            }


        } else {
            console.log(result.error);

        }
    }

    const afficherPubFooter = async () => {

        const response = await fetch(`/api/pub/${footer}?last=${dernierePubIdFooter ?? ""}`, {
            method: 'GET'
        })

        const result = await response.json()

        if (response.ok) {

            const pub = result.pub[0]

            if (!pub) {
                return;
            } else {
                dernierePubIdFooter = pub.id

                divImagePubFooter.style = `background-image: url(${pub.image_url}); background-repeat: no-repeat; width: 100%;
                height: 10rem;   background-size: contain;`
                titrePubFooter.innerHTML = pub.titre
                lienPubFooter.href = pub.lien_url
                lienPubFooter.setAttribute('data-id', `${pub.id}`)
                lienPubFooter.setAttribute('data-clicks', `${pub.clicks}`)

                document.querySelector('#deux-pub').style.display = 'unset'

                setTimeout(afficherPubFooter, 10000);
            }


        } else {
            console.log(result.error);
            document.querySelector('#deux-pub').style.display = 'none'

        }
    }

    await Promise.all([
        afficherPubHeader(),
        afficherPubFooter()
    ]);




}
afficherPub()

lienPubFooter.addEventListener('click', async (event) => {
    const id = event.currentTarget.dataset.id
    const clicks = Number(event.currentTarget.dataset.clicks || 0);

    const response = await fetch(`/api/pub/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clicks: clicks + 1 })
    })

    const result = await response.json()

    if (response.ok) {
        console.log(result.pubUpdated);
    } else {
        console.log(result.error);

    }



})

lienPubHeader.addEventListener('click', async (event) => {
    const id = event.currentTarget.dataset.id
    const clicks = Number(event.currentTarget.dataset.clicks || 0);

    const response = await fetch(`/api/pub/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clicks: clicks + 1 })
    })

    const result = await response.json()

    if (response.ok) {
        console.log(result.pubUpdated);
    } else {
        console.log(result.error);

    }
})

window.addEventListener('scroll', handleScroll);