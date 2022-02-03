//---Envoi les information dans le local storage 
// localStorage.setItem("products", JSON.stringify(ProduitsDansLeLocalStorage)); // convert du Js en JSON

//---Récupere les informations dans le local storage
ProduitsDansLeLocalStorage = JSON.parse(localStorage.getItem("products")); // "JSON.parse" convert du JSON en objetc Js

async function getPrice(id) {
    return fetch('http://localhost:3000/api/products/'+ id)
        .then(response => response.json())
        .then(product => {
            return product.price
        })
        .catch((err) => console.error(err))
}

//-----------------1.Fonction intégration et création du block Html
// -------------------et récup valeurs dans le local storage---------------
function creationBlockHtmlPanier() {     // fonctions réutilisable
    ProduitsDansLeLocalStorage.forEach((productPourLePanier) => {
                        

                    const selectionGrosParentsHtml = document.getElementById("cart__items");
                    //creation Block article
                    const createBlockArticle = document.createElement("article");
                    selectionGrosParentsHtml.appendChild(createBlockArticle);
                    createBlockArticle.classList.add("cart__item");
                    createBlockArticle.dataset.id = productPourLePanier.idProduit;
                    createBlockArticle.dataset.color = productPourLePanier.color;

                    getPrice(productPourLePanier.idProduit).then((price) => {
                        createBlockArticle.innerHTML = `
                                    <div class="cart__item__img">
                                        <img src="${productPourLePanier.img}" alt="${productPourLePanier.altTxt}">
                                        </div>
                                        <div class="cart__item__content">
                                        <div class="cart__item__content__description">
                                            <h2>${productPourLePanier.title}</h2>
                                            <p>${productPourLePanier.color}</p>
                                            <p>${price} €</p>
                                        </div>
                                        <div class="cart__item__content__settings">         
                                            <div class="cart__item__content__settings__quantity">
                                            <p>Qté :</p>
                                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productPourLePanier.quantity}">
                                            </div>
                                            <div class="cart__item__content__settings__delete">
                                            <p class="deleteItem">Supprimer</p>
                                            </div>
                                        </div>
                                    </div> `;
                    })
            
        
        
    })  

}



//-----------------2.Fonction affiche les produit---------------

const afficheProduitsDanslePanier = async () => {
    if (ProduitsDansLeLocalStorage === null || ProduitsDansLeLocalStorage == 0) {
        const InsererMessagePanierVide = document.querySelector("#cart__items");
        const panierVide =`<h3>Le panier est vide: 0 article !</h3>`;

        InsererMessagePanierVide.innerHTML = panierVide;
    }
    else {
      creationBlockHtmlPanier();
    }
}
afficheProduitsDanslePanier();



//-----------------4.Fonction calcul du prix total de tout les articles dans le panier---------------

const afficheLePrixTotalDeTousLesArticles = async () => {

    if (ProduitsDansLeLocalStorage !== null) {  // sinon error dans la console si le panier est vide

        let arrayResultats = new Array();

        ProduitsDansLeLocalStorage.forEach((chaqueTourLc) => {

            console.log(chaqueTourLc.quantity);

            getPrice(chaqueTourLc.idProduit).then((price) => {

                return chaqueTourLc.quantity * price;
            })
            .then((total) => {
                arrayResultats.push(total)

            })
                
        })
            
        await getPrice();
        let sum = 0
        console.log(arrayResultats)
        for ( let i of arrayResultats ) {
            sum += parseInt(i)
        }
    
        
        document.querySelector("#totalPrice").innerHTML = sum;
        
        
    } else {
        document.querySelector("#totalPrice").innerHTML = "0";
    }

}
//-----------------5.Fonction calcul le nombre total de tous le sarticles dans le panier--------------

const afficheLeNombreDarticlesTotal = async () => {

        let totalArticleProduit = ProduitsDansLeLocalStorage.reduce(
        (totalArticles, article) => {
            return totalArticles + article.quantity;
        },
        0
        );
        //- Affiche le nombre total des articles
        document.querySelector("#totalQuantity").innerHTML = totalArticleProduit;
    
}
afficheLePrixTotalDeTousLesArticles();
afficheLeNombreDarticlesTotal();

//-----------------6.Supprime les produits individuellement---------------

const deleteProductIndiv = async () => {
    window.addEventListener('load', () => {

        
        const classBouttonSupprimer = document.querySelectorAll(".deleteItem");
            classBouttonSupprimer.forEach((deleteLink) => {
                deleteLink.addEventListener("click", (e) => {
                    
                    e.preventDefault();
                    //- Suppression de l'élément dans le dom en premier et ensuite on compare le dom et le local pour push un new array avec filter
                    const produitAaSupprimer = e.target.closest(".cart__item");
                    const idProduitAaSupprimer = produitAaSupprimer.dataset.id;
                    const couleurProduitAaSupprimer = produitAaSupprimer.dataset.color;
                    produitAaSupprimer.remove();
                    //- Suppression de l'élément dans le local storage : tableau filtré après l'élément supprimé
                    // - methode filter = retourne un nouveau tableau qui respecte la condition du filtre
                    // traduction = il ne garde pas dans le tableaux si les id sont différents ou la couleur
                    ProduitsDansLeLocalStorage = ProduitsDansLeLocalStorage.filter((productLocalStorage) => productLocalStorage.idProduit !== idProduitAaSupprimer 
                    || productLocalStorage.color !== couleurProduitAaSupprimer);
                    //- Sauvegarde dans le local storage
                    localStorage.setItem("products", JSON.stringify(ProduitsDansLeLocalStorage));    //- Mise à jour du prix et du nombre d'article
                    alert ("Ce produit a été supprimé du panier");
                    afficheLePrixTotalDeTousLesArticles();
                    afficheLeNombreDarticlesTotal();
                    location.reload()
                    
                    if (ProduitsDansLeLocalStorage == null || ProduitsDansLeLocalStorage == 0){
                        location.reload();
                    }
                    
                });
            });
    })

}
deleteProductIndiv();


//-----------------7.modofie la quantite individuellement---------------
//=== Permet de modifie la quantité du produit et enregistre la modification dans le local storage ===//

const modifQuantityIndiv = async () => {
    window.addEventListener('load', () => {

        const inputQuantitee = document.querySelectorAll(".itemQuantity");
        inputQuantitee.forEach((quantityLink) => {
            quantityLink.addEventListener("change", (ec) => {
                ec.preventDefault();

                //- Récupèrer l'id et la couleur du produit à modifier
                const quantiteDuProduitAaModifier = ec.target.closest(".cart__item");
                const productToModifId = quantiteDuProduitAaModifier.dataset.id;
                const productToModifColor = quantiteDuProduitAaModifier.dataset.color;
                //- Modifie la quantité dans le local storage
                const productTuUpdate = ProduitsDansLeLocalStorage.find((product) => product.idProduit === productToModifId &&
                product.color === productToModifColor);


                const quantityMin = ec.target.closest(".itemQuantity");
                    if (quantityMin.value < 1) {
                    alert("Veuillez indiquer une valeur positive");
                    } else if (quantityMin.value > 100){
                        alert("Veuillez indiquer une valeur entre 1 et 100");
                    }else {
                    productTuUpdate.quantity = ec.target.valueAsNumber;
                    localStorage.setItem("products", JSON.stringify(ProduitsDansLeLocalStorage));
                    }//- Mise à jour du prix et du nombre d'article
                    afficheLePrixTotalDeTousLesArticles();
                    afficheLeNombreDarticlesTotal();
                    location.reload()

            });
        });
    })
}

modifQuantityIndiv();

//--------------------------------------------------------------//
//--------------------------------------------------------------//


//-----------------8.Formulaire---------------

//-----------Debut FORMULAIRE------------------------------------------
//selection du bouton submit du formulaire
const bouttonEnvoiFormulaire = document.querySelector('#order')

// debut addEventListener pour stocker l'evenement click boutton submit-------
bouttonEnvoiFormulaire.addEventListener('click', (e) => {
    e.preventDefault();

    // apres regEx
    // creation d'une class pur créer un objet dans lequel il y aura
    // les valeurs du formulaire
    class FormulaireObjet {
        constructor() {
            this.firstName = document.querySelector("#firstName").value;
            this.lastName = document.querySelector("#lastName").value;
            this.address = document.querySelector("#address").value;
            this.city = document.querySelector("#city").value;
            this.email = document.querySelector("#email").value;
        }
    }

    //Appeler de l'instance class FormulaireObjet => pour creer l'objet infosClient
    const contact = new FormulaireObjet();
    console.log(contact);
    

//--------------------Validation du formulaire avant envois---------------------

    const textAlertErrorInput = (value) => {
        return `${value}: Chiffre et symbole ne sont pas autorisé \n Ne pas dépasser 20caractères, minimum 3 caractères`;
    }

    // REGEX Prenom Nom et Ville
    const regExPrenomNomVille = (value) => {
        return /^([A-Za-z]{3,20})?([-]{0,1})?([A-Za-z]{3,20})$/.test(value) 
        // que des lettres de A à Z entre 3 et 20 caractères
        //possibilités nom composés
    }

    // REGEX email
    const regExEmail = (value) => {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
    }

    // REGEX adress
    const regExAdress = (value) => {
        return /^[A-Za-z0-9\s]{5,50}$/.test(value)
    }

    //Controle de la validite du prenom
    function prenomControl() {
        //controle de la validite prenom
        const lePrenom = contact.firstName;
        if(regExPrenomNomVille(lePrenom)){
            document.querySelector("#firstNameErrorMsg").textContent = " ";
            return true;
        }else {
            document.querySelector("#firstNameErrorMsg").textContent = "Veuillez bien remplir ce champ";
            alert (textAlertErrorInput("Prenom"));
            return false;
        }

    };


    //controle de la validite du nom
    function nomControl() {
        //controle de la validite prenom
        const leNom = contact.lastName;
        if(regExPrenomNomVille(leNom)){
            document.querySelector("#lastNameErrorMsg").textContent = " ";
            return true;
        }else {
            alert (textAlertErrorInput("Nom"));
            document.querySelector("#lastNameErrorMsg").textContent = "Veuillez bien remplir ce champ";
            return false;
        }

    };


    //controle de la validite de la ville

    function cityControl() {
        //controle de la validite prenom
        const laVille = contact.city;
        if(regExPrenomNomVille(laVille)){
            document.querySelector("#cityErrorMsg").textContent = " ";
            return true;
        }else {
            alert (textAlertErrorInput("Ville"));
            document.querySelector("#cityErrorMsg").textContent = "Veuillez bien remplir ce champ";

            return false;
        }

    };

    //controle de la validite de l'email

    function emailControl() {
        //controle de la validite prenom
        const leEmail = contact.email;
        if(regExEmail(leEmail)){
            document.querySelector("#emailErrorMsg").textContent = " ";
            return true;
        }else {
            alert ("L'email n'est pas valide");
            document.querySelector("#emailErrorMsg").textContent = "Veuillez bien remplir ce champ";

            return false;
        }

    };

    function adressControl() {
        //controle de la validite prenom
        const lAdress = contact.address;
        if(regExAdress(lAdress)){
            document.querySelector("#addressErrorMsg").textContent = " ";
            return true;
        }else {
            alert ("L'adresse doit contenir que des lettres sans ponctuation et des chiffres");
            document.querySelector("#addressErrorMsg").textContent = "Veuillez bien remplir ce champ";

            return false;
        }

    };


    // Controle validité formulaire avant envoie dans le local storage
    if (prenomControl() && nomControl() &&cityControl() && emailControl() && adressControl() && ProduitsDansLeLocalStorage !== null ) {
        //mettre l'objet contact dans le localstorage
        localStorage.setItem("contact", JSON.stringify(contact));  

        // si tout est valider dans le formulaire ====>
        
        // const pour stoker tout les id des produits
        const products = [];

        //- Boucle qui va récupérer tous les id dans le local storage
        ProduitsDansLeLocalStorage .forEach((productOrder) => {
            products.push(productOrder.idProduit);
        });

        const envoiFormulaireEtProduits = {
            contact,
            products,
            };
            console.log(envoiFormulaireEtProduits );
    
        // function pour envoyer au serveur
        const fetchProductEtId = async () => {
            await fetch(`http://localhost:3000/api/products/order`, {
                method: "POST",
                body: JSON.stringify(envoiFormulaireEtProduits),
                headers: {
                    "Content-type" : "application/json"
                },
            }) 
                .then((res) => res.json())
                .then((data) => commandeOrderId = data);    
                console.log(commandeOrderId.orderId);
                window.location.href = `confirmation.html?id=${commandeOrderId.orderId}`;

        };
        fetchProductEtId();

    }else {
          alert('Veuillez bien remplir le formulaire ou ajouter des articles dans votre panier')
          
    };


    //-------------------FIN Validation du formulaire---------------------
    //--------------------Validation du formulaire---------------------
    
    

});
