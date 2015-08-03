// Using index.html for input to call Infusionsoft and find all contacts for a tag
var ul = $('.demo ul');
var dd = $('.tagsdropdown select');
var mySelect = $("#tagsdropdown");
var mySelectTemplates = $("#templatesdropdown");
var api = require('infusionsoft-api');
var infusionsoft = new api.DataContext($('#l').val(), $('#api').val());

$(document).ready(function() {
  console.log("ready!");
});

document.getElementById("myBtn").addEventListener("click", displayTags);
document.getElementById("tagsdropdown").addEventListener("change", displayContacts);
document.getElementById("templatesdropdown").addEventListener("change", displayTemplates);

function displayTags() {
  loadtagdropdown();
  loadtemplatedropdown()
}
function displayTemplates() {
//  loadtemplatedropdown()
}
function displayContacts() {
  getInfsContacts();
}
function loadtagdropdown() {
  var getthistag = "%"; //select all tags

  infusionsoft.ContactGroupAssigns
    .where(ContactGroupAssign.ContactGroup, getthistag)
    .select(ContactGroupAssign.GroupId, ContactGroupAssign.ContactGroup)
    .orderByDescending('ContactGroup')
    .take(1000)
    .toArray()
    .done(function(alltags) {
      for (var j = 0; j < alltags.length; ++j) {

        mySelect
          .append($("<option></option>")
            .attr("value", alltags[j].GroupId)
            .text(alltags[j].ContactGroup));
      }
      var usedNames = {};
      $("select[name='dropdowntags'] > option").each(function () {
          if(usedNames[this.text]) {
              $(this).remove();
          } else {
              usedNames[this.text] = this.value;
          }
      });
});
}

function loadtemplatedropdown() {
  var getthistag = "%"; //select all Templates

  infusionsoft.Templates
    .where(Template.Id, getthistag)
    .select(Template.Id, Template.PieceTitle, Template.Categories)
    .orderByDescending('Categories')
    .take(1000)
    .toArray()
    .done(function(alltemplates) {
      for (var j = 0; j < alltemplates.length; ++j) {

        mySelectTemplates
          .append($("<option></option>")
            .attr("value", alltemplates[j].Id)
            .text(alltemplates[j].PieceTitle));
      }
      var usedNames = {};
      $("select[name='dropdowntemplates'] > option").each(function () {
          if(usedNames[this.text]) {
              $(this).remove();
          } else {
              usedNames[this.text] = this.value;
          }
      });
});
}
function getInfsContacts() {
  var list = document.getElementById("demoul"); // Get the <ul> element with id="myList"
  //  if (list != 'null') {
  //  console.log(list);
  while (list.hasChildNodes()) {
    list.removeChild(list.firstChild);
  };
  //};
  console.log('done clearing ULs');
var getthistag = $( "#tagsdropdown option:selected" ).text();
console.log(getthistag);

  infusionsoft.ContactGroupAssigns
    .where(ContactGroupAssign.ContactGroup, getthistag)
    .select(ContactGroupAssign.ContactGroup, ContactGroupAssign.ContactId)
    .orderByDescending('ContactId')
    .take(100)
    .toArray()
    .done(function(result) {
      for (var i = 0; i < result.length; ++i) {
        // console.log(result[i]);
        // var li = $('<li><h2></h2></li>');
        // li.find('h2')
        //   .text(result[i].ContactGroup);
        // li.appendTo(ul);
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
