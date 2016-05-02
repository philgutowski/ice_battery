// main form element
var fridgeForm = document.forms["fridge-form"];

// box size set
var boxSizeForm = fridgeForm.elements["box-size-form"];
var boxDepthInput = boxSizeForm.elements["depth-of-box"];
var boxLengthInput = boxSizeForm.elements["length-of-box"];
var boxWidthInput = boxSizeForm.elements["width-of-box"];

var surfaceAreaSqFt = 0;
var boxDimensions = document.getElementById("box-dimensions")

// heat loss set
var heatLossForm = fridgeForm.elements["heat-loss-form"];
var fridgeSelect = heatLossForm.elements["fridge-select"];
var freezerSelect = heatLossForm.elements["freezer-select"];
var insulationThickness = heatLossForm.elements["insulation-thickness"];
var insulationThicknessOutput = heatLossForm.elements["insulation-thickness-output"];
var thickness = document.getElementById("thickness");
var heatLossDisplay = document.getElementById("heat-loss-display");

// event listeners
boxSizeForm.addEventListener("change", setBoxDimensions, false);
heatLossForm.addEventListener("change", determineHeatLoss, false);


function setBoxDimensions() {
    if (boxLengthInput.value && boxWidthInput.value && boxDepthInput.value) {
        surfaceAreaSqFt = ((2 * (boxLengthInput.value * boxWidthInput.value) + 2 * (boxLengthInput.value * boxDepthInput.value) + 2 * (boxDepthInput.value * boxWidthInput.value)) / 144).toPrecision(3);
        let dimensionString = document.createElement("output");
        let surfaceAreaString = document.createElement("output");
        dimensionString.innerHTML = "Length: " + boxLengthInput.value + " in.  X  Width: " + boxWidthInput.value + " in.  X  Depth: " + boxDepthInput.value + " in. ";
        surfaceAreaString.innerHTML = "Surface Area: " + surfaceAreaSqFt + " sq. ft.";
        boxDimensions.textContent = "";
        boxDimensions.appendChild(dimensionString);
        boxDimensions.appendChild(surfaceAreaString);
        //dynamically display form section
        heatLossForm.style.display = "block";

    } else {
        boxDimensions.textContent = "Please enter length, width and depth values";
    }
}

function determineHeatLoss() {
    insulationThicknessOutput.value = insulationThickness.value + " in.";
    if (fridgeSelect.checked == true) {
        // display dynamically
        thickness.style.display = "block";
        var heatLoss = heatLossTable.fridge[insulationThickness.value];

    } else if (freezerSelect.checked == true) {
        // display dynamically
        thickness.style.display = "block";
        var heatLoss = heatLossTable.freezer[insulationThickness.value];
    }

    heatLossDisplay.innerHTML = "Approximate heat loss of your box per hour: " + ((heatLoss / 24) * surfaceAreaSqFt).toPrecision(3) + " Btus";
    thickness.appendChild(heatLossDisplay);

    return heatLoss;
}

// would be nice to replace these static figures with real heat loss calcs
var heatLossTable = {
    fridge: {
        1: 110,
        2: 90,
        3: 85,
        4: 60,
        5: 50,
        6: 45
    },
    freezer: {
        1: 145,
        2: 125,
        3: 110,
        4: 90,
        5: 80,
        6: 65
    }
}