$(document).ready(function() {
	var stringUrl=""; //String that stores the video ID urls
	var finalUrl = ""; //String that will have the main url
	var viewCount = new Array; //List that save the viewCount data
	var likeCount = new Array; //List that save the likeCount data
	var alphabetical = new Array; //List that save the title data
	var images = new Array; //List that save the images data
	var sortedList = new Array; //List that will make a copy of a list and will sort it
	var elementsIndex = new Array; //List that will save the order of the list to show elements in the right order

	//Function that will sort a list and save the original index
	function sortingElements(listName){
		sortedList = listName.slice(0).sort();
		for (var i=0; i<listName.length;i++){
			elementsIndex.push(listName.indexOf(sortedList[i]));
		};
	};

	//First ajax call to retrieve all video ID urls
	$.ajax({
		url : "https://www.googleapis.com/youtube/v3/search?key=AIzaSyCZIdvJkrCNDjswEeRtMTbN6B9yEiz2pEo&channelId=UCZJ7m7EnCNodqnu5SAtg8eQ&part=snippet&maxResults=10&format=json",
		dataType : "jsonp",
		success : function(parsed_json) {
			for (var i = 0; i <= 9; i++) {
				if (i==9){
					stringUrl = stringUrl + parsed_json["items"][i]["id"]["videoId"];
				}else{
					stringUrl = parsed_json["items"][i]["id"]["videoId"]+ "%2C+" +stringUrl;
				};		
			};
			finalUrl = "https://www.googleapis.com/youtube/v3/videos?part=snippet%2C+statistics&id="+stringUrl+"&maxResults=10&key=AIzaSyCZIdvJkrCNDjswEeRtMTbN6B9yEiz2pEo";
			console.log(finalUrl);

			//Second ajax call to retrieve every data of the videos
			$.ajax({
				url: finalUrl,
				dataType : "jsonp",
				success : function(data) {
					for (var e = 0; e<=9; e++) {
						viewCount.push(data["items"][e]["statistics"]["viewCount"]);
						likeCount.push(data["items"][e]["statistics"]["likeCount"]);
						alphabetical.push(data["items"][e]["snippet"]["title"]);
						images.push(data["items"][e]["snippet"]["thumbnails"]["default"]["url"]);
					};
					var knockoutYoutube = function(){
						this.viewCountLess = function(){
							sortingElements(viewCount);
							alert(elementsIndex);
							for (var i = 0; i < elementsIndex.length; i++) {
								
							};
						};
					};
					ko.applyBindings(new knockoutYoutube);
				}
			});
		}
	});
});
