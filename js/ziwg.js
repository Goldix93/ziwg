var $container = $("#board"),
	gridWidth = 196,
	gridHeight = 100,
	gridRows = 6,
	gridColumns = 5,
	i, x, y;

var modules = [];


function Module(id,title,color,checkboxes,dropdowns,fields){
	this.id = id;
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
	$( "#addBlock" ).click(function() {
		addNewBox("11", "New Module");

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
				var $temp = this.target;
				$temp.remove();
				this.kill();
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

        		var tmpModule = new Module(id, title, color, checkboxes, dropdowns, fields);


        		modules.push(tmpModule);
        		addNewBox(tmpModule.id, tmpModule.title, tmpModule.color,tmpModule.checkboxes,tmpModule.dropdowns,tmpModule.fields);
				update();
        	});
        	
    	},
    	error: function(){
    		alert("error xml");
    	}

    }
    
    $.ajax(ajaxObj);
}

function addNewBox(id, title, color, checkboxes, dropdowns, fields) {
    $("<div/>").addClass("box").attr("id", "box"+id).css("backgroundColor", color).html(title+"<br>"+JSON.stringify(checkboxes)+"<br>"+JSON.stringify(dropdowns)+"<br>"+JSON.stringify(fields)).appendTo($container);
	update();
}

function addNewButton(id) {
    $("<button/>").addClass("btn btn-default").attr({id: "addBlock"+id, type: "submit"}).html("add model").appendTo($container);
}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
