$(document).ready(function() {

	$("#filterForm").on('submit', function(e) {

        var country = $('#country').val();
        var startDate = $('#startDate').val();
        var qtyDays = $('#qtyDays').val();
        
        if (country !== "" && startDate !== "" && qtyDays !== "") {
        	buildCalendar(country, startDate, qtyDays);
        }

        e.preventDefault();
    });


    function buildCalendar(country, startDate, qtyDays) {
    	var request = $.ajax({
        url: "https://holidayapi.com/v1/holidays",
        method: "GET",
        data: {
            key: "62de9748-29e7-4702-a6f4-280d04bcde7f",
            country: "US",
            year: "2008"
        },
        dataType: "json"
	    });
	    request.done(function(msg) {
	        console.log(msg)
	    });
	    request.fail(function(jqXHR, textStatus) {
	        alert("Request failed: " + textStatus);
	    });
    }

    



    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

});