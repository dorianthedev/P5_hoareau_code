let productsDataId = []; // variables ARRAAY pour stocké les data de l'api

// déclaration de le variable parents pour implanter les data dynamique produit
let blockProductsHtml = document.querySelector('.items');


//------------------Récupération des données de l'api------------------------

// 1. déclaration de l'api avec fetch et récupération des data

const fetchProduct = async () => {
    await fetch('http://localhost:3000/api/products') 
        .then((res) => res.json())                    //Promise
        .then((data) => productsDataId = data);         // On lie la valeur récupérer de l'api 'data' à la variable productsData
    console.log(productsDataId);
};


// 2. -------créer block html des produits--------

const ProductCreate = async () => {

    productsDataId.forEach(productUnic => {

        //Créer et afficher Balise A--------

        let lienAProduct = document.createElement('a'); // creer element a 
        lienAProduct.setAttribute('href', `./product.html?id=${productUnic._id}`); // creer attribut href
        blockProductsHtml.appendChild(lienAProduct);  // le placer enfant de la div .items =  blockProductsHtml
        

        //Créer et afficher balise article--------

        let articleProduct = document.createElement('article'); // creer element a 
        lienAProduct.appendChild(articleProduct);  // le placer enfant de la div .items =  blockProductsHtml


        //Créer et afficher balise images--------
        let imgProduct = document.createElement('img'); // creer element img
        imgProduct.setAttribute('src', `${productUnic.imageUrl}`); // creer attribut src
        imgProduct.setAttribute('alt', `${productUnic.altTxt}`); // creer attribut alt
        articleProduct.appendChild(imgProduct);  // le placer enfant de la div .items =  blockProductsHtml


        //Créer et afficher balise h3----------
        let h3Product = document.createElement('h3'); // creer element img
        h3Product.classList.add("productName")
        h3Product.innerHTML = `${productUnic.name}`;
        articleProduct.appendChild(h3Product);  // le placer enfant de la div .items =  blockProductsHtml

        //Créer et afficher balise description----------
        let descriptionProduct = document.createElement('p'); // creer element img
        descriptionProduct.classList.add("productDescription")
        descriptionProduct.innerHTML = `${productUnic.description}`;
        articleProduct.appendChild(descriptionProduct);  // le placer enfant de la div .items =  blockProductsHtml

    });

}

// 3. -------Récupérétion des données api et code html product pour afficher les différents élèments des produits--------
// Fonction pour afficher les produits grâce aux données récupérer dans l'api et aux elements du dom créé.
const productDisplay = async () => {
    await fetchProduct();     
    ProductCreate();
    
};
productDisplay();


