var core = null;
var app = {};
app.maps = {};
app.typeEdit = true;
app.extendMode = false;
app.editFunc = 'change';
app.selectedLayer = 0;
app.selectedType = 0;
app.selectedData = 0;
app.mapImage = null;
app.mapImageName = '';
app.mapImageIndex = 0;
app.mapWidth = 0;
app.mapHeight = 0;
app.layerTemplate = "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove layer</span></li>";
app.layerCounter = 3;

window.onload = function() {
	enchant();
}

$(function() {
	$( "#createButton" )
	.button()
	.tooltip()
	.click(function() {
		$( "#createDialog" ).dialog( "open" );
	});

	$( "[title]" ).tooltip();
	var widthBox = $( "#widthBox" )[0],
	    heightBox = $( "#heightBox" )[0],
	    selectImage = $( "#selectImage" )[0],
	    checkBox = $( "#checkBox" )[0];

	$( "#createDialog" ).dialog({
		autoOpen: false,
		height: 370,
		width: 500,
		modal: false,
		buttons: {
			"Create a new map": function() {
				var wv = parseInt(widthBox.value, 10);                                             
				var hv = parseInt(heightBox.value, 10);
				var ev = checkBox.checked;
				var selectedValue = selectImage.options[selectImage.selectedIndex].value;
				$( this ).dialog( "close" );
				if (!(isNaN(wv)) && !(isNaN(hv))) {
					app.mapWidth = wv;
					app.mapHeight = hv;
					app.extendMode = ev;
					app.mapImageName = selectedValue;
					app.mapImage = document.createElement('img');
					app.mapImage.src = app.mapImageName;
					app.mapImage.onload = function() {
						if (app.extendMode && this.width != 256 || this.height != 256) {
							alert('256x256pxの画像を使用してください (Use 256x256 Image)');
							return;
						}
						var element = document.getElementById('palette');
						var ctx = element.getContext('2d');
						ctx.clearRect(0, 0, 256, 256);
						ctx.drawImage(this, 0, 0, this.width, this.height, 0, 0, this.width, this.height);
					}
					var stage = document.getElementById('enchant-stage');
					stage.style.width = app.mapWidth*16 + 'px';
					stage.style.height = app.mapHeight*16 + 'px';
					start(app.mapWidth, app.mapHeight, app.mapImageName, app.extendMode);
				} else {
					alert("input number");                                                  
				}                                                                          
			},
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		},
		close: function() {
		}
	});
});

$(function() {
	var importCode = $( "#importCode" )[0];

	$( "#importButton" )
	.button()
	.tooltip()
	.click(function() {
		app.maps.bgMap.collisionData = app.maps.colMap._data[0];
		importCode.value = app.maps.bgMap.getDataCode('backgroundMap', app.mapImageName, app.extendMode);
		$( "#importDialog" ).dialog( "open" );
	});

	$( "#importDialog" ).dialog({
		autoOpen: false,
		width: 800,
		height: 600,
		modal: false,
		buttons: {
			"Import a created map": function() {
				try {
					eval(importCode.value);
				} catch (e) {
					console.log(e);
					alert(e);
					return;
				}
				$( this ).dialog( "close" );
				app.mapWidth = backgroundMap._data[0][0].length;
				app.mapHeight = backgroundMap._data[0].length;
				app.maps.bgMap.loadData(backgroundMap._data[0], backgroundMap._data[1]);
				app.maps.colMap.loadData(backgroundMap.collisionData);
				var new_length = backgroundMap._data.length;

				app.frame.changeSize(app.mapWidth, app.mapHeight);
			},
			Cancel: function() {
				$( this ).dialog( "close" );
			}
		},
		close: function() {
		}
	});
});

$(function() {
	$( "#undo" )
	.button()
	.tooltip()
	.click(function() {
		app.restoreMaps();				
	});
});

$(function() {
	$( "[title]" ).tooltip();
	$( "input[type=radio]" ).button();
	$( "#tools" ).buttonset();

	$( "#pen" )
	.click(function() {
		app.editFunc = 'change';				
	});
	$( "#fill" )
	.click(function() {
		app.editFunc = 'fill';				
	});
	$( "#straight" )
	.click(function() {
		app.editFunc = 'straight';				
	});
	$( "#rect" )
	.click(function() {
		app.editFunc = 'rect';				
	});
});

$(function() {
	$( "#erase" )
	.button()
	.tooltip()
	.click(function() {
        app.selectedData = -1;
        app.selectedType = -1;
		var element = document.getElementById('selectedChip');
		var ctx = element.getContext('2d');
		ctx.clearRect(0, 0, 48, 48);
		ctx.lineWidth = 1; 
		ctx.strokeStyle = 'Red';
		ctx.strokeRect(1, 1, 46, 46);
		ctx.beginPath();
		ctx.moveTo(2, 2);
		ctx.lineTo(46, 46);
		ctx.stroke();
	});
});

$(function() {
	$( "#palette" )
	.tooltip()
	.click(function(e) {
		var x = e.pageX - this.offsetLeft;
		    y = e.pageY - this.offsetTop,
		    width = 16,
		    height = 16;
		var cols = Math.floor(this.clientWidth / 16);
		x = Math.floor(x / 16) | 0;
		y = Math.floor(y / 16) | 0;
		if (app.extendMode) {
			if (x < 6) {
				app.selectedType = Math.floor(x / 3) + Math.floor(y / 4) * 2;
				app.typeEdit = true;
				x = Math.floor(x / 3) * 3;
				y = Math.floor(y / 4) * 4 + 1;
				width = 48;
				height = 48;
			} else if (x < 11) {
				app.selectedData = x - 6 + 12 + y * 17;
				app.typeEdit = false;
			} else {
				app.selectedData = x - 11 + 12 + 272 + y * 17;
				app.typeEdit = false;
			}

		}
		else {
			app.selectedData = x + y * cols;
		}
		var element = document.getElementById('selectedChip');
		var ctx = element.getContext('2d');
		ctx.clearRect(0, 0, 48, 48);
		ctx.drawImage(app.mapImage, x*16, y*16, width, height, 0, 0, 48, 48);
	});
});

$(function() {
	var exportCode = $( "#exportCode" )[0];

	$( "#exportButton" )
	.button()
	.tooltip()
	.click(function() {
		app.maps.bgMap.collisionData = app.maps.colMap._data[0];
		exportCode.value = app.maps.bgMap.getDataCode('backgroundMap', app.mapImageName, app.extendMode);
		$( "#exportDialog" ).dialog( "open" );
	});

	$( "#exportDialog" ).dialog({
		autoOpen: false,
		width: 800,
		height: 600,
		modal: false,
		buttons: {
			Ok: function() {
				$( this ).dialog( "close" );
			}
		},
		close: function() {
		}
	});
});

$(function() {
	$( "#layers" ).tabs({
		active: 1,
		activate: function( event, ui ) {
			var splited_id = ui.newTab.context.outerText.split(" ");
			if(isNaN(splited_id[1])) {
				app.selectedLayer = -1;
			} else {
				app.selectedLayer = splited_id[1];
			}
		}
	});

	var layers = $( "#layers" ).tabs();

	// addlayer button: just opens the dialog
	// actual addlayer function: adds new layer using the input from the form above
	$( "#addLayer" )
	.button()
	.tooltip()
	.click(function() {
		var label = "Layer " + (app.layerCounter - 1),
		id = "enchant-stage",
		li = $( app.layerTemplate.replace( /#\{href\}/g, "#" + id ).replace( /#\{label\}/g, label ) );
		layers.find( ".ui-tabs-nav" ).append( li );
		layers.tabs( "refresh" );
		app.layerCounter++;
	});

	// close icon: removing the layer on click
	layers.delegate( "span.ui-icon-close", "click", function() {
		var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
		layers.tabs( "refresh" );
	});

	layers.bind( "keyup", function( event ) {
		if ( event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE ) {
			var panelId = layers.find( ".ui-tabs-active" ).remove().attr( "aria-controls" );
			layers.tabs( "refresh" );
		}
	});
});
