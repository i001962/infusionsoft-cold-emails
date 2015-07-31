// Mixing jQuery and Node.js code in the same file? Yes please!
document.getElementById("myBtn").addEventListener("click", displayDate);

function displayDate() {
  console.log($('#l').val());
  console.log($('#m').val());
  console.log($('#api').val());
  document.getElementById("demo").ul = getInfsResults();
}

function getInfsResults() {
//  $('#m').val('');
  $('.demo ul').val('');
  var ul = $('.demo ul');
  var api = require('infusionsoft-api');
  var infusionsoft = new api.DataContext($('#l').val(), $('#api').val());
  infusionsoft.Contacts
    .where(Contact.FirstName, 'P%')
    //  .like(Contact.LastName, 'T%')
    .select(Contact.FirstName,Contact.LastName,Contact.Email, Contact.Id)
    .orderByDescending('LastName')
    .take(100)
    .toArray()
    .done(function(result) {
      for (var i = 0; i < result.length; ++i) {
        console.log(result[i].Email + result[i].Id);

        var li = $('<li><a target="_blank"></a></li>');

        li.find('a')
          .attr('href:', result[i].Email)
          .text(result[i].FirstName + " "+ result[i].LastName +" "+ result[i].Email +" "+ result[i].Id);

        li.appendTo(ul);
      };
      //
      // infusionsoft.Contacts
      //   .where(Contact.Email, result[0].Email)
      //   .first()
      //   .then(function(contact) {
      //     return infusionsoft.ContactGroupAssigns
      //       .where(ContactGroupAssign.ContactId, contact.Id)
      //       .toArray();
      //   })
      //   .then(function(cgas) {
      //     cgas.forEach(function(group) {
      //       console.log(group.ContactGroup, group.DateCreated);
      //     });
      //   });
      // console.log(infusionsoft.ContactService
      //   .addToGroup(result[0].Id, '174')
      // );
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
};
