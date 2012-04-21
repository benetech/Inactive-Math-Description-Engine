////
// AJAX loader for the Capitol Project.
// Benjamin Davison
//
//// CONFIGURATION
// server root path, accessible from the Internet.
var server_agm_root = "http://sonify2.psych.gatech.edu/capitol/";
var server_web_root = "http://sonify2.psych.gatech.edu/graph/";

// jsp path
var jsp_path = server_agm_root+"jsp/";

// base_file_name is the file which will do the background processing.  This will be called
// with two variables, 'identifier' (a timestamp) and 'formula', through a GET call.
// the expected file names are identifier.module.extension (e.g. 13245252.description.wav).
var base_file_name = jsp_path+"buildit.jsp";

// modules are the parts that will be computed.  The order in the array defines the order on the page.
// the load pages must be defined as "load_"+module+".htm".
var modules = ["feedback", "image", "auditory_graph", "description"];
//var wavmodules = ["auditory_graph", "description"];
var wavmodules = [];

// if you want to test with static pieces, overide the dynamic identifier loading.
// In production, this should be false, so that the identifier can be unique for every participant.
var identifier_override = false;

// load_file_name will be put together at buttonClicked().  Just leave this the way it is
var load_file_name = "";

// the artifact's path.
var artifact_path = server_web_root + "artifacts/";

// the html path.  Used for htm parts.
var htm_path = server_web_root + "htm/";

// assets path.
var assets_path = server_web_root + "assets/";

var loading_bar_state = false;
var loading_wav_state = false;
//////

//// FUNCTIONS
function buttonClicked(){
	setSubmitEnabled(false);
	formula = document.getElementById("equation").value;
	formula = formula.replace("+", "{plus}");
	formula = formula.replace("/", "{div}");
	if(!identifier_override) {
		identifier=new Date().getTime();
	} else {
		identifier=123;
	}
	load_file_name = base_file_name+"?";
	load_file_name += "identifier="+identifier;
	load_file_name += "&";
	load_file_name += "formula="+formula;
	loadXMLDoc(formula, identifier);
//	loadGraphModules(formula, identifier);
}

function setSubmitEnabled(enabled) {
	button = document.getElementById('submit');
	if(enabled) {
		button.disabled = false;
		button.value = "Get Graph";
	} else {
		button.disabled = true;
		button.value = "Please Wait...";
	}
}

function replaceBracedText(originalText, formula, identifier, description) {
	changedText = originalText;
	// the '/g' acts like a replaceall (it stands for global).
	changedText = changedText.replace(/{formula}/g, formula);
	changedText = changedText.replace(/{identifier}/g, identifier);
	changedText = changedText.replace(/{description}/g, description);
	changedText = changedText.replace(/{path}/g, artifact_path);
	return changedText;
}

// use if loading single pieces of graph modules independently.
function loadGraphModules(formula, identifier) {
	showModulesLoading();
	for(index = 0; index < modules.length; index++) {
		module = modules[index];
		loadGraphModule(module, formula, identifier);
	}
	// this approach may reenable the button before processing is complete.  We may want to have this trigger after $counter is processed.
	setSubmitEnabled(true);
}

function loadGraphModule(module, formula, identifier) {
  	description = loadDescription(identifier);	
	xmlhttp=createAJAXrequester();
	xmlhttp.onreadystatechange = function() {
  		if (xmlhttp.readyState==4) {
  			updateModule(module, formula, identifier, description);
		}
	}
	// this is just opening a random file for now.  this should point to the PHP file doing the processing.
	xmlhttp.open("GET",load_file_name,true);
	xmlhttp.send();	
}	

// use if loading all modules after a single php file is used.
function loadXMLDoc(formula, identifier) {
	$("#status").slideUp(0);
	xmlhttp=createAJAXrequester();
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState==1) {
			loading_wave_state = false;
  			showModulesLoading();
  		} else if (xmlhttp.readyState==4) {
  			loading_bar_state=false;
			$("#status").slideUp(300);
  			if(canUpdate()) {
	  			updateModules(formula, identifier);
//  				loadWavModules(formula, identifier);
  				deleteOldArtifacts();
  			} else {
				include_file = htm_path+"fail.htm";
				include_text = include(include_file);
				include_text = replaceBracedText(include_text, formula, identifier, "");
				element = document.getElementById("feedback");
				element.innerHTML = include_text;
  			}
		}
	}
	xmlhttp.open("GET",load_file_name,true);
	xmlhttp.send();
}

function canUpdate() {
	return true;
}

function showWavModulesLoading() {
	html = "<img src='./assets/ajax-loader.gif'/>";
	for(index = 0; index < wavmodules.length; index++) {
		wavmodule = wavmodules[index];
		id = wavmodule+"_wav_embed";
		loadWavModuleElement(id, html);
	  			
		id = wavmodule+"_wav_download";
		loadWavModuleElement(id, html);
	}
}

function loadWavModules(formula, identifier) {
	showWavModulesLoading();
	for(index = 0; index < wavmodules.length; index++) {
		wavmodule = wavmodules[index];
		loadWavModule(wavmodule, formula, identifier);
	}
//	loading_wav_state = true;
}

function loadWavModule(wavmodule, formula, identifier) {
	r2=createAJAXrequester();
	r2.onreadystatechange = function() {
		if (r2.readyState==4) {
  			id = wavmodule+"_wav_embed";
			text = "<embed src='{path}{identifier}."+wavmodule+".wav' alt='WAV Output' autostart='false' loop='false' width='200' height='60'></embed>";
  			text = replaceBracedText(text, formula, identifier, "");
  			loadWavModuleElement(id, text);
  			
  			id = wavmodule+"_wav_download";
  			element = document.getElementById(id);
  			text = "<a href='{path}{identifier}."+wavmodule+".wav'><b>Download Wav</a>";
  			text = replaceBracedText(text, formula, identifier, "");
			loadWavModuleElement(id, text);
		}
	}
	page = jsp_path+wavmodule+"_wav_conversion.jsp?identifier="+identifier;
	r2.open("GET",page,true);
	r2.send();
}

function loadWavModuleElement(id, text) {
	element = document.getElementById(id);
	element.innerHTML = text;
	$("#"+id).slideDown(500);	
}

function showModulesLoading() {
	if(loading_bar_state) return;
	for(index = 0; index < modules.length; index++) {
		module = modules[index];
		$("#"+module).slideUp(500);
	}
	element = document.getElementById("status");
	html = "<p>Loading your graph..</p>";
	html += "<img src='"+assets_path+"ajax-loader.gif' height='40' alt='loading "+module+"'>";
	$("#status").slideDown(300);
	element.innerHTML = html;
	loading_bar_state = true;	
}

function updateModules(formula, identifier) {
  	description = loadDescription(identifier);
	for(index = 0; index < modules.length; index++) {
		module = modules[index];
		updateModule(module, formula, identifier, description);
	}
	setSubmitEnabled(true);
}

function loadDescription(identifier) {
  	descriptionFileName = artifact_path+formula+"/description.txt";
  	description = include(descriptionFileName);
  	return description;
}

function updateModule(module, formula, identifier, description) {
	include_file = htm_path+"load_"+module+".htm";
	include_text = include(include_file);
	include_text = replaceBracedText(include_text, formula, identifier, description);
	element = document.getElementById(module);
	$("#"+module).slideDown(1000);
	element.innerHTML=include_text;	
}

function deleteOldArtifacts() {
	request=createAJAXrequester();
	// no need to set up a handler.  We don't need to know if it returns.
	page = jsp_path+"delete_old_artifacts.jsp";
	r2.open("GET",page,true);
	r2.send();
}

// thanks to wherever I stole this. - Ben
include = function (url) {
	if ('undefined' == typeof(url)) return false;
	var requester;
	requester = createAJAXrequester();
	// Prevent browsers from caching the included page
 	// by appending a random  number (optional)
 	var seed = Math.random().toString().substring(2);
 	url = url.indexOf('?')>-1 ? url+'&seed='+seed : url+'?seed='+seed;
	// Open the url and write out the response
	requester.open("GET",url,false);
	requester.send(null);
	return requester.responseText;
}

// this code adapted from W3C AJAX tutorial.
createAJAXrequester = function() {
	var requester;
	if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
		requester=new XMLHttpRequest();
	} else {// code for IE6, IE5
		requester=new ActiveXObject("Microsoft.XMLHTTP");
	}
	return requester;
}
