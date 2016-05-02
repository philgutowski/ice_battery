# ice_battery
A tool for calculating all the properties for custom cold plates to be installed with a marine refrigeration system.

## Steps

### Calculate Heat Leak of Insulated Box

By determining the heat losses from any particular box, we can therefore determine its refrigeration requirements.  This assumes a well constructed box with no air leaks, the use of closed cell foam insulation, and a top-opening lid.

1. Calculate outside area of box.
2. Determine thickness of insulation, and fridge or freezer application.
3. Select fridge or freezer option.
4. Reference data object for heat loss vs. thickness of insulation.
5. Display heat loss to user.

### Calculate Cold Plate Requirements

A cold plate is a tank that contains a special solution, known as a *eutectic* solution.  Its freezing point is well below that of water.  By using the large amount of heat absorbtion involved in the melting of solids (latent heat of melting) cold plates can maintain the temperature inside of the insulated box for a period of time after the refrigeration compressor has turned off.  A well designed cold plate refirgeration system requires carefully specing the plates to match the box.

1. Determine holdover capacity based opon the heat leak of the box and desired holdover time.
2. Assuming 1,000 Btus per gallon, calculate the minimum *volume* of eutectic solution to provide the holdover capacity.
3. Decide how long you would like the refrigeration unit to be run in order to pull down the plate into a frozen state.  This will be related to the type of usage the boat gets and the type of refrigeration system that is being used. (AC; DC; or Engine Driven).
4. Using the plate capacity (step 1) and the pull down time (step 3), calculate the required *rate of pull down*.  Note that on most DC systems, the rate of pull down will be limited by the compressor capacity, which will be the determining factor in the calculations from this point on.  The upper limit on a 1/2 hp DC unit is appoximately 2,250 Btus per hour in refrigerator use and 1,500 Btus per hour in freezer use.  On engine-driven systems, the practical upper limits on the rate of pull down are 8,000 Btus per hour in a refrigerator and 5,000 Btus per hour in a freezer.  Beyond these points, the compressor becomes the limiting factor.
5. Assume a K factor of 18 and a differential (t1 -t2) of 26 deg F in in refrigeration use, or 20 deg F in freezer use.  Calculate the *surface area* of tubing needed to achieve the required rate of pull-down (A = required rate of pull down / 18 x [t1 -t2]).
6. Assume a net refirgerating effect effect of 45 Btus per pound.  Calculate the weight of refrigerant that must be circulated per hour (rate of pull-down / 45 = lbs./hr.).
7. In a refrigerator, assume a vapor volume of 1.6 cubic feet per pound; in a freezer, a vapor volume of 2.5 cubic feet per pound.  Conver the figure in step 6 to *cubic inches per minute* ([lbs./hr. x vapor volume x 12 x 12 x 12] / 60).


