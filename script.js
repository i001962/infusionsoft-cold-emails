// Using index.html for input to call Infusionsoft and find all contacts for a tag
var ul = $('.demo ul');
var dd = $('.tagsdropdown select');
var mySelect = $("#tagsdropdown");
var mySelectTemplates = $("#templatesdropdown");
var api = require('infusionsoft-api');
var infusionsoft = new api.DataContext($('#l').val(), $('#api').val());

$(document).ready(function() {
      console.log("ready!");
      // var $chromeTabsExampleShell = $('.chrome-tabs-shell')
  // chromeTabs.init({
  //   $shell: $chromeTabsExampleShell,
  //   minWidth: 45,
  //   maxWidth: 160
  // });
  // chromeTabs.addNewTab($chromeTabsExampleShell, {
  //   favicon: './eager-favicon.ico',
  //   title: 'Cold Send',
  //   data: {
  //     timeAdded: +new Date()
  //   }
  // });
  //
  //
  // $chromeTabsExampleShell.bind('chromeTabRender', function() {
  //     var $currentTab = $chromeTabsExampleShell.find('.chrome-tab-current');
  //     if ($currentTab.length) {
  //       //      console.log('Current tab index', $currentTab.index(), 'title', $.trim($currentTab.text()), 'data', $currentTab.data('tabData').data);
  //       //  var li = $('<li><a target="_blank"></a></li>');
  //       console.log('Active tab event');
  //       var webview = document.getElementById("foo");
  //       var url = "http://signin.infusionsoft.com/login?";
  //       webview.addEventListener('foo', function(e) {
  //   require('shell').openExternal(e.url);
  // });
  //
  //       var link = document.getElementById("demoul");
  //       var link2 = document.getElementById("infsframe");
  //       if (link.style.display) {
  //           link.style.display = 'none';
  //       //  $("#demoul").hide();
  //         $("#infsframe").show();
  //         console.log('showing demoul hiding webview');
  //         } else {
  //           link.style.display = 'block';
  //                 $("#demoul").show();
  //           $("#infsframe").hide();
  //           console.log('none' + link);
  //         }
  //       };
  //     });
   });
      document.getElementById("myBtn").addEventListener("click", displayTags); document.getElementById("tagsdropdown").addEventListener("change", displayContacts); document.getElementById("templatesdropdown").addEventListener("change", displayTemplates);
      document.getElementById("myBtnlaunch").addEventListener("click", logColdEmails);

    function displayTags() {
      loadtagdropdown();
      loadtemplatedropdown()
    }

    function logColdEmails() {
      // var getthistag = "%"; //select all tags
      // contactId, fromName,
      //         fromAddress, toAddress, ccAddresses, bccAddresses, contentType,
      //         subject, htmlBody, textBody, header, receivedDate, sentDate,
      //         emailSentType
        infusionsoft.APIEmailService
              .attachEmail('4069', 'testsender@kmm.com', 'i001962@gmail.com' ,"","","","subjectline goes here" ,"","text body stuff","","","")
              .then(function(attachEmail) {
                  return infusionsoft.attachEmail.emailSentType;
              })
              .then(function(attachEmail) {
                  console.log('Hello ' + emailSentType + ' ' + attachEmail.LastName);
              })
              .fail(function(err) {
                  console.log('uh oh: ' + err);                                 
              });
                console.log('DONE logging email');
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
