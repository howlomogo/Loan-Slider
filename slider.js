// Global arrays storing days and months. For use when displaying the repay date
var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


$(document).ready(function(){

	// Link the Input and Slider with data to be used later
	$("#howmuchinput").data("thisslider", "#howmuchslider");
	$("#howlonginput").data("thisslider", "#howlongslider");

	// Link plus and minus buttons with data objects to store information to be used later
	$("#howmuchplus").data("btndata", {
									thisslider: "#howmuchslider", // Reference to the slider this button will change
									thisinput: "#howmuchinput", // Reference to the input this button will use / change
									isplus: 1} ); // Is this a plus or minus button
	$("#howmuchminus").data("btndata", {
									thisslider: "#howmuchslider",
									thisinput: "#howmuchinput",
									isplus: 0} );
	$("#howlongplus").data("btndata", {
									thisslider: "#howlongslider",
									thisinput: "#howlonginput",
									isplus: 1} );
	$("#howlongminus").data("btndata", {
									thisslider: "#howlongslider",
									thisinput: "#howlonginput",
									isplus: 0} );


	// Slider Functionality
	$("#howmuchslider").slider({
		value: 111,
		range: "min",
		min: 50,
		max: 400,
		slide: function(event, ui) {
			$("#howmuchinput").val(ui.value);
			workOutTotal();
		}
	});

	$("#howlongslider").slider({
		value: 18,
		range: "min",
		min: 1,
		max: 30,
		slide: function(event, ui) {
			$("#howlonginput").val(ui.value);
			workOutTotal();
		}
	});


	// Plus & minus button click events
	$("#howmuchplus, #howmuchminus, #howlongplus, #howlongminus").click(function() {
		
		// Get the value from the input field associated with this button
		var inputToUpdate = $(this).data("btndata").thisinput;
		origValue = $(inputToUpdate).val();

		// Get a reference for the slider that will need to be updated
		var sliderToUpdate = $(this).data("btndata").thisslider;

		// Check whether it is the plus or minus button
		if($(this).data("btndata").isplus) {

			// Check origValue (Input Value) can go higher if it can add one when button is clicked
			if(origValue < $(sliderToUpdate).slider("option", "max")) {
				var newValue = parseInt(origValue) +1;

				// Update input / slider values and work out new total
				$(inputToUpdate).val(newValue);
				$(sliderToUpdate).slider("value", newValue);
				workOutTotal();
			}
		}
		else {
			// Check origValue can go lower if it can remove one when button is clicked
			if(origValue > $(sliderToUpdate).slider("option", "min")) {
				var newValue = parseInt(origValue) -1;

				// Update input / slider values and work out new total
				$(inputToUpdate).val(newValue);
				$(sliderToUpdate).slider("value", newValue);
				workOutTotal();
			}
		}
	});


	// Event listeners for losing focus on the text input - (Update the sliders and totals when this happens)
	$("#howmuchinput, #howlonginput").focusout(function() {

		var inputValue = this.value;

		// Get the slider which needs to be updated
		var sliderToUpdate = $(this).data("thisslider");

		// Check inputValue is not lower or higher than the minimum and maximum values of the sliders
		// If it is set inputValue to the minimum or maximum values
		if (inputValue < $(sliderToUpdate).slider("option", "min")) {
			inputValue = $(sliderToUpdate).slider("option", "min");
			$(this).val(inputValue);
		}
		else if (inputValue > $(sliderToUpdate).slider("option", "max")) {
			inputValue = $(sliderToUpdate).slider("option", "max");
			$(this).val(inputValue);
		}

		// Update slider location
		$(sliderToUpdate).slider( "value", inputValue);
		workOutTotal();
	});


	// applybtn hover effect
	$("#applybtn").hover(
		function() {
			$(this).animate({
			backgroundColor: "#ed7d66"}, 400);
		}, function() {
			$(this).animate({
			backgroundColor: "#E85C40"}, 400);
	});


	// Only allow numbers to be entered in the input field
	$("#howmuchinput, #howlonginput").keyup(function(){
		this.value = this.value.replace(/[^0-9]/g,'');
	});


	// Page Ready Defaults 
	// Set the initial value of the inputs and work out the total amounts
	$("#howmuchinput").val($("#howmuchslider").slider("value"));
	$("#howlonginput").val($("#howlongslider").slider("value"));
	workOutTotal();
});


// Work out and add the information to the bottom of the slider
function workOutTotal() {
	var howMuch = $("#howmuchinput").val();
	var howLong = $("#howlonginput").val();

	// Work out interest and repay amounts
	var interest = ((howMuch * 2.92) / 365) * howLong;
	var repay = parseFloat(howMuch) + interest;

	// Round to 2 decimal places after
	interest = interest.toFixed(2);
	repay = repay.toFixed(2);

	// Update amount text fields to show updated amounts
	$("#borrowamount").text("£" + howMuch);
	$("#interestamount").text("£" + interest);
	$("#repayamount").text("£" + repay);

	// Calculate the repay date
	calculateRepayDate();
}


function calculateRepayDate() {
	// Get the currentTime in milliseconds
	var currentTime = new Date().getTime();

	// Get the additionalTime in milliseconds
	var additionalTime = 86400000 * $("#howlonginput").val();

	// Calculate the repayDate
	var repayDate = new Date(currentTime + additionalTime);

	// Find the suffix for day of the month "th, st, rd... etc"
	var daySuffix = calculateNth(repayDate.getDate());

	// Update repaydate text field with a formatted date
	$("#repaydate").text(dayNames[repayDate.getDay()] + " " +
		repayDate.getDate() + daySuffix + " " +
		monthNames[repayDate.getMonth()] + " " +
		repayDate.getFullYear());
}


function calculateNth(day) {
	// If day is between 3 & 21 it has an "th" suffix
	if (day > 3 && day < 21) {
		return "th";
	}

	// Otherwise work out the correct suffix by finding the remainder of day / 10
	switch (day % 10) {
		case 1: return "st";
		case 2: return "nd";
		case 3: return "rd";
		default: return "th";
	}
}