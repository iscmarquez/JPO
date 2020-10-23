$(document).ready(function (){

    // SUBMIT FORM
    $("#formulaire").submit(function(event) {
     // Prevent the form from submitting via the browser
     console.log("Submit!!");
     event.preventDefault();
     processData();
 });
});

function processData(){

const form2 = $("#formulaire");
const form = document.getElementById("formulaire")
console.log("FORM: ", form, "TYPE:",typeof(form));

var data = {};
   data.username = form.username.value;
   data.email = form.email.value;
submitForm(data);

}

function submitForm(data){
console.log('DATA:', data);
var settings = {
   "url": "/PortesOuvertsConfig/forgetuser/User",
   "method": "POST",
   "timeout": 0,
   "headers": {
     "Content-Type": "application/json"
   },
   "data": JSON.stringify(data)
};
console.log(settings);
 
$.ajax(settings).done(function (response) {
 console.log(response);
 if (response.success){
     alert("Le mot de passe a été envoyée avec succès à l'adresse électronique enregistrée");
     document.getElementById('formulaire').reset();
 }
 else
     alert("Utilisateur ou courriel non valide")
 });
}