$(document).ready(function() {

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

    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }
    
});