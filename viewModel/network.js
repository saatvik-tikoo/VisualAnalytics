$.ajax({
    url: 'http://localhost:3000/gamergate/filterStanford',
    async: true,
    method: 'GET',
    contentType: 'application/json',
    success: function (response) {
        console.log(response)
    }
});