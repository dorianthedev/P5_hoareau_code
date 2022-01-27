// 1. récupération de la chaîne de requête dans l'url //Javascript77
const recupUrlId = window.location.search ;
// 1.2 Extraire l'id avec la méthode .get
const urlParams = new URLSearchParams(recupUrlId);
const idProduitUrl = urlParams.get("id");
console.log(idProduitUrl);

// -------Variables réutilis --------


// 2. déclaration de l'api (fetch) et récupération des data comme pour l'index mais en fonction de l'id
// fetchproduct c'est la fonction qui regroupe la méthode fetch pour chercher les data 
//On rajoute la ariable id pour récupérer que un seul produit avec ses données uniques

const fetchProductId = async () => {           //fonction reutilisables
    await fetch(`http://localhost:3000/api/products/${idProduitUrl}`) 
        .then((res) => res.json())
        .then((data) => productDataId = data);    // On donne la valeur récupérer de l'api 'data' à la variable productsData
    console.log(productDataId);
};
//-----------------3.Fonction créer les élèments du produits---------------

const ProductCreate = async () => {         //fonction reutilisables

    //Ajoute image produit
    document.querySelector('.item__img').innerHTML = `<img src="${productDataId.imageUrl}" alt="${productDataId.altTxt}">`;
    //Ajoute nom produit
    document.querySelector('#title').innerHTML = `${productDataId.name}`;
    //Ajoute prix produit
    document.querySelector('#price').innerHTML = `${productDataId.price}`;
    //Ajoute description produit
    document.querySelector('#description').innerHTML = `${productDataId.description}`;

}

//-----------------4. fonction créer les couleurs produits---------------

const colorsCreate = async () => {       //fonction reutilisables
    
    // Boucle forEach avec les data récupérer avec fetch
    productDataId.colors.forEach((colors) => {
        
        // On cré un élèment optionColor pour sélectionner les différentes couleurs et qu'on lie à une variable
        let optionColor = document.createElement('option');
        
        // Auquel on ajoute du html et un attribut value
        optionColor.innerHTML=`${colors}`;
        optionColor.value=`${colors}`;
        let selectColors = document.querySelector('#colors');

        // Et on les place juste après son parent
        selectColors.appendChild(optionColor);
    });
}



//-----------------5. fonction récupérer les données de l'utilisateur---------------

let quantityProduct = document.querySelector("#quantity");

const recupChoixProduitsUtilisateur= () => {    //fonction reutilisables
    
    const ProduitsUtilisateur = {
        title: document.getElementById("title").innerHTML,
        img: document.querySelector(".item__img img").getAttribute("src"),
        altTxt: document.querySelector(".item__img img").getAttribute("alt"),
        idProduit: idProduitUrl,
        price: document.querySelector("#price").textContent,
        color: document.querySelector("#colors").value,
        quantity: parseInt(quantityProduct.value),
    };
    return ProduitsUtilisateur;
    
};

//-----------------6.Function qui enregistre dans le localstorage selon la couleur et l'id du produit et incrémente si déjà le mproduit dans le Lc 
//----------------------------et analyse la quantité avant de push---------------

// --- Mettre la récupération du Ls dans une variable.
let ProduitsDansLeLocalStorage  = JSON.parse(localStorage.getItem("products"));

//---Envoi les information dans le local storage 
// localStorage.setItem("products", JSON.stringify(ProduitsDansLeLocalStorage )); // convert du Js en JSON
//---Récupere les informations dans le local storage
// JSON.parse(localStorage.getItem("products")); // "JSON.parse" convert du JSON en objetc Js

const conditionQuantiteProductAjoutAuPanierEtPushLc = async () => {            //fonction reutilisables

    const ProduitsUtilisateur = recupChoixProduitsUtilisateur();
    

    if (quantityProduct.value > 0 && quantityProduct.value <= 100 && colors.value != 0) {
        window.location.href = "cart.html";
        if (ProduitsDansLeLocalStorage ) {
            const productFind = ProduitsDansLeLocalStorage.find((product) => product.idProduit === ProduitsUtilisateur.idProduit && product.color === colors.value );
        
            if (productFind) { 
                productFind.quantity += ProduitsUtilisateur.quantity;
                localStorage.setItem("products", JSON.stringify(ProduitsDansLeLocalStorage ));
            } else {
            ProduitsDansLeLocalStorage.push(ProduitsUtilisateur);
            localStorage.setItem("products", JSON.stringify(ProduitsDansLeLocalStorage ));
            }
        } else {
            ProduitsDansLeLocalStorage  = [];
            ProduitsDansLeLocalStorage.push(ProduitsUtilisateur);
            localStorage.setItem("products", JSON.stringify(ProduitsDansLeLocalStorage ));
        }
    } else {
      alert("Merci de choisir une couleur et une quantité");
    }
    
};

const productDisplay = async () => {
    await fetchProductId();     
    ProductCreate();
    colorsCreate();
};
productDisplay();

//=== Envoi le produit dans le panier en écoutant l'event du bouton addtocart ===//
const ecouteDeLeventAjoutAuPanierEtEnvois  = async () => {
    const selectionDuBoutonAjoutPanier = document.getElementById("addToCart");
    selectionDuBoutonAjoutPanier.addEventListener("click", (event) => {
      event.preventDefault();
        conditionQuantiteProductAjoutAuPanierEtPushLc();
    });
}

ecouteDeLeventAjoutAuPanierEtEnvois();