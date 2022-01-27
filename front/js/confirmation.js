//- Récupération de la chaine de requète dans l'url
const urlId = window.location.search;

console.log(urlId)

//- Extraction de l'Id
const urlSearchParams = new URLSearchParams(urlId);
//- Récupere le numero de la commande
const idOrderNumber = urlSearchParams.get("id");

console.log(idOrderNumber)
//- Affiche le numéro de la commande
document.getElementById("orderId").innerHTML = idOrderNumber;

