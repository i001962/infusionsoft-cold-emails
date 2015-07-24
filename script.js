// Mixing jQuery and Node.js code in the same file? Yes please!

$(function() {
  var api = require('infusionsoft-api');


  	var infusionsoft = new api.DataContext('appname', 'api-key');
  infusionsoft.Contacts
    .where(Contact.FirstName, 'I001962-test')
    //  .like(Contact.LastName, 'T%')
    .select(Contact.Email, Contact.Id)
    .orderByDescending('LastName')
    .take(100)
    .toArray()
    .done(function(result) {
      console.log(result[0].Email + result[0].Id);
      infusionsoft.Contacts
        .where(Contact.Email, result[0].Email )
        .first()
        .then(function(contact) {
          return infusionsoft.ContactGroupAssigns
            .where(ContactGroupAssign.ContactId, contact.Id)
            .toArray();
        })
        .then(function(cgas) {
          cgas.forEach(function(group) {
            console.log(group.ContactGroup, group.DateCreated);
          });
        });
				    console.log(infusionsoft.ContactService
           .addToGroup(result[0].Id, '174')
				 );
      // infusionsoft.ContactGroups
      // 	.select(ContactGroup.Id)
      // 	.take(100)
      // 	.toArray()
      //
      // 	.done(function(result) {
      // 		console.log(result[0].Id);
      // 		});
    });

//		infusionsoft.addToGroup(ContactGroupAssign.ContactId, '174')
		//console.log(ContactGroupAssign.ContactId + 'trying to add tag here');


});
