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
document.getElementById("templatesdropdown").addEventListener("change", displayTemplate);
document.getElementById("myBtnlaunch").addEventListener("click", displayTemplate);


function displayTags() {
  loadtagdropdown();
  loadtemplatedropdown()
}

function counterUp() {
  $('#countemails').html(function(i, val) {
    return +val + 1
  });
}

function counterZero() {
  $('#countemails').html(function(i, val) {
    return +0
  });
}
function sendemail(emailthisperson) {
  console.log('you are sending meail to' + emailthisperson.target.id);
//  console.log(emailthisperson.target.id + $("[id=s]").attr('value')+ $("[id=b]").attr('value'));

}
function logColdEmails(contactidtoemail) {
    sendemail(contactidtoemail); //  console.log(contactidtoemail.target.id);
    counterUp(); //increment emails sent counter for ux
    //hiding li after checkbox to send email
    $('ul li')
    .filter(function() {
      //  return $(this).find('input:checked').length == 0;
      return $(this).find('input:checkbox:not(:checked)').length == 0;
    })
    .hide()
  }

  function displayTemplate() {
    var getthistemplate = $("#templatesdropdown option:selected").attr("value");
    //console.log(getthistag);
    var currenttemplate = document.getElementById("viewtemplate"); // Get the <div> element with id="viewtemplate"
    while (currenttemplate.hasChildNodes()) {
      currenttemplate.removeChild(currenttemplate.firstChild);
    };
    infusionsoft.APIEmailService
    .getEmailTemplate(getthistemplate)
    .done(function(result3) {

          //  console.log(result3.htmlBody);
            $( ".viewtemplate" ).append( result3.htmlBody );
        //    $( "#viewtemplate" ).val( result3.htmlBody );
        $( ".viewtemplate" ).find('tr').last().remove();
        });

  }

  function displayContacts() {
    getInfsContacts();
    counterZero();
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
        $("select[name='dropdowntags'] > option").each(function() {
          if (usedNames[this.text]) {
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
        $("select[name='dropdowntemplates'] > option").each(function() {
          if (usedNames[this.text]) {
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
    var getthistag = $("#tagsdropdown option:selected").text();
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
              var calls = [];
              for (var j = 0; j < result2.length; ++j) {
                var li = $('<li><a target="_blank"></a><input type="checkbox" id="' + result2[j].Email + '" name="sendnow" class="sendnow" value="yes"> Check to send email<br></li>');
                li.find('a')
                  .attr('name', result2[j].Email)
                  .text(result2[j].FirstName + " " + result2[j].LastName + " " + result2[j].Email + " " + result2[j].Id + " ");
                li.appendTo(ul);
                // calls[j] = function() {
                //   console.log('Sent for you');
                //   logColdEmails(result2[j].Id);
                //   //  cleanupLi();
                // };
                console.log('before event handler');
                $(li[j]).bind('click', function( event ){
                            logColdEmails(event);
                          });
              }
            });
        };
      });
  };

  //		infusionsoft.addToGroup(ContactGroupAssign.ContactId, '174')
  //console.log(ContactGroupAssign.ContactId + 'trying to add tag here');
