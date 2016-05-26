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

var draw=false;

// var cnv = document.getElementById("myCanvas");
// var ctx = cnv.getContext("2d");

var countLines=0;
var pair= ["", ""];
var connectTO = new Array;
var connectFROM = new Array;

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
				console.log("temp"+temp);
				var number=temp.replace('box','');
				console.log("temp"+number);

				var element = document.getElementById(temp);
				console.log(window.getComputedStyle(element).transform);
				var str=window.getComputedStyle(element).transform;
				var res = str.split("(");

				res = res[1].split(")");
				res = res[0].split(",");
				
				var X = parseInt(res[4]); var Y = parseInt(res[5]);
				
				
				if(draw==false)
				{
					if(connectTO[number-1]!=(-1) ) {connectFROM[connectTO[number-1]-1]=-1; connectTO[number-1]=-1; countLines--; }

					draw=true;
					pair[0]=number;
				}
				else if(pair[1]=="") {
					if(pair[0]!=number){
						var old = connectFROM[number-1];

						
						connectTO[pair[0]-1]=number;
						if(old!=-1) {connectTO[old-1]=(-1); countLines--; }
						if(number==connectFROM[connectTO[number-1]-1]) { connectTO[number-1]=-1; }
						console.log(number+"I"+pair[0]);

						countLines=0;
						for(i=0; i<connectTO.length; i++)
						{ connectFROM[i]=-1; }
						for(i=0; i<connectTO.length; i++)
						{
							if(connectTO[i]==-1) continue;
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
			}
	});
}

function output() {
	var i; var j; var begin; var out;
	
	if(countLines!=boxCount-1) window.alert("There are still missing connections");
	else 
	{
		for(i=0; i<connectFROM.length; i++)
		{
			if(connectFROM[i]==-1)
			{
				j=i+1;
				out="box"+j;
				break;
			}
		}
		
		while(true)
		{
			if(connectTO[j-1]!=-1) { out+="|box"+connectTO[j-1]; j=connectTO[j-1]; }
			else break;
		}
		
		window.alert(out); //output
	}
}

function myFunction(e) {
	ctx.clearRect(0,0,boardWidth,boardHeight);

	var i;
	
	console.log("TO"+connectTO);
	console.log("FROM"+connectFROM);
	
	for(i=0; i<connectTO.length; i++)
	{
		if(connectTO[i]==-1) continue;
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
	
	console.log("count "+countLines+"\tboxes "+boxCount);
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
	connectTO.push(-1);
	connectFROM.push(-1);
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
