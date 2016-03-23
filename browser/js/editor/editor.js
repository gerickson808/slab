app.config(function($stateProvider){
	$stateProvider.state('editor', {
		url: '/editor/:wireframeId',
		templateUrl: '/js/editor/editor.html',
		resolve: {
			wireframe: function(Wireframe){
				return Wireframe.getWireframe() || {components:[]};
			}
		},
		controller: 'EditorCtrl'
		});
});

app.controller('EditorCtrl', function($scope, wireframe, $compile, Component, Interact, CSS, Firebase, Screen, Wireframe) {
	var newFork = true;
	//check if project create or project join
	newFork ? Firebase.createRoom(wireframe, $scope) : Firebase.joinRoom(wireframe, $scope);

	$scope.wireframe = wireframe;
	//$scope.components = wireframe.components;
	$scope.board = $('#wireframe-board');
	$scope.activeOpacity = 1;
	$scope.activeColor = "#F00";
	$scope.elementsRendered = $scope.elementsRendered || false;

	//load saved elements, if any
	Component.load($scope.components, $scope);

	//initialize dragging and resizing
	Interact.dragAndResize();

	//set current zoom and initialize CSS zoom
	$scope.currentZoom = CSS.currentZoom();
	$scope.updateZoom = CSS.updateZoom;
	

	$scope.saveElements = function() {
		Component.saveComponents();
	};

	$scope.deleteElement = Firebase.deleteElement;


	$scope.createElement = function(type) {
		//var style = { "background-color":$scope.activeColor, "opacity":$scope.activeOpacity, "border-width": "1px", "border-style": "solid", "border-color": "gray"};
		var style = { "background-color": "#FFF", "opacity":$scope.activeOpacity, "border-width": "1px", "border-style": "solid", "border-color": "gray", "z-index": getZrange()};
		Firebase.createElement(style, type);
	};

	$scope.makeActive = function($event){
		$scope.active = $event.target;
		var color = $scope.active.style.backgroundColor;
		color = color.substring(4, color.length-1);
		color = color.split(', ').map(str => Number(str));
		color = rgbToHex(color);
		$scope.activeColor = color;
		$($scope.active).addClass('active-element');
	};

	$scope.save = function () {
		Wireframe.save($scope.wireframe)
	};

	//Z-index arrangement

	$scope.moveForward = function(){
		if(!$scope.active) return;
		var zIndex = getZindex($scope.active);

		getElementArray().forEach(el => {
			let elZ = getZindex(el);
			if(elZ === zIndex + 1) el.style['z-index'] = elZ - 1;
		});

		if(zIndex > getMaxZ()) return;
		zIndex = zIndex + 1;
		$scope.active.style['z-index'] = zIndex;
	};

	$scope.moveBackward = function(){
		if (!$scope.active) return;

		var zIndex = $scope.active.style['z-index'];
		zIndex = Number(zIndex) + 1;
		$scope.active.style['z-index'] = zIndex;
	};

	$scope.moveToFront = function(){};
	$scope.moveToBack = function(){};


//Event listeners

	$scope.board.on('mousedown',function(){
		$($scope.active).removeClass('active-element');
		$scope.active = null;
		// $scope.createSelectBox;
	});

	$scope.$watch('activeColor', function(){
		if($scope.active) $scope.active.style.backgroundColor = $scope.activeColor;
	});


//Helper functions

	function getElementArray(){
		return [].slice.call($scope.board.children());
	}

	function getZindex(el){
		return Number(el.style['z-index']);
	}

	function getMaxZ(){
		var maxZ = 0;
		var elementArray = getElementArray();
		elementArray.forEach(el => {
			let z = getZindex(el);
			if(z > maxZ) maxZ = z;
		});
		console.log(maxZ);
		return maxZ;
	}

	function getZrange(){
		var elementArray = getElementArray();
		console.log("element array", elementArray);
		return elementArray.length;
	}

	function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
	}

	function rgbToHex(arr) {
    return "#" + componentToHex(arr[0]) + componentToHex(arr[1]) + componentToHex(arr[2]);
	}

});