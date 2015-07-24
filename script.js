// Mixing jQuery and Node.js code in the same file? Yes please!

$(function(){
	var api = require('infusionsoft-api');


	var infusionsoft = new api.DataContext('appname', 'api-key');
	infusionsoft.Contacts
	    .where(Contact.FirstName, 'Kevin')
	  //  .like(Contact.LastName, 'T%')
	    .select(Contact.Email)
	    .orderByDescending('LastName')
	    .take(100)
	    .toArray()
	    .done(function(result) {
	        console.log(result[0].Email);
	    });



});
