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
document.getElementById("myBtnlaunch").addEventListener("click", logColdEmails);

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

function logColdEmails(contactidtoemail) {
  // var checkedValue = $(":checkbox:checked").parent().find("a").attr("name");
  //  console.log(checkedValue);
    $('ul li')
    .filter(function() {
      //  return $(this).find('input:checked').length == 0;
      return $(this).find('input:checkbox:not(:checked)').length == 0;
    })
    .hide()
    //console.log($(this).find('input:checkbox:not(:checked)').parent().find('a').attr('name'))

    counterUp();

  }

  function displayTemplates() {
    //  loadtemplatedropdown()
    counterZero();
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
                var li = $('<li><a target="_blank"></a><input type="checkbox" id="sendnow" name="sendnow" class="sendnow" value="yes"> Check to send email<br></li>');
                li.find('a')
                  .attr('name', result2[j].Email)
                  .text(result2[j].FirstName + " " + result2[j].LastName + " " + result2[j].Email + " " + result2[j].Id + " ");
                li.appendTo(ul);
                calls[j] = function() {
                  console.log('Sent for you');
                  logColdEmails(result2[j].Id);
                  //  cleanupLi();
                };
                console.log('before event handler');
                li[j].addEventListener('click', logColdEmails);

                //      li[j].checkbox.addEventListener('click', logColdEmails);


              }

            });
        };
      });
  };

  //		infusionsoft.addToGroup(ContactGroupAssign.ContactId, '174')
  //console.log(ContactGroupAssign.ContactId + 'trying to add tag here');
