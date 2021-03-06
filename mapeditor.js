function start(mapWidth, mapHeight, gameImage, extend) {
    core = new Core(mapWidth*16, mapHeight*16);
    core.preload('ui_16.png', gameImage);
    core.onload = function() {

		app.storedData = {};
		app.storedData.bgMap = makeArray(app.mapWidth, app.mapHeight, -1);
		app.storedData.bg2Map = makeArray(app.mapWidth, app.mapHeight, -1);
		app.storedData.colMap = makeArray(app.mapWidth, app.mapHeight, -1);

		var bgArr = makeArray(app.mapWidth, app.mapHeight, -1);
		var bgArr2 = makeArray(app.mapWidth, app.mapHeight, -1);
		var fgArr = makeArray(app.mapWidth, app.mapHeight, -1);
		var colArr = makeArray(app.mapWidth, app.mapHeight, 0);
		if (extend) {
			var bgMap = new ExMap(16, 16);
			var colMap = new Map(16, 16);
		} else {
			var bgMap = new Map(16, 16);
			var colMap = new Map(16, 16);
		}
		bgMap.image = core.assets[gameImage];
		colMap.image = core.assets['ui_16.png'];
		bgMap.loadData(bgArr, bgArr2);
		colMap.loadData(colArr);
		colMap.paintNum = 0;
		colMap.getPaintNum = function(x, y) {
			var num = this._data[0][y][x];
			if (num == 0) {
				this.paintNum = 1;
			} else {
				this.paintNum = 0;
			}
		};
		
		app.maps.bgMap = bgMap;
		app.maps.colMap = colMap;
		backgroundMap = bgMap;

		app.loadStoredData = function(name) {
			var data = this.storedData[name];
			var arr = new Array();
			for (var y = 0, l = data.length; y < l; y++) {
				arr[y] = new Array();
				for (var x = 0, ll = data[0].length; x < ll; x++) {
					arr[y][x] = data[y][x];
				}
			}
			return arr;
		};
		app.storeMaps = function() {
			this.storedData.bgMap = bgMap.copyData(0);
			this.storedData.bg2Map = bgMap.copyData(1);
			this.storedData.colMap = colMap.copyData(0);
		};
		app.restoreMaps = function() {
			bgMap.loadData(app.loadStoredData('bgMap'), app.loadStoredData('bg2Map'));
			colMap.loadData(app.loadStoredData('colMap'));
		};

		var mapFrame = new Sprite(app.mapWidth * 16, app.mapHeight * 16);
		var frame = new Surface(app.mapWidth * 16, app.mapHeight * 16);
		frame.context.strokeStyle = 'Red';
		frame.context.lineWidth = 4;
		frame.context.strokeRect(0, 0, app.mapWidth * 16, app.mapHeight * 16);
		mapFrame.changeSize = function(width, height) {
			this.width = width * 16;
			this.height = height * 16;
			var image = new Surface(this.width, this.height);
			image.context.strokeStyle = 'Red';
			image.context.lineWidth = 4;
			image.height = this.height;
			image.context.clearRect(0, 0, this.width, this.height);
			image.context.strokeRect(0, 0, this.width, this.height);
			this.image = image;
		};
		app.frame = mapFrame;
		mapFrame.image = frame;

		var stage = new Group();
		stage.addChild(bgMap);
		stage.addChild(colMap);
		stage.addChild(mapFrame);
		core.rootScene.addChild(stage);
		core.rootScene.backgroundColor = '#eee';

		this.sx = 0;
		this.sy = 0;
		core.rootScene.addEventListener('touchstart', function(e) {
			x = e.localX*core.scale + core._pageX;
			y = e.localY*core.scale + core._pageY;
			var offsetX = 0, offsetY = 0;
			var element = e.target._element;
			while(element) {
				offsetX += element.offsetLeft;
				offsetY += element.offsetTop;
				element = element.offsetParent;
			}
			x -= offsetX;
			y -= offsetY;
			x = Math.floor(x / 16) | 0;
			y = Math.floor(y / 16) | 0;
			x -= Math.floor(stage.x / 16) | 0;
			y -= Math.floor(stage.y / 16) | 0;
			if (x >= app.mapWidth || y >= app.mapHeight
				|| x < 0 || y < 0) {
				return;
			}
			this.sx = x;
			this.sy = y;
			app.storeMaps();
			var arg = [];
			if (app.selectedLayer == -1) {
				arg.push(0);
			} else {
				arg.push(app.selectedLayer);
			}
			if (app.editFunc == 'rect' || app.editFunc == 'straight') {
				arg.push(x);
				arg.push(y);
			}
			arg.push(x);
			arg.push(y);
			if (app.selectedLayer == -1) {
				colMap.getPaintNum(x, y);
				arg.push(colMap.paintNum);
			} else {
				if (app.extendMode && app.typeEdit) {
					arg.push(app.selectedType);
				} else {
					arg.push(app.selectedData);
				}
			}
			console.log(arg);
			
			if (app.selectedLayer >= 0) {
				if (app.extendMode && app.typeEdit) {
					enchant.extendMap.ExMap.prototype[app.editFunc + 'Type'].apply(bgMap, arg);
				} else {
					enchant.Map.prototype[app.editFunc + 'Data'].apply(bgMap, arg);
				}
			} else {
				enchant.Map.prototype[app.editFunc + 'Data'].apply(colMap, arg);
			}

		});
		core.rootScene.addEventListener('touchmove', function(e) {
			x = e.localX*core.scale + core._pageX;
			y = e.localY*core.scale + core._pageY;
			var offsetX = 0, offsetY = 0;
			var element = e.target._element;
			while(element) {
				offsetX += element.offsetLeft;
				offsetY += element.offsetTop;
				element = element.offsetParent;
			}
			x -= offsetX;
			y -= offsetY;
			x = Math.floor(x / 16) | 0;
			y = Math.floor(y / 16) | 0;
			x -= Math.floor(stage.x / 16) | 0;
			y -= Math.floor(stage.y / 16) | 0;
			if (x >= app.mapWidth || y >= app.mapHeight
				|| x < 0 || y < 0) {
				return;
			}
			var arg = [];
			if (app.selectedLayer == -1) {
				arg.push(0);
			} else {
				arg.push(app.selectedLayer);
			}
			if (app.editFunc == 'rect' || app.editFunc == 'straight') {
				arg.push(this.sx);
				arg.push(this.sy);
				app.restoreMaps();
			}
			arg.push(x);
			arg.push(y);
			if (app.selectedLayer == -1) {
				arg.push(colMap.paintNum);
			} else {
				if (app.extendMode && app.typeEdit) {
					arg.push(app.selectedType);
				} else {
					arg.push(app.selectedData);
				}
			}
			
			if (app.selectedLayer >= 0) {
				if (app.extendMode && app.typeEdit) {
					enchant.extendMap.ExMap.prototype[app.editFunc + 'Type'].apply(bgMap, arg);
				} else {
					enchant.Map.prototype[app.editFunc + 'Data'].apply(bgMap, arg);
				}
			} else {
				enchant.Map.prototype[app.editFunc + 'Data'].apply(colMap, arg);
			}
		});
    };
    core.start();
}

function makeArray(width, height, num) {
	var arr = new Array();
	for (var i = 0; i < height; i++) {
		arr[i] = new Array();
		for (var j = 0; j < width; j++) {
			arr[i][j] = num;
		}
	}
	return arr;
}
