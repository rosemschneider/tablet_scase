// Updated first word survey 
// Rose 
// Overview: i) helper ii) survey flow 

//-------HELPER-----------
// show slide function 

function showSlide(id) {
	$(".slide").hide(); //jquery - all elements with class of slide - hide
  	$("#"+id).show(); //jquery - element with given id - show
  	}
  	
 function isNumberKey(evt){
      var charCode = (evt.which) ? evt.which : event.keyCode
     if (charCode > 31 && (charCode < 48 || charCode > 57))
         return false;
     return true;
      	}
	
//The next four things are for showing and hiding the text box option for "other" on certain drop down lists

$(".boxybox").hide();
$('#numKids').live('change', function () {  
    if ((this.value) >= 11) {
    	$(".boxybox").show();	
    }
    else { 
    $(".boxybox").hide();
    }
});

$(".boxybox2").hide();
$('#birthOr').live('change', function () {  
    if ((this.value) >= 11) {
    	$(".boxybox2").show();	
    }
    else { 
    $(".boxybox2").hide();
    }
});

$(".boxybox3").hide();
$('#wdlang').live('change', function () {  
    if ((this.value) == 11) {
    	$(".boxybox3").show();	
    }
    else { 
    $(".boxybox3").hide();
    }
});

$(".boxybox4").hide();
$('#homelang').live('change', function () {  
    if ((this.value) == 11) {
    	$(".boxybox4").show();	
    }
    else { 
    $(".boxybox4").hide();
    }
});

$(".boxybox5").hide();
$('#wdtype').live('change', function () {  
    if ((this.value) == 11) {
    	$(".boxybox5").show();	
    }
    else { 
    $(".boxybox5").hide();
    }
});
///End of the show and hide 

$("#debriefSubmit").click(function () {
			    showSlide("finished");
			    turk.submit(experiment.surveyconcat);
			});
	 
  	
  	// gets DOT 
getCurrentDate = function() {
	var currentDate = new Date();
	var day = currentDate.getDate();
	var month = currentDate.getMonth() + 1;
	var year = currentDate.getFullYear();
	return (month + "/" + day + "/" + year);
}

// gets time of test
getCurrentTime = function() {
	var currentTime = new Date();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();

	if (minutes < 10) minutes = "0" + minutes;
	return (hours + ":" + minutes);
}

// determines the source of the link, and will add it to the results CSV
// this works only when you append a '?source' onto the study URL
// e.g.  langcog.stanford.edu/expts/CDM/firstword/langsurvey.html?members
// will show the source as "members", like for the CDM members' email
// if there is no '?source' after the URL, the CSV will read 'none'
getURL = function() {
	var webaddress = document.URL;
	var index = webaddress.lastIndexOf("?") + 1;
	
	
	if (index>1)
		{
		return (webaddress.substr(index));
		}
	else
		{
		return ("none");
		}
}

// shows first slide >> asks how many kids there are
showSlide("instructions");

//-------------------survey flow--------------- 


//These labels are for the JQuery "Please answer for your [x] child" - based on experiment.birthOrder, which just indexes the correct label
var order_labs = ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eigth", "ninth", "tenth", "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth", "twentienth"]

var experiment = {

	// Define ALL of the variables we need to account for 
	// Sets them to empty string 
	// Populate with date and time from helper 
	
	numberKids: "", // how many kids there are, i.e., how many times the survey will run
	guardianEd: "", 
	numberDone: 0, // number of kids that the survey has been completed for - will update at end - when numberKids - numberDone == 0, the experiment ends, otherwise, it continues
	birthOrder: "",
	gender: "",
	firstWord: "",
	wordValidation: "",
	wordType: "", 
	addressee: "", 
	wordMeaning: "", 
	wordAge: "", 
	currentAge: "",
	wordLanguage: "",
	homeLanguage: "",
	notes: "", 
	surveyconcat: "", 
	empty: "",
	location: getURL(), 
	
	date: getCurrentDate(),
	time: getCurrentTime(),
	
	//display the second slide 
	//this is taking the number of kids, storing it as experiment.numKids
	//then clearing the HTML doc field for numKids 
	display_birth: function () {
		var ddl1 = document.getElementById("numKids");
		if (ddl1.options[ddl1.selectedIndex].value >= 11) {
			experiment.numberKids = document.getElementById("numKidsOther").value;
			experiment.numberKids = experiment.numberKids.replace(/,/g, "");
			document.getElementById("numKidsOther").value = "";
			$(".boxybox").hide();
		}
		else {
		experiment.numberKids = ddl1.options[ddl1.selectedIndex].value;
		$(".boxybox").hide();
		}
		
		var radio3 = document.getElementsByName("guarded");
		for (var i = 0, length = radio3.length; i < length; i++) {
			if (radio3[i].checked) {
				experiment.guardianEd = radio3[i].value;
				break;
				}	
		}	
		
		//These are the validations - if there is an invalid answer submitted, then experiment.empty = 1
		if (experiment.numberKids <= .5) {
			experiment.empty = 1;	
			}
		else if (experiment.numberKids == "") {
			experiment.empty = 1;
			}
		else if (experiment.guardianEd == "") {
			experiment.empty = 1;
		}	
		else {
			experiment.empty = 0;
		}
		//This is for automatically assigning birth order 1 if number kids = 1
		if (experiment.numberKids == 1) {
			experiment.birthOrder == 1;
		}	
		
		//This is the error - if experiment.empty = 1 (meaning that responses were invalid) then the next slide will not be shown
		//Fields will not be cleared, and the user can fix the mistake
		if (experiment.empty == 1) {
			window.alert("Please complete all fields");
			showSlide("kidNumber");
			experiment.empty = 0;
			$(".boxybox").hide();
		}
		//This is if everything is okay - next slide, and then all fields are reset
		else {
		showSlide("birth");
		experiment.empty = 0;
		ddl1.options[0].selected = 1;
		radio3[i].checked = false;
		document.getElementById("numKidsOther").value = "";
		$(".boxybox").hide();
		} 
	},
	
	//display the third slide 
	//this is taking the birth order and gender and storing them 
	//then clearing the HTML form 
	 display_gender: function () {
	 	var ddl2 = document.getElementById("birthOr");
		if (ddl2.options[ddl2.selectedIndex].value >= 11) {
			experiment.birthOrder = document.getElementById("birthOrOther").value;
			experiment.birthOrder = experiment.birthOrder.replace(/,/g, "");
			$(".boxybox2").hide();
			}
		else {
		experiment.birthOrder = ddl2.options[ddl2.selectedIndex].value;
		$(".boxybox2").hide();
			}
		
		//These are the validations
		if (experiment.birthOrder <= .5 ) {
			experiment.empty = 1;	
			}
		else if (experiment.birthOrder == "") {
			experiment.empty = 1;
		}
		
		//these are validations to make sure that no one answers for more kids than they have
		else if (experiment.birthOrder > experiment.numberKids) {
			experiment.empty = 2;
			}
		else {
			experiment.empty = 0; 
			}	
		$("#Inst").html("Please answer the next set of questions for your <b>" + order_labs[experiment.birthOrder] + "</b> child.")
	 	
	 	//Error check
	 	if (experiment.empty == 1) {
	 		window.alert("Please complete all fields");
	 		showSlide("birth");
	 		experiment.empty = 0;
	 	}
	 	//Error check
	 	else if (experiment.empty == 2) { 
	 		window.alert("Birth order cannot exceed the number of children");
	 		showSlide("birth"); 
	 		experiment.empty = 0;
	 		$(".boxybox2").hide();
	 	}
	 	//Progress, fields are cleared
	 	else {
	 	ddl2.options[0].selected = 1;
	 	experiment.empty = 0;
	 	showSlide("gender");
	 	document.getElementById("birthOrOther").value = "";
	 	$(".boxybox2").hide();
	 	}
	 },

	 //display the fourth slide 
	display_wordInfo: function () {
		var radio1 = document.getElementsByName("gend");
		for (var i = 0, length = radio1.length; i < length; i++) {
			if (radio1[i].checked) {
				experiment.gender = radio1[i].value;
				break;
				}	
		}	
		
		//Checking if the gender radio is filled in
		if (experiment.gender == "") {
			experiment.empty = 1;
		}	
		$("#Inst1").html("Please answer the next set of questions for your <b>" + order_labs[experiment.birthOrder] + "</b> child.")
		//Error check
		if (experiment.empty == 1) {
	 		window.alert("Please complete all fields");
	 		showSlide("gender");
	 		experiment.empty = 0;	
			}
		//Progress, clear fields	
		else {
			experiment.empty = 0;
			radio1[i].checked = false;
			showSlide("wordInfo");
		}	
				
	},	
	 //this is taking the first word, the word type, the addressee, and the sit. and storing
	 //then clearing the HTML form 
	display_ageInfo: function () {
		experiment.firstWord = document.getElementById("firstwd").value; 
		experiment.firstWord = experiment.firstWord.replace(/,/g, "");
		
		//Validation
		if (experiment.firstWord == "") {
			experiment.empty = 1;
		}
		
		var ddl7 = document.getElementById("wdtype");
		if (ddl7.options[ddl7.selectedIndex].value >= 11) {
			experiment.wordType = document.getElementById("wdtypeOther").value;
			experiment.wordType = experiment.wordType.replace(/,/g, "");
			$(".boxybox5").hide();
			}
		else {
		experiment.wordType = ddl7.options[ddl7.selectedIndex].value;
		$(".boxybox5").hide();
			}
		
		//These are the validations
		if (experiment.wordType <= .5 ) {
			experiment.empty = 1;	
			}
		else if (experiment.wordType == "") {
			experiment.empty = 1;
		}
		
		experiment.addressee = document.getElementById("addressee").value;
		experiment.addressee = experiment.addressee.replace(/,/g, "");
	 
	 	//validation
	 	if (experiment.addressee == "") { 
	 		experiment.empty = 1; 
	 	} 
	 	
	 	experiment.wordMeaning = document.getElementById("wdmeaning").value;
	 	experiment.wordMeaning = experiment.wordMeaning.replace(/,/g, "");
		
		//validation
		if (experiment.wordMeaning == "") {
			experiment.empty = 1; 
		}
		
		var radio4 = document.getElementsByName("wordcheck");
		for (var i = 0, length = radio4.length; i < length; i++) {
			if (radio4[i].checked) {
				experiment.wordValidation = radio4[i].value;
				break;
				}	
		}
		
		//word validation
	 	if (experiment.wordValidation == "") {
			experiment.empty = 1;
		}
		
		$("#Inst2").html("Please answer the next set of questions for your <b>" + order_labs[experiment.birthOrder] + "</b> child.")
		//error check
		if (experiment.empty == 1) { 
			window.alert("Please complete all fields"); 
			showSlide("wordInfo");
			experiment.empty = 0;
			$(".boxybox5").hide();
			}
		//progress	
		else {
			showSlide("ageInfo");
			document.getElementById("firstwd").value="";
   			ddl7.options[0].selected = 1;
			radio4[i].checked = false;
			document.getElementById("wdtypeOther").value = "";
			document.getElementById("addressee").value="";
			document.getElementById("wdmeaning").value="";	
			experiment.empty = 0;
			$(".boxybox5").hide();
			}
			
	},
	 
	 //display the fifth slide 
	 //this is taking the age utterance and current age storing them 
	 //then clearing the fields 
	 display_languageInfo: function () {
	 	var ddl3 = document.getElementById("wdage");
		experiment.wordAge = ddl3.options[ddl3.selectedIndex].value; 
		
		var ddl4 = document.getElementById("currage");
		experiment.currentAge = ddl4.options[ddl4.selectedIndex].value;
		//validations
	 	if (experiment.wordAge == .5) {
			experiment.empty = 1;
			}
	 	else if (experiment.currentAge == .5) {
	 		experiment.empty = 1; 
	 		}
	 	
	 	
	 	$("#Inst4").html("Please answer the next set of questions for your <b>" + order_labs[experiment.birthOrder] + "</b> child.")
	 	//error check
	 	if (experiment.empty == 1) {
	 		window.alert("Please complete all fields");
	 		showSlide("ageInfo"); 
	 		experiment.empty = 0; 
	 	}
	 	//progress
	 	//clear fields
	 	else {
	 	showSlide("languageInfo");
	 	ddl3.options[0].selected = 1; 
	 	experiment.empty = 0;
	 	ddl4.options[0].selected = 1; 
	 	}
	 }, 
	 
	 //display the sixth slide 
	 //this is taking the language info and storing it
	 //then clearing the fields 
	 //this slide also updates numberLeft, checks it against numberKids - if ==, end, if !=, go back to 2nd slide
	 //need to figure out what to do here... 	
	 display_continue: function() {
	 	
	 	var ddl5 = document.getElementById("wdlang");
		if (ddl5.options[ddl5.selectedIndex].value >= 11) {
			experiment.wordLanguage = document.getElementById("wdLangOther").value;
			document.getElementById("wdLangOther").value = "";
			$(".boxybox3").hide();
		}
		else {
		experiment.wordLanguage= ddl5.options[ddl5.selectedIndex].value;
		$(".boxybox3").hide();
		}
	 	
	 	var ddl6 = document.getElementById("homelang");
		if (ddl6.options[ddl6.selectedIndex].value >= 11) {
			experiment.homeLanguage = document.getElementById("homeLangOther").value;
			document.getElementById("homeLangOther").value = "";
			$(".boxybox4").hide();
		}
		else {
		experiment.homeLanguage = ddl6.options[ddl6.selectedIndex].value;
		$(".boxybox4").hide();
		}
		//validations
		if (experiment.wordLanguage == .5) {
	 		experiment.empty = 1;
	 	}
	 	else if (experiment.wordLanguage == "") {
	 		experiment.empty = 1; 
	 	}
	 	
	 	if (experiment.homeLanguage == .5) {
	 		experiment.empty = 1; 
	 	}
	 	else if (experiment.homeLanguage == "") {
	 		experiment.empty = 1;
	 	}
		
		experiment.notes = document.getElementById("addinfo").value; 
		experiment.notes = experiment.notes.replace(/,/g, "");
	 	
		
		$("#Inst4").html("Please answer the next set of questions for your <b>" + order_labs[experiment.birthOrder] + "</b> child.")
	 	//error check
	 	if (experiment.empty == 1) {
	 		window.alert ("Please complete all fields"); 
	 		experiment.empty = 0; 
	 		showSlide("languageInfo");
	 		$(".boxybox3").hide();
	 		$(".boxybox4").hide();
	 	}
	 	
	 	//progress
	 	else {
	 	experiment.empty = 0; 
	 	ddl5.options[0].selected = 1;
	 	ddl6.options[0].selected = 1;
	 	document.getElementById("wdLangOther").value = "";
	 	document.getElementById("homeLangOther").value = "";
	 	document.getElementById("addinfo").value = "";
	 	showSlide("continue");
	 	$(".boxybox3").hide();
	 	$(".boxybox4").hide();
	 	} 
	 },

	 //end slide 
	display_end: function() {    	
    	showSlide("end");	
    },

//functions that we need
//submit will concatenate all the variables and combine them together in a csv that is processed by a php script in the cgi-bin
	save: function() {
    		experiment.surveyconcat += 
    		experiment.location + "," 
    		+ experiment.date + "," 
    		+ experiment.time + "," 
    		+ experiment.numberKids + "," 
    		+ experiment.guardianEd + ","
    		+ experiment.birthOrder + ","
    		+ experiment.gender + "," 
    		+ experiment.firstWord + "," 
   			+ experiment.wordValidation + "," 		
    		+ experiment.wordType + "," 
    		+ experiment.addressee + "," 
    		+ experiment.wordMeaning + ","  
    		+ experiment.wordAge + "," 
    		+ experiment.currentAge + "," 
    		+ experiment.wordLanguage + "," 
    		+ experiment.homeLanguage + ","
    		+ experiment.notes + "\n";
    	}, 
    	
    submit: function () {    	
    	$.post("https://langcog.stanford.edu/cgi-bin/FirstWord_RMS/process_survey.php", {postresult_string : experiment.surveyconcat});
    },
    	  	
	 	
	 	//this increments the number done every time the experiment submits 
	 	//when kids-done == 0, the experiment ends
	 	//otherwise it cycles back and shows the birth slide and the whole thing begins again 
	 	
	 increment: function () {
	 	experiment.numberDone++;	
	 		
	 		if ((experiment.numberKids-experiment.numberDone) == 0) {
	 			showSlide("end"); 
	 		}
	 		else {
	 		showSlide("birth");
	 		}
	 	},
	 	
	 	test: function() {
        if (window.self == window.top | turk.workerId.length > 0) {

            showSlide("kidNumber");
            }
        },
	 	
	
	
}

	 
	 
