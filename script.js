// Using index.html for input to call Infusionsoft and find all contacts for a tag
var ul = $('.demo ul');
var dd = $('.tagsdropdown select');
var mySelect = $("#tagsdropdown");
var mySelectTemplates = $("#templatesdropdown");
var api = require('infusionsoft-api');
var infusionsoft = new api.DataContext($('#l').val(), $('#api').val());
var mergefieldmu = [];
var mergefieldINFSList = [];
//mergefiledtech, mergeObject, mergeField, mergeregex
var mergefieldvalue = [
  [01, 02, 03, 04],
  [10, 11, 12, 13]
];
var sendingfrom = "i001962@gmail.com"; // hack until config settings page
var modesetto = "infusionsoft"; // hack until config settings page
var currenttemplate = "";
var GoogleSpreadsheet = require("google-spreadsheet");
// spreadsheet key is the long id in the sheets URL
var my_sheet = new GoogleSpreadsheet($('#gdoc')[0].value);

$(document).ready(function() {
  console.log("ready!");
  //  tinymce.init({selector:'textarea'});
});

function replaceMergefields(contactsfieldstomerge) {
  //  console.log(contactsfieldstomerge);
  var str = currenttemplate;
  var newstr = "";
  //Find each mergefiledmu in the currenttemplate and replace with contact's values
  //str.match(/~(.*)~/g)
  for (var k = 0; k < contactsfieldstomerge.length; ++k) {
    if (contactsfieldstomerge[k][3] && contactsfieldstomerge[k][4]) {
      var re = new RegExp(contactsfieldstomerge[k][3]);
      console.log(re);

      //console.log(mergefieldmu);

        console.log('made it ' + contactsfieldstomerge[k][4])
        var propertyName = contactsfieldstomerge[k][4];
        //do something
        str = str.replace(re, propertyName);
      
    };

  };
  // oranges are round, and oranges are juicy.
  //mergefieldmu // array of mergefiles eg ~Contact.mergefields~
  // find string in template to replace str.match(/~(.*)~/g);
  // lookup found string from template in the mergefiledmu array
  //if found replact the strin in the template with value form
  // the object emailthisperson which contains the values in the same array order as
  // must align array positions as emailthisperson will only have Contact fields not ~Link or ~User_
  //console.log(str);
  console.log(str);
  currenttemplate = str;
}

function loadInfsContact(theid) {
  var findthese = [];
  var countfields = 0;
  for (var k = 0; k < mergefieldvalue.length; ++k) {
    console.log(mergefieldvalue[k][1]);
    //Build Array of specific customer fields for INFS to return for a given contact
    if (mergefieldvalue[k][1] == 'Contact') {
      findthese[countfields] = mergefieldvalue[k][2];
      countfields++;
    };
  };
  var findthesefields = Object.keys(findthese).map(function(key) {
    return findthese[key]
  });
  console.log(theid);
  console.log(findthesefields);
  infusionsoft.ContactService
    .load(theid, findthesefields)
    .done(function(result5) {
      console.log(result5);
      // add these results to the mergefieldvalue array of arrays - unbalanced
      for (var i = 0; i < mergefieldvalue.length; ++i) {
        if (mergefieldvalue[i][1] == 'Contact') {
          for (var m = 0; m < findthesefields.length; ++m) {
            if (mergefieldvalue[i][2] == findthesefields[m]) {
              mergefieldvalue[i].push(result5[findthesefields[m]]);
            }
          };
        }
      }
      replaceMergefields(mergefieldvalue);
      //  sendemail(result4);
    });
}

function getGDocContacts() {
  removecontactlist();
  my_sheet.getRows(1, function(err, row_data) {
    //  console.log('pulled in ' + row_data.length + ' rows');
    var calls = [];
    for (var k = 0; k < row_data.length; ++k) {
      //    console.log(row_data[k]);
      var li = $('<li><a target="_blank"></a><input type="checkbox" id="' + row_data[k].id + '" name="sendnow" class="sendnow" value="yes"> Check to send email<br></li>');
      li.find('a')
        .attr('name', row_data[k].id)
        .text(row_data[k].firstname + " " + row_data[k].lastname + " " + row_data[k].email + " " + row_data[k].id + " ");
      li.appendTo(ul);
      $(li[k]).bind('click', function(event) {
        logColdEmails(event);
      })
    };
  });
}

function removecontactlist() {
  console.log('clearing email to do list');
  var currentcontacts = document.getElementById("demoul"); // Get the <div> element with id="viewtemplate"
  while (currentcontacts.hasChildNodes()) {
    currentcontacts.removeChild(currentcontacts.firstChild);
    console.log('removing child');

  };
}



function setSendFrom() {
  sendingfrom = $("#emaildropdown option:selected").attr('value');
  console.log(sendingfrom);
}

function loaddropdowns() {
  loadtemplatedropdown()
  loadtagdropdown();
  //  loadmergefieldcontext(); //get 'contact' (only) mergefiled names from infs

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

  console.log('you are sending meail to' + emailthisperson + 'from email account: ' + sendingfrom);
  console.log(emailthisperson);
  //console.log('you are sending meail to' + emailthisperson.target.fromAddress);
  var email = require("./node_modules/emailjs/email");
  var testing = "<div>food safety scores? <br/><br/>We have 1634 of your brand's locations in our national food safety database. I'd like to hear your feedback on our scoring methodology before we launch this fall. <br/><br/>Are you available on Tuesday afternoon for a call?</div>";
  var server = email.server.connect({
    user: "i001962",
    password: "HAeGzEGtdvh34r",
    host: "smtp.sendgrid.net",
    tls: {
      ciphers: "SSLv3"
    }

  });
  // console.log(currenttemplate);
  //		send the message and get a callback with an error or details of the message that was sent
  server.send({
    text: 'this is first test',
    from: sendingfrom,
    to: "i001962@gmail.com",
    //   to:      emailthisperson.target.id,

    subject: "test from electron",
    attachment: [{
      //  data: $("#mainContent").html(),
      data: currenttemplate,
      //  data: testing,
      alternative: true //research sendgrid if necessary
        //  alternative: false //research sendgrid if necessary
    }]
  }, function(err, message) {
    console.log(err || message);
  });
  // console.log($("#mainContent").html()); //see the html that was sent

}

function logColdEmails(contactidtoemail) {
  //  console.log(contactidtoemail.target.id);
  loadInfsContact(contactidtoemail.target.id);

  counterUp(); //increment emails sent counter for ux
  //hiding li after checkbox to send email
  $('ul li')
    .filter(function() {
      //  return $(this).find('input:checked').length == 0;
      return $(this).find('input:checkbox:not(:checked)').length == 0;
    })
    .hide()
}

function cleartemplate() {
  var cleartemplate = document.getElementById("viewtemplate"); // Get the <div> element with id="viewtemplate"
  while (cleartemplate.hasChildNodes()) {
    cleartemplate.removeChild(cleartemplate.firstChild);
  };
}

function findmergefields() {
  var str = currenttemplate;
  mergefieldmu = str.match(/~(.*)~/g);
  mergefieldvalue = mergefieldmu;

  //console.log(mergefieldvalue);
  for (var j = 0; j < mergefieldmu.length; ++j) {
    // split to find INFS object eg Customer and field names eg email
    var splitmergefields = mergefieldmu[j].match(/[^~.]+/g);
    //    mergefieldvalue[j] = [mergefieldmu[j], splitmergefields[0], splitmergefields[1], " "];
    //build the regex needed to replace token in template for each mergefieldvalue
    var re = new RegExp(mergefieldmu[j], "g");
    //  console.log(re);

    //  Object.keys(myHash).map(function(key) { return [key, myHash[key]]; })
    mergefieldvalue[j] = [mergefieldmu[j], splitmergefields[0], splitmergefields[1], re];

    // if (splitmergefields[0] == 'Contact') {
    //   mergefieldINFSList[j] = splitmergefields[1];
    // }
  };
  console.log(mergefieldvalue);
  //flatten object to array
  // var arr = Object.keys(mergefieldINFSList).map(function(key) {
  //   return mergefieldINFSList[key]
  // });
  // mergefieldINFSList = arr;
  // console.log(mergefieldINFSList);
}


function displayTemplate() {
  cleartemplate();
  var getthistemplate = $("#templatesdropdown option:selected").attr("value");
  infusionsoft.APIEmailService
    .getEmailTemplate(getthistemplate)
    .done(function(result3) {
      //    console.log(result3);
      $(".viewtemplate").append(result3.htmlBody);
      //    $( ".viewtemplate" ).append( result3.htmlBody );
      // strip can spam from display area as well as in global variable
      $(".viewtemplate").find('tr').last().remove();
      currenttemplate = $(".viewtemplate").html();
      findmergefields();

    });
}


// function loadmergefieldcontext() {
//   infusionsoft.APIEmailService
//     .getAvailableMergeFields("Contact")
//     .done(function(allmfs) {
//       //    console.log(allmfs);
//       for (var j = 0; j < allmfs.length; ++j) {
//         //  console.log(allmfs[j])
//         mergefieldmu[allmfs[j]] = 'not-set';
//       }
//       //   console.log(mergefieldmu);
//     });
//
// }

function displayContacts() {
  getInfsContacts();
  counterZero();
}

function displayContactsGDoc() {
  getGDocContacts();
  counterZero();
}

function loadtagdropdown() {
  var getthistag = "%"; //select all tags

  infusionsoft.ContactGroupAssigns
    .where(ContactGroupAssign.ContactGroup, getthistag)
    .select(ContactGroupAssign.GroupId, ContactGroupAssign.ContactGroup)
    .orderByDescending('ContactGroup')
    .take(10000)
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

  //  var getthistag = "%"; //select all Templates
  infusionsoft.Templates
    //  .where(Template.Id, getthistag)
    .where(Template.PieceType, 'Email')
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
  removecontactlist();

  var getthistag = $("#tagsdropdown option:selected").text();
  //  console.log(getthistag);

  infusionsoft.ContactGroupAssigns
    .where(ContactGroupAssign.ContactGroup, getthistag)
    .select(ContactGroupAssign.ContactGroup, ContactGroupAssign.ContactId)
    .orderByDescending('ContactId')
    .take(100)
    .toArray()
    .done(function(result) {
      for (var i = 0; i < result.length; ++i) {
        infusionsoft.Contacts
          .where(Contact.Id, result[i].ContactId)
          .select(Contact.FirstName, Contact.LastName, Contact.Email, Contact.Id)
          .orderByDescending('Email')
          .take(100)
          .toArray()
          .done(function(result2) {
            var calls = [];
            for (var j = 0; j < result2.length; ++j) {
              var li = $('<li><a target="_blank"></a><input type="checkbox" id="' + result2[j].Id + '" name="sendnow" class="sendnow" value="yes"> Check to send email<br></li>');
              li.find('a')
                .attr('name', result2[j].Id)
                .text(result2[j].FirstName + " " + result2[j].LastName + " " + result2[j].Email + " " + result2[j].Id + " ");
              li.find('input')
                .attr('name', result2[j].Id);

              li.appendTo(ul);
              $(li[j]).bind('click', function(event) {
                logColdEmails(event);
              });
            }
          });
      };
    });
};

function showProps(obj, objName) {
  var result = "";
  //  console.log(obj);
  for (var i in obj) {
    if (obj.hasOwnProperty(i)) {
      //result += obj[i];
      console.log(i);
      result += i + ',';
    }
  }
  return result;
}

function setMode() {
  removecontactlist();
  modesetto = $("#modedropdown option:selected").attr('value');
  //  console.log(modesetto);

  if (modesetto == 'standalone') {
    //    console.log('mode set to standalone');
    $("#standaloneconfig").show();
    $("#infsconfig").hide();
    $("#viewtemplate").hide();
    currenttemplate = "";
  } else {
    //    console.log('mode set to infs');
    $("#standaloneconfig").hide();
    $("#infsconfig").show();
    $("#viewtemplate").show();
    currenttemplate = "";
    //  loadmergefieldcontext();

  };
}

document.getElementById("modedropdown").addEventListener("change", setMode);
document.getElementById("emaildropdown").addEventListener("change", setSendFrom);
document.getElementById("myBtn").addEventListener("click", loaddropdowns);
document.getElementById("tagsdropdown").addEventListener("change", displayContacts);
document.getElementById("templatesdropdown").addEventListener("change", displayTemplate);
document.getElementById("myBtnlaunch").addEventListener("click", displayContactsGDoc);

//		infusionsoft.addToGroup(ContactGroupAssign.ContactId, '174')
//console.log(ContactGroupAssign.ContactId + 'trying to add tag here');
