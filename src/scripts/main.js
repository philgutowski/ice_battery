window.onload = function() {

    // Objects that will store data for future calculations
    var box = {};

    // would be nice to replace these static figures with real heat loss calcs based on R value of insulation
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

    // DOM Element Selectors
    // I considered looping over the elements and auto generating the js variables to correspond
    // to these elements, but I think the code is more easily understood if I manual select each element.

    // main form element
    var fridgeForm = document.forms["fridge-form"];

    // all input elements in main form
    var fridgeInputs = fridgeForm.querySelectorAll('input');

    // box size inputs
    var boxSizeForm = fridgeForm.elements["box-size-form"];
    var boxDepthInput = boxSizeForm.elements["depth-of-box"];
    var boxLengthInput = boxSizeForm.elements["length-of-box"];
    var boxWidthInput = boxSizeForm.elements["width-of-box"];
    var boxSizeExpander = document.querySelector(".box-size-container > .expander-trigger");

    // box size outputs
    var boxDimensionsOutput = document.getElementById("box-dimensions-output");
    var surfaceAreaOutput = document.getElementById("surface-area-output");

    // heat loss inputs
    var heatLossForm = fridgeForm.elements["heat-loss-form"];
    var fridgeSelect = heatLossForm.elements["fridge-select"];
    var freezerSelect = heatLossForm.elements["freezer-select"];
    var boxApplicationOutput = document.getElementById("box-application-output");
    var insulationThickness = heatLossForm.elements["insulation-thickness"];
    var thickness = document.getElementById("thickness");
    var heatLossExpander = document.querySelector(".heat-loss-container > .expander-trigger");

    // heat loss outputs
    var insulationThicknessOutput = heatLossForm.elements["insulation-thickness-output"];
    var heatLossOutput = document.getElementById("heat-loss-output");

    // cold plate inputs
    var coldPlateForm = fridgeForm.elements["cold-plate-size"];
    var holdOverTime = coldPlateForm.elements["holdover-time"];
    var pullDownTime = coldPlateForm.elements["pull-down-time"];
    var coldPlateExpander = document.querySelector(".cold-plate-container > .expander-trigger");

    // cold plate outputs
    var holdOverTimeOutput = document.getElementsByClassName("holdover-time-output");
    var pullDownTimeOutput = document.getElementsByClassName("pull-down-time-output");
    var minPlateBtuCapacityOutput = document.getElementById("minimum-plate-btu-capacity");
    var rateOfPullDownOutput = document.getElementById("rate-of-pull-down-output");
    var volumeOfSolutionOutput = document.getElementById("volume-of-solution-output");

    // tubing outputs
    var tubingSurfaceAreaOutput = document.getElementById("tubing-surface-area-output");
    var weightOfRefrigerantPerHourOutput = document.getElementById("weight-of-refrigerant-per-hour-output");
    var rateOfFlowOutput = document.getElementById("rate-of-flow-output");
    var tubingDiameterOutput = document.getElementById("tubing-diameter-output");
    var tubingLengthOutput = document.getElementById("tubing-length-output");

    // event listeners
    fridgeForm.addEventListener("change", setBoxDimensions, false);

    function setBoxDimensions() {
        if (boxLengthInput.value && boxWidthInput.value && boxDepthInput.value) {
            box.surfaceAreaSqFt = ((2 * (boxLengthInput.value * boxWidthInput.value) + 2 * (boxLengthInput.value * boxDepthInput.value) + 2 * (boxDepthInput.value * boxWidthInput.value)) / 144).toPrecision(3);
            box.boxDimensions = boxLengthInput.value + " in.  X  " + boxWidthInput.value + " in.  X  " + boxDepthInput.value + " in. ";
        }

        if (box.boxDimensions && box.surfaceAreaSqFt) {
            boxDimensionsOutput.innerHTML = box.boxDimensions;
            surfaceAreaOutput.innerHTML = box.surfaceAreaSqFt + " sq. ft.";
            boxDimensionsOutput.classList.remove("incomplete");
            //dynamically display form section
            heatLossExpander.classList.remove("expander-hidden");
            determineHeatLoss();
        } else {
            boxDimensionsOutput.innerHTML = "please enter values for all dimensions"
            boxDimensionsOutput.classList.add("incomplete");
        }
    }

    function determineHeatLoss() {
        box.insulationThickness = insulationThickness.value;
        insulationThicknessOutput.innerHTML = box.insulationThickness + " in."
        if (fridgeSelect.checked == true) {
            freezerSelect.checked = false;
            box.heatLoss = heatLossTable.fridge[insulationThickness.value];
            box.boxApplication = "Fridge";
        } else if (freezerSelect.checked == true) {
            // display dynamically
            thickness.style.display = "block";
            fridgeSelect.checked = false;
            box.heatLoss = heatLossTable.freezer[insulationThickness.value];
        } else {
            box.boxApplication = "Please select fridge or freezer";
            box.heatloss = '';
            coldPlateExpander.classList.add("expander-hidden");
            return;
        }
        // this won't calculate a value until previous values have been filled out
        box.heatLossPerHour = ((box.heatLoss / 24) * box.surfaceAreaSqFt).toPrecision(3) + " Btus/hr.";
        boxApplicationOutput.innerHTML = box.boxApplication;
        if (box.heatLossPerHour) { heatLossOutput.innerHTML = box.heatLossPerHour; }
        determineColdPlateVolume();
        coldPlateExpander.classList.remove("expander-hidden");
    }

    function determineColdPlateVolume() {
        box.pullDownTime = pullDownTime.value;
        box.holdOverTime = holdOverTime.value;
        box.plateBtuCapactiy = box.heatLoss * box.holdOverTime;
        box.volumeOfSolution = box.plateBtuCapactiy / 1000;

        if (box.pullDownTime && box.holdOverTime) {
            for (i = 0; i < pullDownTimeOutput.length; i++) {
                pullDownTimeOutput[i].innerHTML = box.pullDownTime + " hours";
            }
            for (i = 0; i < holdOverTimeOutput.length; i++) {
                holdOverTimeOutput[i].innerHTML = box.holdOverTime + " hours";
            }
        }

        if (box.plateBtuCapactiy) { minPlateBtuCapacityOutput.innerHTML = box.plateBtuCapactiy + " Btus"; }
        if (box.volumeOfSolution) { volumeOfSolutionOutput.innerHTML = box.volumeOfSolution + " gallons"; }
        if (box.plateBtuCapactiy && box.pullDownTime) { determineRateOfPullDown(); }
    }

    function determineRateOfPullDown() {
        // capactiy / time
        box.rateOfPullDown = Math.round(box.plateBtuCapactiy / box.pullDownTime);
        if (box.rateOfPullDown) {
            rateOfPullDownOutput.innerHTML = box.rateOfPullDown + " Btus/hr.";
            determineTubingSurfaceArea();
        }
    }

    function determineTubingSurfaceArea() {
        // Assume a K factor of 18 and a differential of 26 deg for fridge and 20 def for freezer
        box.fridgeDifferential = 26;
        box.freezerDifferential = 20;
        if (box.boxApplication == "Fridge") {
            box.tubeSurfaceArea = Math.round(box.rateOfPullDown / (18 * box.fridgeDifferential));
        } else if (box.boxApplication == "Freezer") {
            box.tubeSurfaceArea = Math.round(box.rateOfPullDown / (18 * box.freezerDifferential));
        }
        if (box.tubeSurfaceArea) {
            tubingSurfaceAreaOutput.innerHTML = box.tubeSurfaceArea + " sq. in.";
            determineWeightOfRefrigerantPerHour();
        };
    }

    function determineWeightOfRefrigerantPerHour() {
        // assume a net refrigerating effect of 45 Btus per pound for R-12
        box.weightToCirculate = Math.round(box.rateOfPullDown / 45);
        if (box.weightToCirculate) {
            weightOfRefrigerantPerHourOutput.innerHTML = box.weightToCirculate + " lbs./hr.";
            determineRateOfFlow();
        }
    }

    function determineRateOfFlow() {
        // assume a vapor volume of 1.6 cu.ft./lb. in a fridge and 2.5 cu.ft./lb. in a freezer
        if (box.boxApplication == "Fridge") {
            box.vaporVolume = 1.6;
        } else if (box.boxApplication == "Freezer") {
            box.vaporVolume = 2.5;
        }
        box.flowRate = Math.round((box.weightToCirculate * box.vaporVolume * 12 * 12 * 12) / 60);
        if (box.flowRate) {
            rateOfFlowOutput.innerHTML = box.flowRate + " cu.in./min."
            determineTubingDiameter();
        }
    }

    function determineTubingDiameter() {
        if (box.flowRate > 5184) {
            box.requireParalellTubes = true;
            box.tubingDiameterDisplay = "This is a very high flow rate and will require paralell tubes";
        } else if (3168 <= box.flowRate <= 5184) {
            box.tubingDiameterDisplay = "5/8 in."
            box.tubingDiameter = .625;
            box.requireParalellTubes = false;
        } else if (1980 <= box.flowRate <= 3168) {
            box.tubingDiameterDisplay = "1/2 in."
            box.tubingDiameter = .5;
            box.requireParalellTubes = false;
        } else if (box.flowRate < 1980) {
            box.tubingDiameterDisplay = "3/8 in."
            box.tubingDiameter = .375;
            box.requireParalellTubes = false;
        }
        if (box.tubingDiameter) {
            tubingDiameterOutput.innerHTML = box.tubingDiameterDisplay;
            determineTubingLength();
        }
    }

    function determineTubingLength() {
        if (box.requireParalellTubes == false) {
            console.log(box.tubeSurfaceArea + " surface area " + box.tubingDiameter + " diameter");
            box.tubingLengthInFeet = Math.round((box.tubeSurfaceArea * 12) / (3.14 * box.tubingDiameter));
            console.log(box.tubingLengthInFeet);
            box.tubingLengthInFeetDisplay = box.tubingLengthInFeet + " ft.";
        } else {
            box.tubingLengthInFeetDisplay = "This requires seperate calculations for paralell tubing."
        }
        if (box.tubingLengthInFeetDisplay) {
            tubingLengthOutput.innerHTML = box.tubingLengthInFeetDisplay;
        }
    }
}