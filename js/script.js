$(document).ready(function () {

	/*Knockout loading video list*/
	var channelId = "UCZJ7m7EnCNodqnu5SAtg8eQ";
	var url = "https://www.googleapis.com/youtube/v3/search?key=AIzaSyCZIdvJkrCNDjswEeRtMTbN6B9yEiz2pEo&channelId="+channelId+"&part=snippet%2Cid&order=viewCount&maxResults=50";
	var viewModel = {};
	$.getJSON(url, function (data) {
		viewModel.model = data;
		ko.applyBindings(viewModel);
	});
	

	/*when mouse over a result, it highlights*/

});

