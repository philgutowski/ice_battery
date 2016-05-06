window.onload = function() {

    // main form element
    var fridgeForm = document.forms["fridge-form"];

    // box size set
    var boxSizeForm = fridgeForm.elements["box-size-form"];
    var boxDepthInput = boxSizeForm.elements["depth-of-box"];
    var boxLengthInput = boxSizeForm.elements["length-of-box"];
    var boxWidthInput = boxSizeForm.elements["width-of-box"];
    var boxSizeExpander = document.querySelector(".box-size-container > .expander-trigger");


    var surfaceAreaSqFt = 0;
    var boxDimensions = document.getElementById("box-dimensions");
    var surfaceArea = document.getElementById("surface-area");

    // heat loss set
    var heatLossForm = fridgeForm.elements["heat-loss-form"];
    var fridgeSelect = heatLossForm.elements["fridge-select"];
    var freezerSelect = heatLossForm.elements["freezer-select"];
    var boxApplication = document.getElementById("box-application");
    var insulationThickness = heatLossForm.elements["insulation-thickness"];
    var insulationThicknessOutput = heatLossForm.elements["insulation-thickness-output"];
    var thickness = document.getElementById("thickness");
    var heatLossDisplay = document.getElementById("heat-loss-display");
    var heatLossExpander = document.querySelector(".heat-loss-container > .expander-trigger");

    // cold plate set
    var coldPlateForm = fridgeForm.elements["cold-plate-size"];
    var holdOverTime = coldPlateForm.elements["holdover-time"];
    var holdOverTimeOutput = document.getElementsByClassName("holdover-time-output");
    var pullDownTime = coldPlateForm.elements["pull-down-time"];
    var pullDownTimeOutput = document.getElementsByClassName("pull-down-time-output");
    var volumeOfSolutionDisplay = document.getElementById("volume-of-solution-display");
    var coldPlateExpander = document.querySelector(".cold-plate-container > .expander-trigger");
    var minPlateBtuCapacityOutput = document.getElementById("minimum-plate-btu-capacity");
    var rateOfPullDownOutput = document.getElementById("rate-of-pull-down-output");

    // tubing set
    var tubingSurfaceAreaOutput = document.getElementById("tubing-surface-area-output");
    var weightOfRefrigerantPerHourOutput = document.getElementById("weight-of-refrigerant-per-hour-output");
    var rateOfFlowOutput = document.getElementById("rate-of-flow-output");
    var tubingDiameterOutput = document.getElementById("tubing-diameter-output");
    var tubingLengthOutput = document.getElementById("tubing-length-output");

    // event listeners
    boxSizeForm.addEventListener("change", setBoxDimensions, false);
    heatLossForm.addEventListener("change", determineHeatLoss, false);
    coldPlateForm.addEventListener("change", determineColdPlateSize, false);


    function setBoxDimensions() {
        if (boxLengthInput.value && boxWidthInput.value && boxDepthInput.value) {
            surfaceAreaSqFt = ((2 * (boxLengthInput.value * boxWidthInput.value) + 2 * (boxLengthInput.value * boxDepthInput.value) + 2 * (boxDepthInput.value * boxWidthInput.value)) / 144).toPrecision(3);
            boxDimensions.innerHTML = boxLengthInput.value + " in.  X  " + boxWidthInput.value + " in.  X  " + boxDepthInput.value + " in. ";
            surfaceArea.innerHTML = surfaceAreaSqFt + " sq. ft.";
            // boxDimensions.textContent = "";
            //dynamically display form section
            heatLossExpander.classList.remove("expander-hidden");

        } else {
            boxDimensions.textContent = "Please enter length, width and depth values";
            boxDimensions.textContent = "";
        }
    }

    function determineHeatLoss() {
        insulationThicknessOutput.value = insulationThickness.value + " in.";
        if (fridgeSelect.checked == true) {
            freezerSelect.checked = false;
            var heatLoss = heatLossTable.fridge[insulationThickness.value];
            boxApplication.innerHTML = "Fridge";

        } else if (freezerSelect.checked == true) {
            // display dynamically
            thickness.style.display = "block";
            fridgeSelect.checked = false;
            var heatLoss = heatLossTable.freezer[insulationThickness.value];
            boxApplication.innerHTML = "Freezer";
        } else {
            boxApplication.innerHTML = "<em>Please select fridge or freezer</em>";
        }
        // this won't calculate a value until previous values have been filled out
        heatLossDisplay.innerHTML = ((heatLoss / 24) * surfaceAreaSqFt).toPrecision(3) + " Btus";
        coldPlateExpander.classList.remove("expander-hidden");
        return heatLoss;
    }

    function determineColdPlateSize() {
        for (i = 0; i < pullDownTimeOutput.length; i++) {
            pullDownTimeOutput[i].innerHTML = pullDownTime.value + " hours";
        }
        for (i = 0; i < holdOverTimeOutput.length; i++) {
            holdOverTimeOutput[i].innerHTML = holdOverTime.value + " hours";
        }

        let plateBtuCapactiy = determineHeatLoss() * holdOverTime.value;
        if (plateBtuCapactiy) { minPlateBtuCapacityOutput.innerHTML = plateBtuCapactiy + " Btus" };
        let volumeOfSolution = plateBtuCapactiy / 1000;
        if (volumeOfSolution) {
            volumeOfSolutionDisplay.innerHTML = volumeOfSolution + " gallons"
            rateOfPullDown(plateBtuCapactiy);
        };
    }

    function rateOfPullDown(btuCapacity) {
        // capactiy / time
        let rateOfPullDown = Math.round(btuCapacity / pullDownTime.value);
        if (rateOfPullDown) {
            rateOfPullDownOutput.innerHTML = rateOfPullDown + " Btus";
            tubingSurfaceArea(rateOfPullDown);
            weightOfRefrigerantPerHour(rateOfPullDown);
        }

    }

    function tubingSurfaceArea(rateOfPullDown) {
        // Assume a K factor of 18 and a differential of 26 deg for fridge and 20 def for freezer
        let fridgeDifferential = 26;
        let freezerDifferential = 20;
        if (fridgeSelect.checked == true) {
            var tubeSurfaceArea = Math.round(rateOfPullDown / 18 * fridgeDifferential);
        } else if (freezerSelect.checked == true) {
            var tubeSurfaceArea = Math.round(rateOfPullDown / 18 * freezerDifferential);
        }
        if (tubeSurfaceArea) { tubingSurfaceAreaOutput.innerHTML = tubeSurfaceArea + " sq. in." };

        return tubeSurfaceArea;
    }

    function weightOfRefrigerantPerHour(rateOfPullDown) {
        // assume a net refrigerating effect of 45 Btus per pound
        let weightToCirculate = Math.round(rateOfPullDown / 45);
        weightOfRefrigerantPerHourOutput.innerHTML = weightToCirculate + " lbs./hr."
        rateOfFlow(weightToCirculate);
    }

    function rateOfFlow(weightToCirculate) {
        // assume a vapor volume of 1.6 cu.ft./lb. in a fridge and 2.5 cu.ft./lb. in a freezer
        if (fridgeSelect.checked = true) {
            var vaporVolume = 1.6;
        } else if (freezerSelect.checked = true) {
            var vaporVolume = 2.5;
        }
        let flowRate = Math.round((weightToCirculate * vaporVolume * 12 * 12 * 12) / 60);
        if (flowRate) { rateOfFlowOutput.innerHTML = flowRate + " cu.in./min." }
        determineTubingDiameter(flowRate);
    }

    function determineTubingDiameter(flowRate) {
        if (flowRate > 5184) {
            var requireParalellTubes = true;
            var tubingDiameter = "This is a very high flow rate and will require paralell tubes";
        } else if (3168 <= flowRate <= 5184) {
            var tubingDiameter = "5/8 in."
            var requireParalellTubes = false;
        } else if (1980 <= flowRate <= 3168) {
            var tubingDiameter = "1/2 in."
            var requireParalellTubes = false;
        } else if (flowRate < 1980) {
            var tubingDiameter = "3/8 in."
            var requireParalellTubes = false;
        }

        tubingDiameterOutput.innerHTML = tubingDiameter;
        determineTubingLength(requireParalellTubes, tubingDiameter);
    }

    function determineTubingLength(requireParalellTubes, tubingDiameter) {

        // LEFT OFF HERE
        // This might be a case where we need to set the various output values as props on objects.
        // We need to get the value that is returned by tubingSurfaceArea(), but we don't have access to
        // rateOfPullDown at this point

        console.log(tubingSurfaceArea());
        // if (requireParalellTubes == false) {
        //     var tubingLengthInFeet = ( * 12) / (3.14 * tubingDiameter) + " ft.";
        // } else {
        //     var tubingLengthInFeet = "This requires seperate calculations for paralell tubing."
        // }

        // tubingLengthOutput.innerHTML = tubingLengthInFeet;
    }



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
}