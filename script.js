// Using index.html for input to call Infusionsoft and find all contacts for a tag
document.getElementById("myBtn").addEventListener("click", displayDate);

function displayDate() {
  console.log($('#l').val());
  console.log($('#m').val());
  console.log($('#api').val());
//  document.getElementById("demo").ul = getInfsResults();
  getInfsResults();
}

function getInfsResults() {
  //  $('#m').val('');
  $('.demo ul').val('');
  // var s = document.getElementById("demo").ul;
  //           s.value = " ";

  var ul = $('.demo ul');
  var api = require('infusionsoft-api');
  var infusionsoft = new api.DataContext($('#l').val(), $('#api').val());
  var getthistag = $('#m').val() + '%';

  infusionsoft.ContactGroupAssigns
    .where(ContactGroupAssign.ContactGroup, getthistag)
    .select(ContactGroupAssign.ContactGroup, ContactGroupAssign.ContactId)
    .orderByDescending('ContactId')
    .take(100)
    .toArray()
    .done(function(result) {
      for (var i = 0; i < result.length; ++i) {
    //    console.log(result[i]);
        infusionsoft.Contacts
          .where(Contact.Id, result[i].ContactId)
          .select(Contact.FirstName, Contact.LastName, Contact.Email, Contact.Id)
          .orderByDescending('Email')
          .take(100)
          .toArray()
          .done(function(result2) {
        //    console.log(result2);
            for (var j = 0; j < result2.length; ++j) {
            var li = $('<li><a target="_blank"></a></li>');
            li.find('a')
              .attr('href:', result2[j].Email)
              .text(result2[j].FirstName + " " + result2[j].LastName + " " + result2[j].Email + " " + result2[j].Id);
            li.appendTo(ul);
          }
          });
      };
    });
};


//		infusionsoft.addToGroup(ContactGroupAssign.ContactId, '174')
//console.log(ContactGroupAssign.ContactId + 'trying to add tag here');
