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
  var getthistag = $('#m').val() + '%';
  //
  //   infusionsoft.Contacts
  // //    .where(Contact.FirstName, 'P%')
  //     .where(Contact.Id, '4094')
  //     //  .like(Contact.LastName, 'T%')
  //     .select(Contact.FirstName, Contact.LastName, Contact.Email, Contact.Id)
  //     .orderByDescending('LastName')
  //     .take(100)
  //     .toArray()
  //     .done(function(result) {
  //       for (var i = 0; i < result.length; ++i) {
  //         console.log(result[i].Email + result[i].Id);
  //
  //         var li = $('<li><a target="_blank"></a></li>');
  //
  //         li.find('a')
  //           .attr('href:', result[i].Email)
  //           .text(result[i].FirstName + " " + result[i].LastName + " " + result[i].Email + " " + result[i].Id);
  //
  //         li.appendTo(ul);
  //       };
  //     });

  infusionsoft.ContactGroupAssigns
    .where(ContactGroupAssign.ContactGroup, getthistag)
    .select(ContactGroupAssign.ContactGroup, ContactGroupAssign.ContactId)
    .orderByDescending('ContactId')
    .take(100)
    .toArray()
    .done(function(result) {
      for (var i = 0; i < result.length; ++i) {
      //  console.log(result[i].ContactId);
        infusionsoft.Contacts
          .where(Contact.Id, result[i].ContactId)
        //  .select(Contact.Id, Contact.Email)
          .select()
      //    .orderByDescending('Email')
          .take(100)
          .toArray()
          .done(function(result2) {
            for (var j = 0; j < result2.length; ++j) {
              console.log(result2[i].Id + result2[i].Email);
              var li = $('<li><a target="_blank"></a></li>');
              li.find('a')
                .attr('href:', result2[j].Contact.Email)
                .text(result2[j].Id + " " + result[j].Email);
              li.appendTo(ul);
            }
          });
      };
    });

//This works for first email with a tag
    // infusionsoft.ContactGroupAssigns
    // .where(ContactGroupAssign.ContactGroup, getthistag)
    // .first()
    // .then(function(contactgroupassign) {
    //   //  console.log(infusionsoft.Contacts);
    //     return infusionsoft.Contacts
    //         .where(Contact.Id, contactgroupassign.ContactId)
    //         .toArray()
    //         .then(function(matches) {
    //             matches.forEach(function(group) {
    //                 console.log(group.Id, group.Email);
    //             });
    //         });
    // })

};


//		infusionsoft.addToGroup(ContactGroupAssign.ContactId, '174')
//console.log(ContactGroupAssign.ContactId + 'trying to add tag here');
