///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
// CONFIGURATION
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

APP_NAME = "Biscuit' Bar";
APP_VERSION = "1.5";


///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
// FONCTIONS
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

function appInit() {
	$('#app_name').text(APP_NAME);
	$('#app_version').text('v'+APP_VERSION);
}


function resetTotal() {
	currentConsos = 0;
	currentConsosPrice = 0;
	currentConsignes = 0;
	currentTotal = 0;
	arendre = 0;
	currentcatego = 0;



	$("body").hide();
	
	$(".checkout_line").each(function( index ) {
		$(this).children('#conso_nombre').val(0);
		$(this).hide();
	});

	$('.unit-bullet').remove();

	$('#checkout_list_empty').show();

	$("#total-consos").text(currentConsos);
	$("#total-consosprice").text(currentConsosPrice);
	$("#total-consigne").text(currentConsignes);
	$("#total-price").text(currentTotal);
	$("#monnaieArendre").text(currentTotal);
	$("body").fadeIn();
}

function importSettings() {
	var SETTING_AUTOCONSIGNE = window.localStorage.getItem("setting_autoconsigne");
	if (SETTING_AUTOCONSIGNE == "true") {
      $("#test").show();
    }
}






function importCarte() {

    // chargement du xml dans l'onglet Paramètres
    $.ajax({
	   url: "config/carte-consos.xml",
	   dataType: "text",
	   success : function (data) {
	       $("#xml-editarea").text(data);
	   }
	});

	// import xml
    $.ajax({
        type: "GET",
        url: "config/carte-consos.xml",
        dataType: "xml",
        success: function(xml) {
         	$(xml).find('conso').each(function(){

         		// mise en variables
         		var nom = $(this).find('nom').text();
         		var id = $(this).find('id').text();
         		var catego = $(this).find('catego').text();
                var desc = $(this).find('desc').text();
                var prix = $(this).find('prix').text();
                var quantite = $(this).find('quantite').text();
                var backgroundcolor = $(this).find('backgroundcolor').text();
                var textcolor = $(this).find('textcolor').text();

                // grille des consos de l'onglet Commande
				$("ul.grid_carte").append("<li class='conso-button' id='conso-button_"+id+"' style='background-color:"+backgroundcolor+";color:"+textcolor+";' idc='"+id+"' nom='"+nom+"' desc='"+desc+"' prix='"+prix+"'>"+nom+"<div>"+prix+" €</div></li>"); 

				// liste des consos de l'onglet Ticket
				$("ul#checkout_list").append('<li class="checkout_line" id="checkout_'+id+'"><span class="checkout_minus"><i class="fas fa-minus-square"></i></span><span class="checkout_plus"><i class="fas fa-plus-square"></i></span><span class="conso_nom">'+desc+' ('+quantite+' cl)</span><input type="text" class="conso_nombre" name="conso_nombre" id="conso_nombre" maxlength="2" size="1" value="0"/><span>x</span><input type="text" class="conso_prix_unit" name="conso_prix_unit" id="conso_prix_unit" maxlength="5" size="1" value="'+prix+'"/><span> € = </span><input type="text" class="conso_prix_total" name="conso_prix_total" id="conso_prix_total" maxlength="5" size="1" value="0"/><span> € </span><span class="checkout_resetline"><i class="fas fa-trash-alt"></i></span></li>');

				// liste des consos de l'onglet Carte

					// affichage des catégories de consos
					if(catego!=currentcatego) {
						$("ul#carte_liste").append('<h2>'+catego+'</h2>');
						currentcatego = catego;
					}

					// ajout d'une ligne par conso
					$("ul#carte_liste").append(
						'<li>&#9642;&nbsp;'
						+'<span class="carte_conso_nom '+id+'">'+desc+'</span>'
	      				+'<span class="carte_conso_quantite">'+quantite+'</span>'
	      				+'<span class="carte_conso_prix">'+prix+'</span>'
	      				+'</li>'
					)


			}); 
		},
		error: function(){
		    $('#xml_empty').show();
		  }

	});
}


function updateCheckout() {

	$(".checkout_line").each(function( index ) {
		var a = $(this).children('.conso_nombre').val();
		var b = $(this).children('.conso_nom').text();
		var c = "checkout_"+b;

		// gestion de l'affichage ou non de la ligne
		if (a==0) { // si la quantité est de 0 on n'affiche pas la ligne
			$(this).hide();
		}
		else { // sinon on réaffiche (après un reset)
			$(this).show();
		}

		// calcul prix total par consos
		var d = $(this).children('#conso_prix_unit').val();
		var e = a*d
		$(this).children('#conso_prix_total').val(e);
	});

	// calcul nombre de consos
	var sum_nbconsos = 0;
    $('.conso_nombre').each(function() {
        sum_nbconsos += Number($(this).val());
    });
    $("#total-consos").text(sum_nbconsos);

    if (sum_nbconsos == 0) { $('#checkout_list_empty').show(); }
    else { $('#checkout_list_empty').hide(); }

    // calcul prix total sans consignes
	var sum_consos = 0;
    $('.conso_prix_total').each(function() {
        sum_consos += Number($(this).val());
    });
    $("#total-consosprice").text(sum_consos);

	// calcul prix total avec consignes
	sum_consignes = $('#total-consigne').text()
	var sum_total = parseFloat(sum_consignes) + parseFloat(sum_consos); 
    $("#total-price").text(sum_total);
    $("#rappelTotalCommande").text(sum_total);

}


function consigneMoins() {
	currentConsigneTotal = $('#total-consigne').text()
	newcurrentConsigneTotal = parseFloat(currentConsigneTotal) - 1;
 	$("#total-consigne").text(newcurrentConsigneTotal);
 	currentTotal = $('#total-price').text()
	newcurrentTotal = parseFloat(currentTotal) - 1;
	$("#total-price").text(newcurrentTotal);
	$("#rappelTotalCommande").text(newcurrentTotal);
}


function consignePlus() {
	currentConsigneTotal = $('#total-consigne').text()
	newcurrentConsigneTotal = parseFloat(currentConsigneTotal) + 1;
 	$("#total-consigne").text(newcurrentConsigneTotal);
 	currentTotal = $('#total-price').text()
	newcurrentTotal = parseFloat(currentTotal) + 1;
	$("#total-price").text(newcurrentTotal);
	$("#rappelTotalCommande").text(newcurrentTotal);
}



///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
// INITIALISATION
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////


$(document).ready(function(){
	appInit();
    resetTotal();
    importCarte();
    updateCheckout(); 
});



///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
// Elements COMMUNS à tous les onglets
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////


// bouton "nouvelle commande"
$("#reset-button").click(function() {	resetTotal(); });

// gestion de l'affichage on non des totaux
$("#tab_commande").click(function() { $('div#header').show(); $('#reset-button').show(); });
$("#tab_ticket").click(function() { $('div#header').show(); $('#reset-button').show(); });
$("#tab_monnaie").click(function() { $('div#header').hide(); $('#reset-button').show(); });
$("#tab_carte").click(function() { $('div#header').hide(); $('#reset-button').hide(); });
$("#tab_config").click(function() { $('div#header').hide(); $('#reset-button').hide(); });

// boutons d'ajout/retrait de consignes
$(".consigne-moins").click(function() {	consigneMoins(); });
$(".consigne-plus").click(function() {	consignePlus(); });



///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
// ONGLET Commande
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////


// CLICK sur un bouton conso
// méthode "on click" car l'élément n'existe pas à la définition du click()
$('body').on('click', '.conso-button', function(e) {                   

    // récupération des données de la conso
	var a = $(this).attr("idc");
	var b = "checkout_"+a;
	var c = $("#"+b).children('#conso_nombre').val();
	var d = parseFloat(c) + 1;

	// retour d'action: lecture d'un son
	var audio = $('#clicksound')[0];
    audio.play();

    // retour d'action: affichage "bullets"
	$("<div class='unit-bullet'></div>").appendTo("#conso-button_"+a);
	
	// mise à jour des totaux
	$("#"+b).children('#conso_nombre').val(d);

	if (localStorage.getItem("setting_autoConsignes_Pression") == "yes") {
		if ( (a == 'demi') || (a == 'pinte') ) { consignePlus(); }
	}

	if (localStorage.getItem("setting_autoConsignes_Coca") == "yes") {
		if (a == 'coca')  {	consignePlus();	}
	}

	if (localStorage.getItem("setting_autoConsignes_Blida") == "yes") {
		if (a == 'blida')  { consignePlus(); }
	}

	if (localStorage.getItem("setting_autoConsignes_Jus") == "yes") {
		if (a == 'jus')  { consignePlus(); }
	}

	updateCheckout(); 
});



///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
// ONGLET Ticket
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////


// mise à jour manuelle du nombre de consos (champs input)
$("#conso_nombre").on("change paste keyup", function() {
   updateCheckout(); 
});


// CLICK sur le bouton SUPPRIMER
// méthode "on click" car l'élément n'existe pas à la définition du click()
$('body').on('click', '.checkout_resetline', function(e) { 
	$(this).parent().children('#conso_nombre').val(0);
	console.log($(this).find('#conso_nombre').val(0));
	updateCheckout(); 
});


// CLICK sur le bouton -1 (retrait d'une unité à une ligne)
// méthode "on click" car l'élément n'existe pas à la définition du click()
$('body').on('click', '.checkout_minus', function(e) { 
	var audio = $('#clicksound')[0];
    audio.play();
	var c = $(this).parent().children('#conso_nombre').val();
	var d = parseFloat(c) - 1;
	$(this).parent().children('#conso_nombre').val(d);
	updateCheckout(); 
});


// CLICK sur le bouton +1 (ajout d'une unité à une ligne)
// méthode "on click" car l'élément n'existe pas à la définition du click()
$('body').on('click', '.checkout_plus', function(e) { 
	var audio = $('#clicksound')[0];
    audio.play();
	var c = $(this).parent().children('#conso_nombre').val();
	var d = parseFloat(c) + 1;
	$(this).parent().children('#conso_nombre').val(d);
	updateCheckout(); 
});



///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
// ONGLET Monnaie
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////


// CLICK sur un bouton de choix du montant donné (billet sur lequel rendre la monnaie)
$(".monnaieSur").click(function() {

	// sélection graphique du bouton cliqué
	$('.monnaieSur').removeClass('selected');
	$(this).addClass('selected');

	// calcul de la monnaie à rendre
	monnaieSur = $(this).attr("somme");
	currentTotal = $('#total-price').text()
	arendre = parseFloat(monnaieSur) - parseFloat(currentTotal);

	// mise à jour de l'affichage de la monnaie à rendre
	$("#monnaieArendre").text(arendre);
});



// OPTION afficher header ou non 
if (localStorage.getItem("setting_showHeader") == "yes") {
    $("header").show();
    $( '#setting_showHeader' ).prop( "checked", true );
}
else if (localStorage.getItem("setting_showHeader") == "no"){
    $("header").hide();
    $( '#setting_showHeader' ).prop( "checked", false );
}
$( "#setting_showHeader" ).on("click", function() {
    if( $( "header" ).is(":visible")) {
        $("header").hide();
        $( '#setting_showHeader' ).prop( "checked", false );
        localStorage.setItem("setting_showHeader","no");
    }
    else {
        $("header").show();
        $( '#setting_showHeader' ).prop( "checked", true );
        localStorage.setItem("setting_showHeader","yes");
    }
});

// OPTION afficher icones des tabs ou non 
if (localStorage.getItem("setting_showTabsicons") == "yes") {
    $(".cd-tabs__list i").show();
    $(".cd-tabs__item").removeClass('cd-tabs__item--noicon');
    $( '#setting_showTabsicons' ).prop( "checked", true );
}
else if (localStorage.getItem("setting_showTabsicons") == "no"){
    $(".cd-tabs__list i").hide();
    $(".cd-tabs__item").addClass('cd-tabs__item--noicon');
    $( '#setting_showTabsicons' ).prop( "checked", false );
}
$( "#setting_showTabsicons" ).on("click", function() {
    if( $( ".cd-tabs__list i" ).is(":visible")) {
        $(".cd-tabs__list i").hide();
        $(".cd-tabs__item").addClass('cd-tabs__item--noicon');
        $( '#setting_showTabsicons' ).prop( "checked", false );
        localStorage.setItem("setting_showTabsicons","no");
    } 
    else {
        $(".cd-tabs__list i").show();
        $(".cd-tabs__item").removeClass('cd-tabs__item--noicon');
        $( '#setting_showTabsicons' ).prop( "checked", true );
        localStorage.setItem("setting_showTabsicons","yes");
    }
});

// OPTION ajouter une consigne automatiquement à chaque conso

	// biere pression
	if (localStorage.getItem("setting_autoConsignes_Pression") == "yes") {
	    $( '#setting_autoConsignes_Pression' ).prop( "checked", true );
	}
	else if (localStorage.getItem("setting_autoConsignes_Pression") == "no"){
	    $( '#setting_autoConsignes_Pression' ).prop( "checked", false );
	}
	$( "#setting_autoConsignes_Pression" ).on("click", function() {
	    if (localStorage.getItem("setting_autoConsignes_Pression") == "yes"){
	        $('#setting_autoConsignes_Pression').prop( "checked", false );
	        localStorage.setItem("setting_autoConsignes_Pression","no");
	    } 
	    else {
	        $( '#setting_autoConsignes_Pression' ).prop( "checked", true );
	        localStorage.setItem("setting_autoConsignes_Pression","yes");
	    }
	});

	// blida
	if (localStorage.getItem("setting_autoConsignes_Blida") == "yes") {
	    $( '#setting_autoConsignes_Blida' ).prop( "checked", true );
	}
	else if (localStorage.getItem("setting_autoConsignes_Blida") == "no"){
	    $( '#setting_autoConsignes_Blida' ).prop( "checked", false );
	}
	$( "#setting_autoConsignes_Blida" ).on("click", function() {
	    if (localStorage.getItem("setting_autoConsignes_Blida") == "yes"){
	        $('#setting_autoConsignes_Blida').prop( "checked", false );
	        localStorage.setItem("setting_autoConsignes_Blida","no");
	    } 
	    else {
	        $( '#setting_autoConsignes_Blida' ).prop( "checked", true );
	        localStorage.setItem("setting_autoConsignes_Blida","yes");
	    }
	});

	// coca
	if (localStorage.getItem("setting_autoConsignes_Coca") == "yes") {
	    $( '#setting_autoConsignes_Coca' ).prop( "checked", true );
	}
	else if (localStorage.getItem("setting_autoConsignes_Coca") == "no"){
	    $( '#setting_autoConsignes_Coca' ).prop( "checked", false );
	}
	$( "#setting_autoConsignes_Coca" ).on("click", function() {
	    if (localStorage.getItem("setting_autoConsignes_Coca") == "yes"){
	        $('#setting_autoConsignes_Coca').prop( "checked", false );
	        localStorage.setItem("setting_autoConsignes_Coca","no");
	    } 
	    else {
	        $( '#setting_autoConsignes_Coca' ).prop( "checked", true );
	        localStorage.setItem("setting_autoConsignes_Coca","yes");
	    }
	});

	// jus
	if (localStorage.getItem("setting_autoConsignes_Jus") == "yes") {
	    $( '#setting_autoConsignes_Jus' ).prop( "checked", true );
	}
	else if (localStorage.getItem("setting_autoConsignes_Jus") == "no"){
	    $( '#setting_autoConsignes_Jus' ).prop( "checked", false );
	}
	$( "#setting_autoConsignes_Jus" ).on("click", function() {
	    if (localStorage.getItem("setting_autoConsignes_Jus") == "yes"){
	        $('#setting_autoConsignes_Jus').prop( "checked", false );
	        localStorage.setItem("setting_autoConsignes_Jus","no");
	    } 
	    else {
	        $( '#setting_autoConsignes_Jus' ).prop( "checked", true );
	        localStorage.setItem("setting_autoConsignes_Jus","yes");
	    }
	});







