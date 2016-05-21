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
				var temp = this.target;

				setCurrentBox(temp);


				// $(temp).remove();
				// this.kill();
			}
	});
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
