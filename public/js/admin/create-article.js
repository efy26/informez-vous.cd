window.addEventListener('load', () => {

    ClassicEditor
        .create(document.querySelector('#contenu'), {

            toolbar: [

                'heading',
                '|',

                'bold',
                'italic',
                'underline',

                '|',

                'link',

                '|',

                'bulletedList',
                'numberedList',

                '|',

                'blockQuote',
                'insertTable',

                '|',

                'undo',
                'redo'
            ]

        })
        .then(editor => {
            editorInstance = editor;

            console.log('CKEditor chargé');
        })
        .catch(error => {
            console.error(error);
        });



});

const articleForm = document.querySelector('.article-form-admin')
const articleSommaire = document.querySelector('.article-form-admin #sommaire')
const articleInput = document.querySelectorAll('.article-form-admin input')
const articleSelect = document.querySelectorAll('.article-form-admin select')
const messages = document.querySelector('.btn-article-envoyer-admin label')
let editorInstance;




articleSelect[2].addEventListener('change', (event) => {
    if (event.currentTarget.value === "planifié") {
        articleInput[2].removeAttribute('disabled')
    } else {
        articleInput[2].setAttribute('disabled', 'disabled')
    }


})
const createArticle = async (event) => {
    event.preventDefault()

   if (articleSommaire.value.length > 282 || articleInput[0].value.length > 103) {
        messages.classList.add('error')
        messages.innerHTML = articleSommaire.value.length > 282
            ? 'Maximum 282 caractères autorisés pour le sommaire.'
            : 'Maximum 103 caractères autorisés pour le titre.';
    } else {

        const formData = new FormData();

        formData.append('title', articleInput[0].value);
        formData.append('summary', articleSommaire.value);
        formData.append('content', editorInstance.getData());
        formData.append('status', articleSelect[2].value);
        formData.append('categorie_id', articleSelect[0].value);
        formData.append('subcategorie_id', articleSelect[1].value);
        formData.append('planifier_date', articleInput[2].value);

        formData.append('image', articleInput[1].files[0]);

        const response = await fetch('/api/articles', {
            method: 'POST',
            body: formData
        })

        const result = await response.json();

        if (response.ok) {
            messages.classList.remove('error')
            messages.classList.add('succes')
            messages.innerHTML = result.message

            articleInput[0].value = ''
            articleSommaire.value = ''
            articleInput[2].value = ''
        } else {
            messages.classList.add('error')
            messages.innerHTML = result.error
        }
    }



}

const afficherCategorie = async () => {
    const response = await fetch('/api/categories', {
        method: 'GET'
    })

    const result = await response.json();

    if (response.ok) {
        let statusBrouillonOption = document.createElement('option')

        let statusPlanifieOption = document.createElement('option')

        statusBrouillonOption.value = 'brouillon'
        statusBrouillonOption.innerHTML = 'Brouillon'

        statusPlanifieOption.value = 'planifié'
        statusPlanifieOption.innerHTML = 'Planifié'

        articleSelect[2].appendChild(statusBrouillonOption)
        articleSelect[2].appendChild(statusPlanifieOption)

        for (const categorie of result.categories) {
            let option = document.createElement('option')
            option.value = categorie.id
            option.innerHTML = categorie.name

            articleSelect[0].appendChild(option)



        }


        articleSelect[0].addEventListener('change', async (event) => {
            const id = event.currentTarget.value
            console.log(event.currentTarget.value);
            const response = await fetch(`/api/sub-categories/categories/${id}`, {
                method: 'GET'
            })

            const result = await response.json();

            // Vider le select
            articleSelect[1].innerHTML =
                '<option value="">Sélectionnez une sous-catégorie</option>';

            if (response.ok && result.subCategories.length > 0) {
                articleSelect[1].disabled = false;
                for (const subcategorie of result.subCategories) {
                    let option = document.createElement('option')
                    option.value = subcategorie.id
                    option.innerHTML = subcategorie.name

                    articleSelect[1].appendChild(option)
                }

            } else {
                articleSelect[1].disabled = true;

            }


        })


    }
}
afficherCategorie()
articleForm.addEventListener('submit', createArticle)