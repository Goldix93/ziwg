var $container = $("#board"),
	$buttonsRow = $("#buttonsRow"),
	gridWidth = 196,
	gridHeight = 100,
	gridRows = 6,
	gridColumns = 5,
	i, x, y;

var modulesConfig = [];
var modules = [];
var boxCount = 0;
var currentBox;

var count=1;
var draw=false;

var cnv = document.getElementById("myCanvas");
var ctx = cnv.getContext("2d");

var countLines=0;
var pair= ["", ""];
var pom= ["", ""];
var array=new Array;

function Module(id,type,title,color,checkboxes,dropdowns,fields){
	this.id = id;
	this.type = type;
    this.title = title;
    this.color = color;
    this.checkboxes = checkboxes;
    this.dropdowns = dropdowns;
    this.fields = fields;
}

function Checkbox(title,value){
    this.title = title;
    this.value = value;
}

function Dropdown(title,items){
    this.title = title;
    this.items = items;
}

function Field(title,items){
    this.title = title;
    this.items = items;
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
	$("<div/>").css({position:"absolute", backgroundColor:"#E0E0E0", border:"1px solid #E0E0E0", width:gridWidth-1, height:gridHeight-1, top:y, left:x}).prependTo($container);
}

//set the container's size to match the grid, and ensure that the box widths/heights reflect the variables above
TweenLite.set($container, {height: gridRows * gridHeight + 1, width: gridColumns * gridWidth + 1});
TweenLite.set(".box", {width:gridWidth, height:gridHeight, lineHeight:gridHeight + "px"});

getConfig();
$(document).ready(function(){
	

	//Button for adding new block
	$( ".button" ).click(function() {
		var boxId = $(this).attr("box");
		console.log("clicked " + $(this).attr("id") +" /box "+ boxId);
		getBoxFromConfg(boxId);

		console.log(modules);
	});
	update();

	console.log(modulesConfig);
	
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
				var temp = this.target.id;
				//var xx = document.getElementById(temp);
				var element = document.getElementById(temp);
				console.log(window.getComputedStyle(element).transform);
				var str=window.getComputedStyle(element).transform;
				var res = str.split("(");
				//console.log(xx);
				console.log(res[1]);
				res = res[1].split(")");
				res = res[0].split(",");
				console.log(res);
				
				var X = parseInt(res[4]); var Y = parseInt(res[5]);
				
				console.log(X);
				console.log(Y);
				
				if(draw==false)
				{
					//ctx.beginPath();
					//ctx.lineWidth="5";
					//ctx.strokeStyle="green"; // Green path
					//ctx.moveTo(X,Y);
					draw=true;
					pair[0]=temp;
				}
				else if(pair[1]=="") {
					//ctx.lineTo(X,Y);
					//ctx.stroke(); // Draw it
					//ctx.endPath();
					pair[1]=temp;
					array.push(pair);
					countLines++;
					console.log(array[countLines-1]);
					pair= ["", ""];
					draw=false;
				}
			}
	});
}

function output() {
	var i; var j; var begin=""; var out;
	for(i=0; i<countLines; i++)
	{
		for(j=0; j<countLines; j++)
		{
			if(array[i][0]==array[j][1]) { break; }
			if(j==(countLines-1)) {begin=i}
		}
		if(begin!="") break;
	}
	
	out=array[begin][0]+"|"+array[begin][1];
	
	for(i=1; i<countLines; i++)
	{
		for(j=0; j<countLines; j++)
		{
			if(array[j][0]==array[begin][1])
			{
				out=out+"|"+array[j][1];
				begin=j;
			}
		}
	}
	
	window.alert(out);
}

function myFunction(e) {
	ctx.clearRect(0,0,1000,600);
	console.log(array);
	var i;
    for(i=0; i<countLines; i++)
	{
		
		pom = array[i];
		console.log(array[i]);
		console.log(array.length);
		var element = document.getElementById(pom[0]);
				//console.log(window.getComputedStyle(element).transform);
				var str=window.getComputedStyle(element).transform;
				var res = str.split("(");
				//console.log(xx);
				//console.log(res[1]);
				res = res[1].split(")");
				res = res[0].split(",");
				//console.log(res);
				
				var X1 = parseInt(res[4]); var Y1 = parseInt(res[5]);
				
				 element = document.getElementById(pom[1]);
				//console.log(window.getComputedStyle(element).transform);
				 str=window.getComputedStyle(element).transform;
				 res = str.split("(");
				//console.log(xx);
				//console.log(res[1]);
				res = res[1].split(")");
				res = res[0].split(",");
				//console.log(res);
				
				var X2 = parseInt(res[4]); var Y2 = parseInt(res[5]);
				
				
				ctx.beginPath();
				ctx.lineWidth="5";
				ctx.strokeStyle="green"; // Green path
				ctx.moveTo(X1,Y1);
				ctx.lineTo(X2,Y2);
				ctx.stroke();
				
	}
	if(draw==true)
	{
				var element = document.getElementById(pair[0]);
				//console.log(window.getComputedStyle(element).transform);
				var str=window.getComputedStyle(element).transform;
				var res = str.split("(");
				//console.log(xx);
				//console.log(res[1]);
				res = res[1].split(")");
				res = res[0].split(",");
				//console.log(res);
				
				var X1 = parseInt(res[4]); var Y1 = parseInt(res[5]);
		
				ctx.beginPath();
				ctx.lineWidth="5";
				ctx.strokeStyle="red"; // Green path
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
        url: 'file:///D:/Dev/ziwg/config.xml',
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
        			var tmpDropdown = new Dropdown(dropdownName, items);
        			dropdowns.push(tmpDropdown);
        		})
        		$(this).find('Field').each(function(){
        			var fieldName = $(this).text();
        			var items = [];
        			var tmpItem = new Item(fieldName, "text", "Some text");
        			items.push(tmpItem);

        			var tmpField = new Field(fieldName, items);
        			fields.push(tmpField);
        		})
        		var tmpModule = new Module(id, id, title, color, checkboxes, dropdowns, fields);
				modulesConfig.push(tmpModule);
				
        		// addNewBox(id, title, color,checkboxes,dropdowns,fields);
				addNewButton(id, title);
        	});
        	
    	},
    	error: function(){
    		alert("error xml");
    	}

    }
    
    $.ajax(ajaxObj);
}

function getBoxFromConfg(type){
	var box;
	for(i = 0; i < modulesConfig.length; i++){
		var temp = modulesConfig[i];
		if(temp.type === type){
			box = temp;
		}
	}
	if(typeof box === "undefined"){
		return;
	}

	addNewBox(box);
}

function addNewBox(module) {
	boxCount++;
	var tmpModule = new Module(boxCount, module.type, module.title, module.color, module.checkboxes, module.dropdowns, module.fields);
	modules.push(tmpModule);

    $("<div/>").addClass("box").attr("id", "box"+boxCount).css("backgroundColor", module.color).html(module.title).appendTo($container);
	update();

	// addNewButton(id, title);
}

// function addNewBox(id, title, color, checkboxes, dropdowns, fields) {
// 	boxCount++;
// 	var tmpModule = new Module(boxCount, title, color, checkboxes, dropdowns, fields);
// 	modules.push(tmpModule);

//     $("<div/>").addClass("box").attr("id", "box"+boxCount).css("backgroundColor", color).html(title).appendTo($container);
// 	update();

// 	// addNewButton(id, title);
// }

function addNewButton(id, text) {
    $("<div/>").addClass("col-md-2 button").attr({id: "button"+id, box: id}).html(text).appendTo($buttonsRow);
}

function setCurrentBox(box){
	
	currentBox = box;
	console.log($(currentBox).attr("id"));
	// $(box).remove();
	// Draggable.get($(box)).kill();
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
