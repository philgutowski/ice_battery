var boxSimulation = {
	boxContainer: document.getElementById("box-container"),
    boxDimensions: document.getElementById("box-dimensions"),
    frontFace: document.getElementById("front"),
    backFace: document.getElementById("back"),
    topFace: document.getElementById("top"),
    bottomFace: document.getElementById("bottom"),
    leftFace: document.getElementById("left"),
    rightFace: document.getElementById("right")
}

fridgeForm = document.forms["fridge-form"];
boxSizeForm = fridgeForm.elements["box-size-form"];
boxDepthInput = boxSizeForm.elements["depth-of-box"];
boxLengthInput = boxSizeForm.elements["length-of-box"];
boxWidthInput = boxSizeForm.elements["width-of-box"];