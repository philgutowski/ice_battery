# ice_battery
A tool for calculating all the properties for custom cold plates to be installed with a marine refrigeration system.

### To Do
- [ ] No need for deactivated <a/> tags to trigger the expander behavior; since the behavior is mapped to a jQuery class selector, these could be <span/> tags, or, an <a/> tag with no href attribute. Either is preferable to the 'href="javascript:void(0)"' solution.
- [ ] Event handling: Right now, there is only one event listener controlling all of the behavior, due to the chaining of functionality so that the outcomes all cascade from one another.  This is viable, but is there a better way?
- [ ] Custom object: The box{} object serves its purpose as a simple property bag, but I could give it a predefined structure and defined the cascading chain of functions as methods on the Box object.  This will put me in a stronger position to enrich the tool by, say, making it possible for the user to create multiple configurations and compare them to one another.
- [ ] Form validation: Currently, the validation behavior is scattered among the cascading functions, which is fine, since these functions are closely associated with the data inputs to be validated. But, some of them don't seem to work correctly -- for instance, the validation in function determineHeatLoss() when neither Fridge nor Freezer is selected doesn't fire because you return from the function before writing out the message to the DOM. The null input validation on the box dimensions works well, but may need some additional logic controls to prevent the user from entering values less than 1 into any of the dimension fields, probably defined against events on the fields themselves.
- [ ] DOM modification: Given that I want the Cold Plate Size panel to be visible contingent on whether required upstream data has been provided, rather than manipulating the expander, I could add logic that would add it to the DOM when the data is supplied, and remove it if the required data is deleted.  Not yet sure what is the best user experience here.  I want the user to be able to 'look ahead' and see what other information they are expected to provide.
- [ ] Calculate actual dimensions of cold plate.  The volume of the cold plate must exceed by 10%, the required volume of solution + the volume displaced by the tubing.

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

5. Assume a K factor of 18 and a differential (t1 -t2) of 26 deg F in in refrigeration use, or 20 deg F in freezer use.  Calculate the *surface area* of tubing needed to achieve the required rate of pull-down (`A = required rate of pull down / 18 x [t1 -t2]`).

6. Assume a net refirgerating effect effect of 45 Btus per pound.  Calculate the weight of refrigerant that must be circulated per hour (`rate of pull-down / 45 = lbs./hr.`).

7. In a refrigerator, assume a vapor volume of 1.6 cubic feet per pound; in a freezer, a vapor volume of 2.5 cubic feet per pound.  Conver the figure in step 6 to *cubic inches per minute* (`[lbs./hr. x vapor volume x 12 x 12 x 12] / 60`).

8. Assume the following flow rates:
   * 1/2 inch tubing; 1,980 to 3,240 cubic inches per minute.
   * 5/8 inch tubing; 3,168 to 5,184 cubic inches per minute.

   Compare the figure in step 7 to these figures and determine what *tubing size* and if necessary how many plates in parallel you will need to handle the flow rate in step 7 while remaining within thise limits.
9.  Calculate the *length of tubing* required to produce the tubing surface area determined in step 5, using the tubing diameter in step 8 and using:
   * 1/2 inch tubing; `D = 0.5`
   * 5/8 inch tubing; `D = 0.625`

   Then, `L [in feet] = [A X 12] / [3.14] X D]`
10.  If the length of tubing determined in step 9 cannot be accommodated in the plate volume determined in step 2, either increase the plate volume to accomodate the tubing or settle for a longer pull down time and recalculate.  This may, in any case, be necessary to keep evaporator coil lengths within reasonable limits.

### One Final Calculation

Once we have designed a cold plate, we have to make sure it has enough surface area exposed within the icebox to maintain a sufficient rate of cooling between pull-downs.  The formula is:

	Rate of cooling (Btus/hr.)
	= plate surface area(sq. ft.) x 2 x (t1 -t2)

Where `t1` is the temperature of the interior of the icebox and t2 is the temperature of the cold plate.


*Steps and formulas derived from the book, "Refrigeration for Pleasureboats" by Nigel Calder*










