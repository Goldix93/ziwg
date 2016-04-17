/*
See http://www.greensock.com/draggable/ for details. 
This demo uses ThrowPropsPlugin which is a membership benefit of Club GreenSock, http://www.greensock.com/club/
*/

var $container = $("#board"),
	gridWidth = 196,
	gridHeight = 100,
	gridRows = 6,
	gridColumns = 5,
	i, x, y;

//loop through and create the grid (a div for each cell). Feel free to tweak the variables above
for (i = 0; i < gridRows * gridColumns; i++) {
	y = Math.floor(i / gridColumns) * gridHeight;
	x = (i * gridWidth) % (gridColumns * gridWidth);
	$("<div/>").css({position:"absolute", backgroundColor:"#E0E0E0", border:"1px solid #E0E0E0", width:gridWidth-1, height:gridHeight-1, top:y, left:x}).prependTo($container);
}

//set the container's size to match the grid, and ensure that the box widths/heights reflect the variables above
TweenLite.set($container, {height: gridRows * gridHeight + 1, width: gridColumns * gridWidth + 1});
TweenLite.set(".box", {width:gridWidth, height:gridHeight, lineHeight:gridHeight + "px"});


//Button for adding new block
$( "#addBlock" ).click(function() {

	$("<div/>").addClass("box").attr("id", "box3").css("backgroundColor", getRandomColor()).appendTo($container);
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

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

update();