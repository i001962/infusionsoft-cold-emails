// Using index.html for input to call Infusionsoft and find all contacts for a tag
var currentversion = 'Version 0.0.5';
var ul = $('.demo ul');
var dd = $('.tagsdropdown select');
var mySelect = $("#tagsdropdown");
var mySelectTemplates = $("#templatesdropdown");
var api = require('infusionsoft-api');
require('electron-cookies')
var infusionsoft = new api.DataContext($('#l').val(), $('#api').val());
var mergefieldmu = [];
var mergefieldINFSList = [];
var sendtoemailarrayposition = 100;
//var currentsubjectline = "";
var host = $('#host').val();
var user = $('#user').val();
var pass = $('#pass').val();
var ssl = $('#ssl').val();
var tls = $('#tls').val();
var port = $('#port').val();
var debugmodeon = false;
var removeTagchecked = false;
var usebccflag = false;
var today = "";
var dayofweektext = "";
var DayOfMonthtext = "";
var MonthOfYeartext = "";
var Monthtext = "";
var Yeartext = "";
var mergefieldtable = "";
var coltitles = "";
var contactselectfields = "";
// var coltitlesarray = [{title: "Send"}];
var rowobj = {};
var coltitlesarray = [rowobj];
var rowtoadd = [];
//mergefiledtech, mergeObject, mergeField, mergeregex
var mergefieldvalue = [
  [01, 02, 03, 04],
  [10, 11, 12, 13]
];
var sendingfrom = $("#emaildropdown option:selected").attr('value');
var modesetto = "infusionsoft"; // hack until config settings page
var currenttemplate = "";
var currentsubjectline = "";
var GoogleSpreadsheet = require("google-spreadsheet");
// spreadsheet key is the long id in the sheets URL
var my_sheet = new GoogleSpreadsheet($('#gdoc')[0].value);
var countertemp = 0;

$(document).ready(function() {
  console.log("ready!");
  $('#currentversion').html(function(i, val) {
    return currentversion
  });
  $("#emailmodes").hide();
  $('#contacttable').dataTable({
    bSort: false,
    processing: true, //??
    //  serverSide: true,
    bDeferRender: true,
    autoFill: true,
    aoColumns: [{
      sWidth: "45%"
    }, {
      sWidth: "45%"
    }, {
      sWidth: "10%",
      bEnable: false,
      aTargets: [-1, -2, -3],
      bSearchable: false,
      bSortable: false
    }],
    "scrollY": "100",
    "scrollCollapse": true,
    "info": true,
    "paging": true
  });

  //Set Accorion status if Preview Template is cliked
  // $('#accordion').accordion({
  //     collapsible: true,
  //     heightStyle: "content"
  // }).on('accordionactivate', function (event, ui) {
  //  console.log(ui.newHeader[0]);
  //  console.log($('#ui-accordion-accordion-header-4'));
  //   if (ui.newHeader[0])
  //   $('#ui-accordion-accordion-header-4').html(function(i, val) {
  //     return $('#ui-accordion-accordion-header-4')[0] + "- DONE"
  //   });
  //
  //     alert('activate ' + ui.newHeader.text());
  // });

  $('#contacttablebutton').click(function() {
    var table = $('#contacttable').DataTable();
    var sendingToArray = table.rows('.selected').data();
    //  console.log(sendingToArray);
    //KMM make this uniform during refactoring
    mergeprep(sendingToArray);
    if (table.rows('.selected').data().length > 1) {
      alert(table.rows('.selected').data().length + ' eMails sent');
    } else {
      alert(table.rows('.selected').data().length + ' eMail sent');
    };
    table.rows('.selected').remove().draw(false);
  });
  //Make sure viewtemplate editiable by enduser is updated before email is sent
  currenttemplate = $('.viewtemplate').html();
  $('.viewtemplate').blur(function() {
    if (currenttemplate != $(this).html()) {
      //  alert('Handler for .change() called.');
      currenttemplate = $(this).html();
    }
  });
});

function mergeprep(sendingToArray) {
  for (var km = 0; km < sendingToArray.length; ++km) {
    for (var kmm = 0; kmm < sendingToArray[km].length; ++kmm) {
      mergefieldvalue[kmm].push(sendingToArray[km][kmm]);
    }
    //    console.log(mergefieldvalue);
    //    console.log(currentsubjectline);
    //  var newsubjectline = replaceMergefields(1, mergefieldvalue, currentsubjectline);
    var newbodytext = replaceMergefields(2, mergefieldvalue, currenttemplate);
    if (!debugmodeon) {
      //  console.log(newsubjectline);
      //  console.log(newbodytext);
      //  console.log(sendingToArray[km]);
      //  sendingToArray[km].push(newsubjectline);
      sendingToArray[km].push(newbodytext);
      console.log(sendingToArray[km]);
      sendemail(sendingToArray[km]);
      removeTag(sendingToArray[km]);

      //need last or second to last contact in sendingtoarray?? always grabbing same is broken
    };
  };
}

function dayofweek() {
  var d = new Date();
  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";

  dayofweektext = weekday[d.getDay()];
  // replace  ~Date.DayOfWeek~ with dayofweektext
}

function currentdate() {
  today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!
  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd
  }
  if (mm < 10) {
    mm = '0' + mm
  }
  today = mm + '/' + dd + '/' + yyyy; //change today = mm+'/'+dd+'/'+yyyy; to what ever format you wish.
  // replace ~Date.Current~ with today
}

function dayofmonth() {
  var d = new Date();
  DayOfMonthtext = d.getDate();
  // replace ~Date.DayOfMonth~ with n
}

function monthofyear() {
  var d = new Date();
  MonthOfYeartext = d.getMonth();
  // replace ~Date.MonthOfYear~ with n;
}

function monthname() {
  var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  var d = new Date();
  Monthtext = monthNames[d.getMonth()]
    // ~Date.Month~  document.write("The current month is " + monthNames[d.getMonth()]);
}

function dateyear() {
  var d = new Date();
  Yeartext = d.getFullYear();
  //~Date.Year~  document.getElementById("demo").innerHTML = n;
}

function debugnow() {
  debugmodeon = !debugmodeon;
  if (debugmodeon) {
    $("#emailmodes").show();
  } else {
    $("#emailmodes").hide();
  }
}



function replaceMergefields(typeoftext, contactsfieldstomergelocal, texttoregex) {
  //  console.log(typeoftext);
  //  console.log(contactsfieldstomergelocal);
  //    console.log(texttoregex);
  if (typeoftext === 1) { //subject line to be replaced and returned
    //    console.log('You are in subjectline regex replace');
    var localnewsubjectline = findwithregex(texttoregex);
    //    console.log(localnewsubjectline);
    return localnewsubjectline;
  } else { // bodytext of the email to be replaced and returned
    //    console.log('You are in bodytext regex replace');
    var localnewbodytext = findwithregex(texttoregex);
    //  console.log(localnewbodytext);
    return localnewbodytext;
  }
  //KMM add GA img tracking in future version - requires UX change.
  //str = str + "<img src='http://www.google-analytics.com/collect?v=1&tid=UA-64401325-1&cid=dwhitaker@arbys.com&t=event&ec=email&ea=open&el=TestContactName&cs=ice&cm=email&cn=test1&cm1=1' />"

  function findwithregex(str) {
    //Find each mergefiledmu in the currenttemplate and replace with contact's values
    //    console.log(contactsfieldstomergelocal);
    for (var k = 0; k < contactsfieldstomergelocal.length; ++k) {
      if (contactsfieldstomergelocal[k][3]) {
        var re = new RegExp(contactsfieldstomergelocal[k][3]);
        if (typeoftext === 2) {
          var propertyName = contactsfieldstomergelocal[k][contactsfieldstomergelocal[k].length - 1];
        } else {
          console.log('you are here and should not be - contact developer');
          var propertyName = contactsfieldstomergelocal[k][4];
        }
        //  var propertyName = contactsfieldstomergelocal[k][4];
        str = str.replace(re, propertyName);
      };
    };
    //    console.log('the replaced text is: ' + str);
    return str;
  }
}

function loadInfsContact(theid) {
  var findthese = [];
  var countfields = 0;
  console.log('Looking for values of these merge fields:');
  for (var k = 0; k < mergefieldvalue.length; ++k) {
    //    console.log(mergefieldvalue[k][0]);
    //Build Array of specific customer fields for INFS to return for a given contact
    if (mergefieldvalue[k][1] == 'Contact') {
      findthese[countfields] = mergefieldvalue[k][2];
      countfields++;
    };

  };
  var findthesefields = Object.keys(findthese).map(function(key) {
    return findthese[key]
  });
  console.log('Loading Contact Id: ' + theid);
  console.log(findthesefields);
  infusionsoft.ContactService
    .load(theid, findthesefields)
    .done(function(result5) {
      //  console.log(result5);
      contactselectfields = result5;
      // add these results to the mergefieldvalue array of arrays - unbalanced
      for (var i = 0; i < mergefieldvalue.length; ++i) {
        if (mergefieldvalue[i][1] == 'Contact') {
          for (var m = 0; m < findthesefields.length; ++m) {
            if (mergefieldvalue[i][2] == findthesefields[m]) {
              mergefieldvalue[i].push(result5[findthesefields[m]]);
            }
          };
        } else {
          //      console.log('you arent a contact mergfield');
          if (mergefieldvalue[i][1] == 'Date') {
            //        console.log('you are a Date mergfield');
            var datetype;
            switch (mergefieldvalue[i][2]) {
              case "Current":
                currentdate();
                mergefieldvalue[i].push(today);
                console.log("Found Today " + today);
                break;
              case "DayOfWeek":
                dayofweek();
                mergefieldvalue[i].push(dayofweektext);
                console.log("Found DayOfWeek " + dayofweektext);
                break;
              case "DayOfMonth":

                dayofmonth();
                mergefieldvalue[i].push(DayOfMonthtext);
                console.log("Found DayOfMonth " + DayOfMonthtext);
                break;

              case "MonthOfYear":

                monthofyear();
                mergefieldvalue[i].push(MonthOfYeartext);
                console.log("Found MonthOfYear " + MonthOfYeartext);
                break;

              case "Month":

                monthname();
                mergefieldvalue[i].push(Monthtext);
                console.log("Found Month " + Monthtext);
                break;
              case "Year":

                dateyear();
                mergefieldvalue[i].push(Yeartext);
                console.log("Found Year " + Yeartext);
                break;
            }
          }
        }

      }
      replaceMergefields(mergefieldvalue);
      if (!debugmodeon) {
        sendemail(result5);
      }
    });
}

function getGDocContacts() {
  removecontactlist();
  my_sheet.getRows(1, function(err, row_data) {
    //  console.log('pulled in ' + row_data.length + ' rows');
    var calls = [];
    for (var k = 0; k < row_data.length; ++k) {
      //    console.log(row_data[k]);
      var li = $('<li><input type="checkbox" id="' + row_data[k].id + '" name="sendnow" class="sendnow" value="yes"> Send email to <br><a target="_blank"></a></li>');
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

  var table = $('#contacttable').DataTable(); // clear table of contacts
  table
    .clear()
    .draw();
}



function setSendFrom() {

  sendingfrom = $("#emaildropdown option:selected").attr('value');
  console.log(sendingfrom);
  host = $('#host').val();
  user = $('#user').val();
  pass = $('#pass').val();
  ssl = $('#ssl').val();
  tsl = $('#tsl').val();
  port = $('#port').val();

  console.log(host + " " + user + " " + pass + " " + ssl + " " + tsl + " " + port);
  $('#ui-accordion-accordion-header-0').html(function(i, val) {
    return 'Step 1 - Set SendFrom eMail Address - DONE'
  });
}

// function loginUser() {
//   $('#errmsgs').html(""); // clear error messages
//   infusionsoft.DataService
//     //  .authenticateUser($("#emaildropdown option:selected").attr('value'), '3215a1b0a54ccadf454fc9cb70e97505')
//     .getTemporaryKey("ruh46nkjtkebd3w2qbwvde6g", "YsVf6kHdCF", $("#emaildropdown option:selected").attr('value'), "3215a1b0a54ccadf454fc9cb70e97505")
//     .then(
//       console.log('Hello ')
//     )
//     .fail(function(err) {
//       console.log('uh oh: ' + err);
//       $('#errmsgs').html(err);
//     });
// }

function loaddropdowns() {

  infusionsoft = new api.DataContext($('#l').val(), $('#api').val());

  //  loginUser(); // validate API credentials // not used this rev. will move to oAuth
  loadtemplatedropdown()
  loadtagdropdown2();
  //  loadmergefieldcontext(); //get 'contact' (only) mergefiled names from infs
  $('#ui-accordion-accordion-header-2').html(function(i, val) {
    return 'Step 3 - Source Integration Settings - DONE'
  });
}

function counterUp() {
  $('#countemails').html(function(i, val) {
    return +val + 1 + ' eMail sent.'
  });
}

function counterZero() {
  $('#countemails').html(function(i, val) {
    return +0
  });
}

function sendemail(emailthisperson) {
  var bccaddress = "";
  console.log('from email account: ' + sendingfrom);
  console.log('you are sending email to ');
  console.log(emailthisperson[sendtoemailarrayposition]);
  //  console.log(emailthisperson);
  // console.log('send a bcc :' + usebccflag)
  if (usebccflag) {
    bccaddress = sendingfrom
  };
  //console.log(thenewsubjectline);
  var grabsubjectline = emailthisperson[emailthisperson.length - 1].match(/^(.*?)\</);
  //  console.log(grabsubjectline[1]);
  //  emailthisperson[emailthisperson.length - 1].replace(/^[^<]*</, '');
  //  console.log(emailthisperson[emailthisperson.length - 1]);
  //emailthisperson[emailthisperson.length - 1] = /^[^<]*</.exec(emailthisperson[emailthisperson.length - 1])[1];
  var re = /^(.*?)\</;
  var emailbody = emailthisperson[emailthisperson.length - 1].replace(re, '<');
  //  emailthisperson[emailthisperson.length - 1].replace(/^(.*?)\</,""),
  //  console.log(emailbody);
  //console.log('you are sending meail to' + emailthisperson.target.fromAddress);
  var email = require("./node_modules/emailjs/email");
  var server = email.server.connect({
    // NOT Working outlook Config
    //   user: "kmcdonald@@knowingtechnologies.com",
    //   password: "dXtk2LVsMFU4aC",
    //   host:    "smtp.office365.com",
    //  port: 587,
    // //  ssl: true,
    //    tls: {      ciphers: "SSLv3"  }  // use for sendgrid & outlook

    // Working Gmail Config
    // user: "i001962@gmail.com",
    // password: "uslbkkyjnmabwquq",
    // host: "smtp.gmail.com",
    // tls: {      ciphers: "SSLv3"  } // use for sendgrid & outlook

    //  NOT Working Gmail business apps Config need 2factor setup by admin??
    //   user: "kevin@hazelanalytics.com",
    //   password: "cgMzT4gmh8dLdy",
    //   host: "smtp.gmail.com",
    //   ssl: true,  // use for gmail
    // //   tls: {      ciphers: "SSLv3"  },
    //   port : 465

    // Working SendGrid Config
    // user: "i001962",
    // password: "HAeGzEGtdvh34r",
    // host: "smtp.sendgrid.net",

    user: user,
    password: pass,
    host: host,
    ssl: ssl,
    tls: {
      ciphers: tls
    } // use for sendgrid & outlook
  });
  //		send the message and get a callback with an error or details of the message that was sent
  //  console.log(emailthisperson[emailthisperson.length-2]);
  try {
    server.send({
      text: 'this is first test',
      from: sendingfrom,
      //  to: "i001962@gmail.com",
      to: emailthisperson[sendtoemailarrayposition],
      bcc: bccaddress,
      //   to:      emailthisperson.target.id,
      subject: grabsubjectline[1],
      attachment: [{
        data: emailbody,
        alternative: true //research sendgrid if necessary
          //  alternative: false //research sendgrid if necessary
      }]
    }, function(err, message) {
      $('#ui-accordion-accordion-header-7').html(function(i, val) {
        return err || message;
      });
      console.log(err || message);
    });
  } catch (err) {
    $('#ui-accordion-accordion-header-6').html(function(i, val) {
      return 'Step 7 - Review links, Edit merge data then Send -- Error Sending'
    });
    console.log('uh oh ' + err);
    $('#removetag').attr('checked', false);
    removeTagchecked = false;
  }
}

function logColdEmails(contactidtoemail) {
  //  console.log(contactidtoemail.target.id);
  loadInfsContact(contactidtoemail.target.id); // must adjust for table usage instead of Ul/li

  // counterUp(); //increment emails sent counter for ux
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
  $(".viewtemplate").attr('contentEditable', 'true');
}

function emptydatatable() {
  $('#contacttable').dataTable().fnDestroy();
  //Remove all the DOM elements
  $('#contacttable').empty();
}

function inittablerowobject() {
  //every table cell is set to a value "Unknown" when data is loaded cells with values are overriden.
  //Enduser is responsible for entering missing values
  rowobj = {};
  for (var j = 0; j < mergefieldvalue.length; ++j) {
    objprop = mergefieldvalue[j][2];
    rowobj[objprop] = "Unknown";
  }

  //  console.log(rowobj);
}

function findmergefields() {
  var flagemailalreadyincluded = false;
  var my_array = new Array();
  var str = currenttemplate; // + currentsubjectline;
  // console.log('about to regex for mergfields');
  mergefieldmu = str.match(/\~(.*?)\~/g);

  mergefieldvalue = mergefieldmu;

  //  console.log(mergefieldvalue);
  // if (mergefieldmu[j] == '~Contact.Email~') {
  //   flagemailalreadyincluded = true;
  // }
  //  console.log('How many merge fields? ' + mergefieldmu);
  if (mergefieldmu == null) {

    mergefieldmu = ["~Contact.Email~"];
    mergefieldvalue = mergefieldmu;
    flagemailalreadyincluded = true;
  };
  if ($.inArray("~Contact.Email~", mergefieldmu) > -1) {
    flagemailalreadyincluded = true;
    sendtoemailarrayposition = $.inArray("~Contact.Email~", mergefieldmu);
    console.log('the email address is in array position: ' + $.inArray("~Contact.Email~", mergefieldmu));
  };
  //  console.log(mergefieldmu.length);
  for (var j = 0; j < mergefieldmu.length; ++j) {
    // split to find INFS object eg Contact and field names eg email
    var splitmergefields = mergefieldmu[j].match(/[^\~.]+/g);
    //build the regex needed to replace token in template for each mergefieldvalue
    var re = new RegExp(mergefieldmu[j], "g");
    //  console.log(re);
    mergefieldvalue[j] = [mergefieldmu[j], splitmergefields[0], splitmergefields[1], re];

    //KMM insert dup mergefield check and eliminate - must confirm replace into email is ok with that
  };
  //kmm hack for adding ~Contact.Email~ taken from templates toAdress
  // console.log(flagemailalreadyincluded);
  if (!flagemailalreadyincluded) {
    mergefieldvalue[j] = ["~Contact.Email~", "Contact", "Email", " /~Contact.Email~/g"];
    sendtoemailarrayposition = j;
    console.log('the email address is in array position: ' + j);

  };
  //  console.log(mergefieldvalue);

  // console.log(coltitlesarray);
  colheader = mergefieldvalue.map(function(x) {
    if (x[2] == undefined) {
      x[2] = x[0]
    }; // INFS automation links have no '.' but use - may move this to regex later
    return {
      "title": x[2]
    }
  })
  buildtable();
}

function buildtable() {
  //  console.log('about to draw headers');
  $('#contacttable').DataTable({
    retrieve: true,
    destroy: true,
    autoFill: true,
    //  columns: colheader.sort()
    columns: colheader
  });
  //   //kmm
  //   $.fn.dataTableExt.afnSortData['email'] = function ( oSettings, iColumn )
  // {
  // 	var aData = [];
  // 	$( 'td:eq('+iColumn+') input', oSettings.oApi._fnGetTrNodes(oSettings) ).each( function () {
  // 		aData.push( this.value );
  // 	} );
  // 	return aData;
  // }
  //
  // 	var oTable = $('#contacttable').dataTable( {
  // 		"aoColumnDefs": [
  // 			{ "sSortDataType": "email", "aTargets": [ "_all" ] },
  // 			{ "sType": "textarea", "aTargets": [ 0 ] }
  // 		]
  // 	} );
  // 	new autoFill( oTable );
  //
  //   //kmm
  var table = $('#contacttable').DataTable();
  //new AutoFill( table  );
  $('#contacttable tbody').on('click', 'tr', function() {
    $(this).toggleClass('selected');
    //kmm
    new $.fn.dataTable.AutoFill(table, {
      mode: 'y'
    });
    //kmm


  });
  inittablerowobject();
}


function displayTemplate() {
  cleartemplate();
  var getthistemplate = $("#templatesdropdown option:selected").attr("value");
  try {
    infusionsoft.APIEmailService
      .getEmailTemplate(getthistemplate)
      .fail(function(err) {
        $('#ui-accordion-accordion-header-3').html(function(i, val) {
          return 'Step 4 - Craft Cold Emails - Tempate ERROR in source system'
        });
        console.log('uh oh: ' + err);
      })
      .done(function(result3) {
        //      console.log(result3);
        emptydatatable();
        //  console.log(result3.subject + 'wtf body' + result3.htmlBody);
        if (result3 != undefined) {
          if (result3.subject != "") {
            $(".viewtemplate").append(result3.subject);
          } else {
            $(".viewtemplate").append('WARNING NO SUBJECT LINE - Check your template or edit inline here');
          };
          if (result3.htmlBody != null) {
            $(".viewtemplate").append(result3.htmlBody);
          };
          //    $( ".viewtemplate" ).append( result3.htmlBody );
          // strip can spam from display area as well as in global variable
          //    console.log($(".viewtemplate").find('tr').last());
          $(".viewtemplate tr:last").remove();
          //    $(".viewtemplate").find('tr').slice(0,-1);
          // var newArr = $(".viewtemplate").html().slice(0, -1);
          // console.log(newArr);
          // $('#table tr:last').remove();
          // $(".viewtemplate").htmlBody = newArr;
          //    console.log('about to assign current template');
          currenttemplate = $(".viewtemplate").html();
          //    console.log('assigned current template');
          currentsubjectline = result3.subject;
          //    console.log('assinging current template');
          findmergefields();

          $('#ui-accordion-accordion-header-3').html(function(i, val) {
            return 'Step 4 - Craft Cold Emails - DONE'
          });
          $('#ui-accordion-accordion-header-5').html(function(i, val) {
            return 'Step 6 - Filter Contacts'
          });
        } else {
          buildtable();
          $('#ui-accordion-accordion-header-5').html(function(i, val) {
            return 'Step 6 - Filter Contacts'
          });
        };
      });
  } catch (err) {
    $('#ui-accordion-accordion-header-3').html(function(i, val) {
      return 'Step 4 - Craft Cold Emails - ERROR ERROR'
    });
    $('#ui-accordion-accordion-header-5').html(function(i, val) {
      return 'Step 6 - Filter Contacts'
    });
  }
}
// initialize conatacts table with templates mergefields


function displayContacts() {
  $('#ui-accordion-accordion-header-5').html(function(i, val) {
    return 'Step 6 - Filter Contacts - Looking....'
  });
  getInfsContacts();
  counterZero();
}

function displayContactsGDoc() {
  getGDocContacts();
  counterZero();
}

function loadtagdropdown() {
  var getthistag = "%"; //select all tags -
  try {
    infusionsoft.ContactGroupAssigns
      .where(ContactGroupAssign.ContactGroup, getthistag)
      .select(ContactGroupAssign.GroupId, ContactGroupAssign.ContactGroup)
      .orderByDescending('ContactGroup')
      .take(1000) // FIX THIS! Every tag for every contact is returned as a row.
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
  } catch (err) {
    $('#ui-accordion-accordion-header-5').html(function(i, val) {
      return err + 'ERROR - ERROR'
    });
  }
}


function loadtagdropdown2() {
  var getthistag = "%"; //select all tags -
  try {
    // findByField: function(apiKey, table, limit, page, fieldName,
    //     fieldValue, returnFields) {},
    infusionsoft.DataService
      .findByField('ContactGroup', 1000, 0, 'GroupName', '%', ['GroupName', 'Id'])
      .then(function(alltags) {
        //    console.log(alltags);
        for (var j = 0; j < alltags.length; ++j) {
          mySelect
            .append($("<option></option>")
              .attr("value", alltags[j].Id)
              .text(alltags[j].GroupName));
        }
        var usedNames = {};
        $("select[name='dropdowntags'] > option").each(function() {
          if (usedNames[this.text]) {
            $(this).remove();
          } else {
            usedNames[this.text] = this.value;
          }
        });
        return alltags;
      })
      .fail(function(err) {
        console.log('uh oh: ' + err);
        $('#ui-accordion-accordion-header-2').html(function(i, val) {
          return 'Step 3 - Source Integration Settings - ERROR Connection Failed'
        });
      });

    //kmm for all tags do this

  } catch (err) {
    $('#ui-accordion-accordion-header-2').html(function(i, val) {
      return 'Step 3 - Source Integration Settings - ERROR Connection Failed'
    });
  }
}

function loadtemplatedropdown() {
  //   infusionsoft = new api.DataContext($('#l').val(), $('#api').val());
  try {
    //  var getthistag = "%"; //select all Templates
    infusionsoft.Templates
      //  .where(Template.Id, getthistag)
      .where(Template.PieceType, 'Email')
      .select(Template.Id, Template.PieceTitle, Template.Categories)
      .orderByDescending('Categories')
      .take(1000)
      .toArray()
      .fail(function(err) {
        console.log('uh oh: ' + err);
        $('#ui-accordion-accordion-header-3').html(function(i, val) {
          return err + 'ERROR - Failed to connect'
        });
      })
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
      })
  } catch (err) {
    $('#ui-accordion-accordion-header-3').html(function(i, val) {
      return err + 'ERROR - ERROR'
    });

  }
}
//kmm
function removeTagSetter() {
  removeTagchecked = !removeTagchecked;
  console.log('removeTag when sending emial: ' + removeTagchecked);
  //kmm remove after testing
  //removeTag('i001962@gmail.com');
}

function removeTag(emailthisperson) {
  var getthistag = $("#tagsdropdown option:selected").attr("value");
  console.log('you are in the removetag function with ' + removeTagchecked);
  console.log(emailthisperson[sendtoemailarrayposition]);
  console.log(getthistag);
  var removethistag = $("#tagsdropdown option:selected").text();
  if (removeTagchecked) {
    infusionsoft.ContactService
      //  .findByEmail(emailthisperson[sendtoemailarrayposition], ['Id', 'FirstName', 'LastName'])
      .findByEmail(emailthisperson[sendtoemailarrayposition], ['Id', 'FirstName', 'LastName'])
      .done(function(result) {
        console.log(result);
        for (var k = 0; k < result.length; ++k) {
          infusionsoft.ContactService
            .removeFromGroup(result[k].Id, getthistag)
            .then(function(user) {
              console.log('tag removed ');
            })
            .fail(function(err) {
              console.log('uh oh: ' + err);
            });
        };
      });
  };
};
//kmm
function getInfsContacts() {
  removecontactlist();

  var getthistag = $("#tagsdropdown option:selected").text();
  //  console.log(mergefieldvalue);

  infusionsoft.ContactGroupAssigns
    .where(ContactGroupAssign.ContactGroup, getthistag)
    .select(ContactGroupAssign.ContactGroup, ContactGroupAssign.ContactId)
    .orderByDescending('ContactId')
    .take(100) // will need to increase this at some point
    .toArray()
    .done(function(result) {
      //determine which table colmuns are for ~Contact merge fields
      var findthesecols = [];
      var countfields = 0;
      for (var k = 0; k < mergefieldvalue.length; ++k) {
        //    console.log(mergefieldvalue[k][0]);
        //Build Array of specific customer fields for INFS to return for a given contact
        if (mergefieldvalue[k][1] == 'Contact') {
          findthesecols[countfields] = mergefieldvalue[k][2];
          countfields++;
        };
      };
      //    console.log(findthesecols);
      //end determine which table colmuns are for ~Contact merge fields

      // For each contact in taggroup get values for the Contact mergefields
      for (var i = 0; i < result.length; ++i) {
        infusionsoft.Contacts
          .where(Contact.Id, result[i].ContactId)
          //  .select(Contact.FirstName, Contact.LastName, Contact.Email, Contact.Id, mergefieldvalue[0][2]) //to do - loop through ~contact fields
          .select(findthesecols)
          .orderByDescending('Email')
          .take(100)
          .toArray()
          .done(function(result2) {
            //console.log(result2);
            //    console.log(Object.getOwnPropertyNames(result2[0]).sort()); //just the names use for matching with colheader ??
            var mergefieldtable = result2[0];
            var findthesefields = [];
            var findthesefieldsvalue = [];

            //    console.log(mergefieldtable);
            //KMM - INFS removed blank fields if no default value
            //  console.log(key);
            findthesefields = Object.keys(mergefieldtable).map(function(key) {
              return key
            });
            //  console.log(findthesefields);

            findthesefieldsvalue = Object.keys(mergefieldtable).map(function(key) {
              return mergefieldtable[key]
            });
            //  console.log(findthesefieldsvalue);
            rowtoadd = [];
            for (var x = 0; x < colheader.length; ++x) {

              var objprostr = colheader[x].title;
              //    console.log('column number ' + x);
              //    console.log('objprostr ' + objprostr);
              //    console.log(colheader[x].title);
              for (var l = 0; l < findthesefields.length; ++l) {
                //    console.log(findthesefields[l] + " " + colheader[x].title);
                if (findthesefields[l] === colheader[x].title) {
                  //    console.log('column header matched findthesefields to addtorow ' + findthesefields[l])
                  rowobj[objprostr] = findthesefieldsvalue[l];
                } else {

                  var datetype;
                  switch (colheader[x].title) { // Links & Dates - Are there other mergefield types??
                    case (colheader[x].title.match(/~Link-/) || {}).input:
                      rowobj[objprostr] = "http://test.com/";
                      //        console.log("Inserting blanck URL ");
                      break;
                    case "Current":
                      currentdate();
                      rowobj[objprostr] = today;
                      //      console.log("Insert into Row Today is " + today);
                      break;
                    case "DayOfWeek":
                      dayofweek();
                      rowobj[objprostr] = dayofweektext;
                      //      console.log("Found DayOfWeek " + dayofweektext);
                      break;
                    case "DayOfMonth":
                      dayofmonth();
                      rowobj[objprostr] = DayOfMonthtext;
                      //    console.log("Found DayOfMonth " + DayOfMonthtext);
                      break;

                    case "MonthOfYear":
                      monthofyear();
                      rowobj[objprostr] = MonthOfYeartext;
                      //    console.log("Found MonthOfYear " + MonthOfYeartext);
                      break;

                    case "Month":
                      monthname();
                      rowobj[objprostr] = Monthtext;
                      //    console.log("Found Month " + Monthtext);
                      break;
                    case "Year":
                      dateyear();
                      rowobj[objprostr] = Yeartext;
                      //    console.log("Found Year " + Yeartext);
                      break;
                  }
                }
              };
              var array = $.map(rowobj, function(value, index) {
                return [value];
              });
              rowtoadd = array;


              //    console.log(array);


            };
            // KMM Build row of mergefields considering blanks and date fields
            // Insert Rows into Table

            $('#contacttable').dataTable().makeEditable({
              //sUpdateURL: "UpdateData.php", //On the code.google.com POST request is not supported so this line is commeted out
              sUpdateURL: function(value, settings) {
                //      console.log(value);
                //Simulation of server-side response using a callback function
                return (value);
              }, //MUST GET number of columns and type to allow specific edit and validation
              // this code is incomplete
              "aoColumns": [{
                  indicator: 'Saving now...',
                  tooltip: 'Click to edit',
                  type: 'textarea',
                  submit: 'Save',
                  //  autoFill: true,
                  fnOnCellUpdated: function(sStatus, sValue, settings) {
                    //    alert("(Cell Callback): Cell is updated with value " + sValue);
                  }
                }, {
                  indicator: 'Saving now...',
                  tooltip: 'Click to edit',
                  type: 'textarea',
                  submit: 'Save',
                  fnOnCellUpdated: function(sStatus, sValue, settings) {
                    //    alert("(Cell Callback): Cell is updated with value " + sValue);
                  }
                }, {
                  indicator: 'Saving now...',
                  tooltip: 'Click to edit',
                  type: 'textarea',
                  submit: 'Save',
                  fnOnCellUpdated: function(sStatus, sValue, settings) {
                    //    alert("(Cell Callback): Cell is updated with value " + sValue);
                  }
                }, {
                  indicator: 'Saving now...',
                  tooltip: 'Click to edit',
                  type: 'textarea',
                  submit: 'Save',
                  fnOnCellUpdated: function(sStatus, sValue, settings) {
                    //    alert("(Cell Callback): Cell is updated with value " + sValue);
                  }
                }, {
                  indicator: 'Saving now...',
                  tooltip: 'Click to edit',
                  type: 'textarea',
                  submit: 'Save',
                  fnOnCellUpdated: function(sStatus, sValue, settings) {
                    //    alert("(Cell Callback): Cell is updated with value " + sValue);
                  }
                }, {
                  indicator: 'Saving now...',
                  tooltip: 'Click to edit',
                  type: 'textarea',
                  submit: 'Save',
                  fnOnCellUpdated: function(sStatus, sValue, settings) {
                    //    alert("(Cell Callback): Cell is updated with value " + sValue);
                  }
                }, {
                  indicator: 'Saving now...',
                  tooltip: 'Click to edit',
                  type: 'textarea',
                  submit: 'Save',
                  fnOnCellUpdated: function(sStatus, sValue, settings) {
                    //    alert("(Cell Callback): Cell is updated with value " + sValue);
                  }
                }, {
                  indicator: 'Saving now...',
                  tooltip: 'Click to edit',
                  type: 'textarea',
                  submit: 'Save',
                  fnOnCellUpdated: function(sStatus, sValue, settings) {
                    //    alert("(Cell Callback): Cell is updated with value " + sValue);
                  }
                }, {
                  indicator: 'Saving now...',
                  tooltip: 'Click to edit',
                  type: 'textarea',
                  submit: 'Save',
                  fnOnCellUpdated: function(sStatus, sValue, settings) {
                    //    alert("(Cell Callback): Cell is updated with value " + sValue);
                  }
                }, {
                  indicator: 'Saving now...',
                  tooltip: 'Click to edit',
                  type: 'textarea',
                  submit: 'Save',
                  fnOnCellUpdated: function(sStatus, sValue, settings) {
                    //    alert("(Cell Callback): Cell is updated with value " + sValue);
                  }
                }, {
                  indicator: 'Saving now...',
                  tooltip: 'Click to edit',
                  type: 'textarea',
                  submit: 'Save',
                  fnOnCellUpdated: function(sStatus, sValue, settings) {
                    //    alert("(Cell Callback): Cell is updated with value " + sValue);
                  }
                }, {
                  indicator: 'Saving now...',
                  tooltip: 'Click to edit',
                  type: 'textarea',
                  submit: 'Save',
                  fnOnCellUpdated: function(sStatus, sValue, settings) {
                    //    alert("(Cell Callback): Cell is updated with value " + sValue);
                  }
                }

              ]
            });

            var table = $('#contacttable').DataTable();
            table.row.add(rowtoadd).draw();
            inittablerowobject();
            $('#ui-accordion-accordion-header-5').html(function(i, val) {
              return 'Step 6 - Filter Contacts - DONE'
            });
            // build Lu/Li table - legacy will be removed after merging is integrated into table button
            // for (var j = 0; j < result2.length; ++j) {
            //   var li = $('<li><input type="checkbox" id="' + result2[j].Id + '" name="sendnow" class="sendnow" value="yes"> Send email to <a target="_blank"></a></li>');
            //   li.find('a')
            //     .attr('name', result2[j].Id)
            //     //  .text(result2[j].FirstName + " " + result2[j].LastName + " " + result2[j].Email + " " + result2[j].Id + " " + result2[j].City + " ");
            //     .text(rowtoadd);
            //   li.find('input')
            //     .attr('name', result2[j].Id);
            //
            //   li.appendTo(ul);
            //   $(li[j]).bind('click', function(event) {
            //     logColdEmails(event);
            //   });
            // }
            // end build Lu/Li table - legacy

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
      //       console.log(i);
      result += i + ',';
    }
  }
  return result;
}


function setMode() {
  removecontactlist();
  modesetto = $("#modedropdown option:selected").attr('value');
  //  console.log(modesetto);
  $('#ui-accordion-accordion-header-0').html(function(i, val) {
    return 'Step 2 - Set Source of Contacts - DONE'
  });
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

function setSendBcc() {
  usebccflag = document.getElementById("sendbcc").checked;
  //  console.log(usebccflag);
}
document.getElementById("myBtn1").addEventListener("click", setSendFrom);
document.getElementById("sendbcc").addEventListener("click", setSendBcc);
document.getElementById("modedropdown").addEventListener("change", setMode);
document.getElementById("emaildropdown").addEventListener("change", setSendFrom);
document.getElementById("myBtn").addEventListener("click", loaddropdowns);
document.getElementById("tagsdropdown").addEventListener("change", displayContacts);
document.getElementById("templatesdropdown").addEventListener("change", displayTemplate);
document.getElementById("myBtnlaunch").addEventListener("click", displayContactsGDoc);
document.getElementById("debugmode").addEventListener("click", debugnow);
document.getElementById("removetag").addEventListener("click", removeTagSetter);

//		infusionsoft.addToGroup(ContactGroupAssign.ContactId, '174')
//console.log(ContactGroupAssign.ContactId + 'trying to add tag here');
// var plugins = require('electron-plugins'),
//   ipc = require('ipc')
//
// document.addEventListener('DOMContentLoaded', function () {
//     var context = { document: document }
//     console.log('you are in plugins listener');
//     plugins.load(context, function (err, loaded) {
//       console.log('Plugins next we check for successfully.')
//
//         if(err) return console.error(err)
//         console.log('Plugins loaded successfully.')
//     })
// })
//
// ipc.on('update-available', function () {
//     console.log('there is an update available for download')
// })
