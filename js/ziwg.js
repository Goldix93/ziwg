var $container = $("#board"),
$buttonsRow = $("#buttonsRow"),
gridWidth = 196,
gridHeight = 100,
gridRows = 6,
gridColumns = 5,
i, x, y;

var boardWidth = gridColumns * gridWidth + 1;
var boardHeight = gridRows * gridHeight + 1;


var modulesConfig = [];
var modules = [];
var boxCount = 0;
var currentBox;
var currentAction = "connect";
var deletedBox = 0;

var draw=false;


var countLines=0;
var pair= ["", ""];
var connectTO = new Array;
var connectFROM = new Array;
var boxdel = new Array;

function Module(id,type,title,color,checkboxes,dropdowns,fields){
	this.id = id;
	this.type = type;
	this.title = title;
	this.color = color;
	this.checkboxes = checkboxes;
	this.dropdowns = dropdowns;
	this.fields = fields;
	this.isConfigured = false;
	this.hasForm = false;
}

function Checkbox(title,value){
	this.title = title;
	this.value = value;
}

function Dropdown(title,items,value){
	this.title = title;
	this.items = items;
	this.value = value;
}

function Field(title,item){
	this.title = title;
	this.item = item;
}

function Item(name,type,value){
	this.name = name;
	this.type = type;
	this.value = value;
}


//loop through and create the grid (a div for each cell). Feel free to tweak the variables above
for (i = 0; i < gridRows * gridColumns; i++) {
	y = Math.floor(i / gridColumns) * gridHeight;
	x = (i * gridWidth) % (gridColumns * gridWidth);
	$("<div/>").css({position:"absolute", backgroundColor:"rgba(224, 224, 224, 0)", width:gridWidth-1, height:gridHeight-1, top:y, left:x}).prependTo($container);
}

$("<canvas/>").css({backgroundColor: "#E0E0E0"}).attr({id: "myCanvas", width: boardWidth, height: boardHeight}).prependTo($container);

var cnv = document.getElementById("myCanvas");
var ctx = cnv.getContext("2d");

//set the container's size to match the grid, and ensure that the box widths/heights reflect the variables above
TweenLite.set($container, {height: boardHeight, width: boardWidth});
TweenLite.set(".box", {width:gridWidth, height:gridHeight, lineHeight:gridHeight + "px"});



getConfig();
$(document).ready(function(){
	

	$( "#buttonOutput" ).click(function() {
		output();
	});


	$('input[name="radioOptions"]').change(function(){
		$buttonsBottom = $(".button");
		currentAction = $(this).val();
		if(currentAction !== "connect"){
			$buttonsBottom.addClass("cursorDisabled");
		}else{
			$buttonsBottom.removeClass("cursorDisabled");
		}
	});


	//Button for adding new block
	$( ".button" ).click(function() {
		if(currentAction === "connect"){
			var boxId = $(this).attr("box");

			addNewBox(getBoxFromConfg(boxId));
			
		}

	});

	

	update();
});




//the update() function is what creates the Draggable according to the options selected (snapping).
function update() {
	Draggable.create(".box", {
		bounds:$container,
		edgeResistance:0.65,
		type:"x,y",
		throwProps:true,
		autoScroll:true,
		liveSnap:false,
		snap:{
			x: function(endValue) {
				return Math.round(endValue / gridWidth) * gridWidth;
			},
			y: function(endValue) {
				return Math.round(endValue / gridHeight) * gridHeight;
			}
		},
		onClick: function() {

			if(currentAction === "connect"){

				var temp = this.target.id;
				var number=temp.replace('box','');
				var element = document.getElementById(temp);
				var str=window.getComputedStyle(element).transform;
				var res = str.split("(");
				res = res[1].split(")");
				res = res[0].split(",");
				var X = parseInt(res[4]); var Y = parseInt(res[5]);

				if(draw==false){

					if(connectTO[number-1]!=(-1) ) {
						connectFROM[connectTO[number-1]-1]=-1; connectTO[number-1]=-1; countLines--; 
					}
					draw=true;
					pair[0]=number;
				}
				else if(pair[1]=="") {
					if(pair[0]!=number){
						var old = connectFROM[number-1];
						connectTO[pair[0]-1]=number;
						if(old!=-1) {connectTO[old-1]=(-1); countLines--; }
						if(number==connectFROM[connectTO[number-1]-1]) { connectTO[number-1]=-1; }
						countLines=0;
						for(i=0; i<connectTO.length; i++){
							if(connectFROM[i]!=(-2)) connectFROM[i]=-1; 
						}

						for(i=0; i<connectTO.length; i++){

							if(connectTO[i]<0) continue;
							else
							{
								countLines++;
								connectFROM[connectTO[i]-1]=i+1;
							}
						}

					}
					pair= ["", ""];
					draw=false;

						myFunction(); //after click not move

					}

			}else if(currentAction === "configure"){
				var temp = this.target;
				configureBox(temp);
				
				

			}else{ //delete
				var temp = this.target;
				var number=temp.id.replace('box','');
				deleteBox($(temp).attr('id'));
				console.log($(temp).attr('id'));
				temp.remove();
				this.kill();
				
				
				deletedBox++;
				boxdel.push(number);
				connectTO[connectFROM[number-1]-1]=(-1);
				connectFROM[connectTO[number-1]-1]=(-1);
				connectFROM[number-1]=-2;
				connectTO[number-1]=-2;
				
				/*for(i=0; i<connectFROM.length; i++)
				{
					connectFROM[i]=-1;
					connectTO[i]=-1;
				}
				for(i=0; i<boxdel.length; i++)
				{
					connectFROM[boxdel[i]-1]=-2;
					connectTO[boxdel[i]-1]=-2;
				}*/
				
				connectTO[number-1]=(-2);
				connectFROM[number-1]=(-2);
				console.log[number];
				console.log(modules);
			}

		}

		});
}

function output() {
	var i; var j; var begin; var out;
	
	if(countLines!=boxCount-1-deletedBox) window.alert("There are still missing connections");
	else 
	{
		for(i=0; i<connectFROM.length; i++)
		{
			if(connectFROM[i]==-1)
			{
				j=i+1;
				out=document.getElementById("box"+j).innerText;
				break;
			}
		}
		
		while(true)
		{
			if(connectTO[j-1]>(-1)) { out+="|"+document.getElementById("box"+connectTO[j-1]).innerText; j=connectTO[j-1]; }
			else { if(connectTO[j-1]==(-1))	break; }
		}
		
		window.alert(out); //output
	}
}

function myFunction(e) {
	
	var check; countLines=0;
	
	for(check=0; check<connectTO.length; check++){

							if(connectTO[check]<0) continue;
							else
							{
								countLines++;
								connectFROM[connectTO[i]-check]=i+check;
							}
						}
	
	ctx.clearRect(0,0,boardWidth,boardHeight);

	var i;
	
	 //console.log("TO"+connectTO);
	 //console.log("FROM"+connectFROM);
	 //console.log(countLines);
	
	for(i=0; i<connectTO.length; i++)
	{
		if(connectTO[i]<0) continue;
		else
		{
			var element = document.getElementById("box"+(i+1));
			var str=window.getComputedStyle(element).transform;
			var res = str.split("(");
			res = res[1].split(")");
			res = res[0].split(",");

			var X1 = parseInt(res[4])+(element.offsetWidth/2); var Y1 = parseInt(res[5])+(element.offsetHeight/2);

			element = document.getElementById("box"+(connectTO[i]));
			var pom=parseInt(connectTO[i]);
			str=window.getComputedStyle(element).transform;
			res = str.split("(");
			res = res[1].split(")");
			res = res[0].split(",");

			var X2 = parseInt(res[4])+(element.offsetWidth/2); var Y2 = parseInt(res[5])+(element.offsetHeight/2);


			ctx.beginPath();
			ctx.lineWidth="5";
				ctx.strokeStyle="green"; // Green path
				ctx.moveTo(X1,Y1);
				ctx.lineTo(X2,Y2);
				ctx.stroke();
			}
		}

		if(draw==true)
		{
			var element = document.getElementById("box"+parseInt(pair[0]));
			var str=window.getComputedStyle(element).transform;
			var res = str.split("(");
			res = res[1].split(")");
			res = res[0].split(",");

			var X1 = parseInt(res[4])+(element.offsetWidth/2); var Y1 = parseInt(res[5])+(element.offsetHeight/2);

			ctx.beginPath();
			ctx.lineWidth="5";
				ctx.strokeStyle="red"; // Red path
				ctx.moveTo(X1,Y1);
				
				var pos = getMousePos(cnv, e);
				posx = pos.x;
				posy = pos.y;
				ctx.lineTo(posx,posy);
				ctx.stroke();
			}


}

function getMousePos(cnv, evt) {
	var rect = cnv.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: evt.clientY - rect.top
	};
}


function getConfig(){

	var $div = $('#upperDiv');

	var ajaxObj = 
	{
		type: 'GET',
		url: 'file:///C:/Users/rewan/Downloads/ziwg-master%20(4)/ziwg-master/config.xml',
		dataType: 'xml',
		async: false,

		success: function(xml){
			$(xml).find('Module').each(function(){
				var title = $(this).find('Title').text();
				var color = $(this).find('Color').text();
				var id = $(this).find('Id').text();
				var checkboxes = [];
				var dropdowns = [];
				var fields = [];

				$(this).find('Checkbox').each(function(){
					var tmpCheckbox = new Checkbox($(this).text(), false);
					checkboxes.push(tmpCheckbox);
				})
				$(this).find('Dropdown').each(function(){
					var dropdownName = $(this).find('DropdownName').text();
					var items = [];
					$(this).find('Item').each(function(){
						var tmpItem = new Item($(this).text(), "boolean", false);
						items.push(tmpItem);
					})
					var tmpDropdown = new Dropdown(dropdownName, items, items[0].name);
					dropdowns.push(tmpDropdown);
				})
				$(this).find('Field').each(function(){
					var fieldName = $(this).text();
					var item = new Item(fieldName, "text", "Some text");

					var tmpField = new Field(fieldName, item);
					fields.push(tmpField);
				})
				var tmpModule = new Module(id, id, title, color, checkboxes, dropdowns, fields);
				modulesConfig.push(tmpModule);

        		
        		addNewButton(id, title);
        	});

		},
		error: function(){
			alert("error xml");
		}

	}

	$.ajax(ajaxObj);
}

function modifyModuleConf(id){

	for(i = 0; i < modules.length; i++){
		
		if(modules[i].id === id){

			for (j = 0; j < modules[i].checkboxes.length; j++) {

				var value = $("input[id='"+id+"checkbox"+j+"']").is(':checked');
				modules[i].checkboxes[j].value = value;

			}

			for (j = 0; j < modules[i].dropdowns.length; j++) {

				var value = $("#"+id+"dropdown"+j+" option:selected").text();
				modules[i].dropdowns[j].value = value;

			}

			for (j = 0; j < modules[i].fields.length; j++) {

				var value = $("#"+id+"field"+j).val();
				modules[i].fields[j].item.value = value;
			}


			break;

		}
	}
	
	
	
	console.log(modules);

}

function modifyModuleIsConfigured(id,isConfigured){
	for(i = 0; i < modules.length; i++){
		
		if(modules[i].id === id){
			modules[i].isConfigured = isConfigured;
			break;
		}
	}
}

function modifyModuleHasForm(id,hasForm){
	for(i = 0; i < modules.length; i++){
		
		if(modules[i].id === id){
			modules[i].hasForm = hasForm;
			break;
		}
	}
}

function getBoxFromModules(id){
	var box;
	for(i = 0; i < modules.length; i++){
		var temp = modules[i];
		if(temp.id === id){
			box = temp;
			break;
		}
	}
	if(typeof box === "undefined"){
		return;
	}

	return box;
}

function getBoxFromConfg(type){
	var box;
	for(i = 0; i < modulesConfig.length; i++){
		var temp = modulesConfig[i];
		if(temp.type === type){
			box = temp;
			break;
		}
	}
	if(typeof box === "undefined"){
		return;
	}

	return box;
}

function addNewBox(module) {

	if(module === "undefined"){
		return;
	}

	boxCount++;
	connectTO.push(-1);
	connectFROM.push(-1);
	var tmpModule = new Module("box"+boxCount, module.type, module.title, module.color, module.checkboxes, module.dropdowns, module.fields);
	modules.push(tmpModule);

	$("<div/>").addClass("box").attr("id", "box"+boxCount).css("backgroundColor", module.color).html('<p class="lead">'+module.title+'</p>').appendTo($container);
	update();
}

function deleteBox(id){
	modules = modules.filter(function (el) {
                      return el.id !== id;
                 }
	);
}

function configureBox(module){
	var box = getBoxFromModules($(module).attr('id'));
	if(box.isConfigured === false){
		
		modifyModuleIsConfigured(box.id, true);
		if (box.hasForm) {
			$("#form"+box.id).show();
		}else{
			addConfigurableItems(box, $("#"+box.id));
			modifyModuleHasForm(box.id, true);
		}
	}


}

function deleteConfBox(id){
	$("#form"+id).hide();
	modifyModuleIsConfigured(id, false);
}

function addNewButton(id, text) {
	$("<div/>").addClass("col-md-2 button").attr({id: "button"+id, box: id}).html(text).appendTo($buttonsRow);
}

function addConfigurableItems(module,box){
	$("<form/>").addClass("form-horizontal").attr({id: "form"+module.id}).appendTo(box);
	var $form = $("#form"+module.id);

	for (i = 0; i < module.checkboxes.length; i++) {
		var checkbox = module.checkboxes[i];
		var str = '<div class="form-group">'+
						'<div class="col-sm-10">'+
	      					'<div class="checkbox">'+
	        					'<label>'+
	          						'<input id="'+module.id+'checkbox'+i+'" type="checkbox"> '+checkbox.title+
	        					'</label>'+
	    					'</div>'+
    					'</div>'+
  					'</div>';
  		$(str).appendTo($form);
	}
	for (i = 0; i < module.dropdowns.length; i++) {
		var dropdown = module.dropdowns[i];
		var id = module.id+'dropdown'+i;
		var strStart = ' <div class="form-group">'+
							'<div class="col-sm-offset-1 col-sm-10">'+
					  			'<label for="'+id+'">'+dropdown.title+'</label>'+
					  				'<select class="form-control" id="'+id+'">';
		var strEnd = 				'</select>'+
							'</div>'+
						'</div>';
		var strOptions = '';
		for (j = 0; j < dropdown.items.length; j++){
			strOptions = strOptions + '<option>'+dropdown.items[j].name+'</option>';
		}

  		$(strStart+strOptions+strEnd).appendTo($form);

	}
	for (i = 0; i < module.fields.length; i++) {
		var field = module.fields[i];
		var id = module.id+'field'+i;
		var str = '<div class="form-group">'+
					'<div class="col-sm-offset-1 col-sm-10">'+
					    '<label for="'+id+'" class="control-label">'+field.title+'</label>'+
					    '<input type="'+field.item.type+'" class="form-control" id="'+id+'" placeholder="'+field.title+'">'+
				    '</div>'+
				  '</div>';
  		$(str).appendTo($form);
	}
	$('<div id="'+module.id+'submit" box="'+module.id+'" class="btn btn-default">Submit</div>').click(function() {
		var boxId = $(this).attr("box");
		modifyModuleConf(boxId);
		deleteConfBox(boxId);
	}).appendTo($form);

}

function setCurrentBox(box){

	currentBox = box;
	console.log($(currentBox).attr("id"));
}

function getRandomColor() {
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++ ) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}
