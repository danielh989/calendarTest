$(document).ready(function() {

	$("#filterForm").on('submit', function(e) {

        var country = $('#country').val();
        var startDate = $('#startDate').val();
        var qtyDays = $('#qtyDays').val();
        
        if (country !== "" && startDate !== "" && qtyDays !== "") {
        	$("#calendarContainer").empty();
        	buildCalendar(country, startDate, qtyDays);
        }

        e.preventDefault();
    });


    function buildCalendar(country, startDate, qtyDays) {
    	//Months to match month index
    	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    	var request = $.ajax({
        url: "https://holidayapi.com/v1/holidays",
        method: "GET",
        data: {
            key: "62de9748-29e7-4702-a6f4-280d04bcde7f",
            country: country,
            //Fixed to 2008 because of exercise requirement
            year: "2008"
        },
        dataType: "json"
	    });
	    request.done(function(msg) {

	    	if (msg.status==401){
	    		alert("Please provide the API key.");
	    		return;
	    	} 

	    	if (msg.status==401){
	    		alert("The rate limit for this API key has been exceeded.");
	    		return;
	    	} 

	    	//Holidays JSON object to array for future comparing
	        var holidays = msg.holidays;
            holidaysArr = [];
            for (var x in holidays) {
                holidaysArr.push(holidays[x][0]);
            }

            //Creating the date range for the calendar
            var start = new Date(startDate);
            var end = addDays(start, parseInt(qtyDays));

            //This variable is important to break calendar in months, it allows to verify if the current day of the loop is in the same month of the previous
            var previousMonth;

            while (start < end) {
                var $monthTemplate
                if (previousMonth !== start.getMonth()) {
                    $monthTemplate = $('#monthTemplate');
                    //Getting the calendar template to add month name and year tag extracted from the current day
                    $monthTemplate.find('.monthName').first().html(months[start.getMonth()] + " " + start.getFullYear());
                    $('#calendarContainer').append($monthTemplate.html());
                }

                previousMonth = start.getMonth();

                //The template initializes with one week, we verify if the day is the 0 day of the week to generate a new week row to the last created month
                var $lastCreatedMonth = $('body').find('.month tbody').last();
                var $weekTemplate = $monthTemplate.find('.week').first().clone();
                var SUNDAY = 0;
                if (start.getDay() == SUNDAY) $lastCreatedMonth.append($weekTemplate);


                //Looking for the cell class acording to the week day index, then append the day date.
                var $currentDayCell = $('.month').last().find('.week').last().find('.dayOfWeek' + start.getDay()).first();
                $currentDayCell.html(start.getDate());
                $currentDayCell.addClass('success');

                var SATURDAY = 6
                //Comparing if the day is Sunday (0) or Saturday (6) to change its cell color
                if (start.getDay() == SUNDAY || start.getDay() == SATURDAY) $currentDayCell.css('background-color', 'yellow');


                for (var i = 0; i < holidaysArr.length; i++) {
                    var currentHoliday = new Date(holidaysArr[i]['date']); //Converting the array property to a date object to compare
                    currentHoliday.setHours(24); //Setting the date to 00:00:00 for correct comparing

                    //If the current day is a holiday
                    if (currentHoliday.valueOf() == start.valueOf()) {

                    	//We create a link with the holiday description in a tooltip
                        $currentDayCell.html('<a href="#" title="' + holidaysArr[i]['name'] + '">' + start.getDate() + '</a>');
                        $currentDayCell.css('background-color', 'orange');
                        //We pop the holiday to avoid further comparing
                        holidaysArr.splice(i, 1);
                    }
                }

                //Move to the next day
                var newDate = start.setDate(start.getDate() + 1);
                start = new Date(newDate);
            }
	    });
	    request.fail(function(jqXHR, textStatus) {
	        alert("An error ocurred: " + textStatus);
	    });
    }

    
    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

});