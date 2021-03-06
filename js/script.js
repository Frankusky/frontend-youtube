function loadVideo(youtubeName,youtubeVideoId,youtubeView,youtubeLike){
	$(".videoContent").empty();
	$(".videoContent").append("<div class=\"embed-responsive embed-responsive-16by9\"><iframe class=\"embed-responsive-item\" width=\"560\" height=\"315\" src=\"http://www.youtube.com/embed/"+youtubeVideoId+"\" frameborder=\"0\" allowfullscreen></iframe></div><br><br><span>Name: <strong>"+youtubeName+"</strong></span><br><span>Views: <strong>"+youtubeView+"</strong></span><br><span>Likes: <strong>"+youtubeLike+"</strong></span><br><span>Watch on youtube: <a href='https://www.youtube.com/watch?v="+youtubeVideoId+"'>https://www.youtube.com/watch?v="+youtubeVideoId+"</a>");
};

$(document).ready(function() {
	var stringUrl=""; //String that stores the video ID urls
	var finalUrl = ""; //String that will have the main url
	var maxResults = 50; //Number of max results to recieve

	var viewCount = new Array; //List that save the viewCount data
	var likeCount = new Array; //List that save the likeCount data
	var alphabetical = new Array; //List that save the title data
	var images = new Array; //List that save the images data
	var idArray = new Array; //List that will save the id's of each video
	var jsonObject = new Array; //Json

	//First ajax call to retrieve all video ID urls
	$.ajax({
		url : "https://www.googleapis.com/youtube/v3/search?key=AIzaSyCZIdvJkrCNDjswEeRtMTbN6B9yEiz2pEo&channelId=UCZJ7m7EnCNodqnu5SAtg8eQ&part=snippet&maxResults="+maxResults+"&format=json",
		dataType : "jsonp",
		success : function(parsed_json) {
			for (var i = 0; i < maxResults; i++) {
				if (i==9){
					stringUrl = stringUrl + parsed_json["items"][i]["id"]["videoId"];
				}else{
					stringUrl = parsed_json["items"][i]["id"]["videoId"]+ "%2C+" +stringUrl;
				};		
			};
			finalUrl = "https://www.googleapis.com/youtube/v3/videos?part=snippet%2C+statistics&id="+stringUrl+"&maxResults=10&key=AIzaSyCZIdvJkrCNDjswEeRtMTbN6B9yEiz2pEo";
			//Second ajax call to retrieve every data of the videos
			$.ajax({
				url: finalUrl,
				dataType : "jsonp",
				success : function(data) {
					for (var e = 0; e<maxResults; e++) {
						viewCount.push(data["items"][e]["statistics"]["viewCount"]);
						likeCount.push(data["items"][e]["statistics"]["likeCount"]);
						alphabetical.push(data["items"][e]["snippet"]["title"]);
						images.push(data["items"][e]["snippet"]["thumbnails"]["default"]["url"]);
						idArray.push(data["items"][e]["id"]);
					};
					for (var a = 0; a <maxResults; a++) {
						jsonObject.push(({name:alphabetical[a], images:images[a], view:viewCount[a], like:likeCount[a], ids:idArray[a]}))
					};
					console.log(idArray)
					var knockoutYoutube = function(items){
						this.mostViewed = function(){
							this.items.sort(function(a, b) {
								if(a.view<b.view){
									return 1;
								}else{
									return -1
								};
							});
						};
						this.lessViewed = function(){
							this.items.sort(function(a, b) {
								if(a.view<b.view){
									return -1;
								}else{
									return 1
								};
							});
						};
						this.bestRating = function(){
							this.items.sort(function(a,b){
								if(a.like<b.like){
									return 1;
								}else{
									return -1
								};
							});
						};
						this.worstRating = function(){
							this.items.sort(function(a,b){
								if(a.like<b.like){
									return -1;
								}else{
									return 1
								};
							});
						};

						this.letterSorting = function(){
							this.items.sort(function(a,b){
								if(a.name<b.name){
									return -1;
								}else{
									return 1
								};
							});
						};

						self.showVideo = function(youtubeName,youtubeVideoId,youtubeView, youtubeLike){
							$(".videoContent").empty();
							$(".videoContent").append("<div class=\"embed-responsive embed-responsive-16by9\"><iframe class=\"embed-responsive-item\" width=\"560\" height=\"315\" src=\"http://www.youtube.com/embed/"+youtubeVideoId+"\" frameborder=\"0\" allowfullscreen></iframe></div><br><br><span>Name: <strong>"+youtubeName+"</strong></span><br><span>Views: <strong>"+youtubeView+"</strong></span><br><span>Likes: <strong>"+youtubeLike+"</strong></span><br><span>Watch on youtube: <a href='https://www.youtube.com/watch?v="+youtubeVideoId+"'>https://www.youtube.com/watch?v="+youtubeVideoId+"</a>");
						};
						this.items = ko.observableArray(items);
						this.jsonModel =  ko.observableArray(jsonObject);
						this.gridOptions = {
							data: this.items,
							rowTemplate: "rowTmpl",
							useKOTemplates: true,
							height: 540,
							columns: [ 
								{
									title: "Name"
								},
								{
									title: "Image"   
								},
								{
									title: "View Count"
								},
								{
									title: "Like Count"
								},
							],
							pageable: {
							pageSize: 3,
							buttonCount: 1
							},
						};
					};
					ko.applyBindings(new knockoutYoutube(jsonObject));
				}//ajax on success call
			});//second ajax call
		}//ajax on success call
	}); //First ajax call

	$(".btn-lg").click(function(){
		var inputString = $(".inputString").val().toLowerCase();
		$(".inputString").val("");
		if(inputString.length!=0){
			$(".modal-body").empty();
			for (var i = 0; i < maxResults; i++) {
				var jsonTitle = jsonObject[i]['name'].toLowerCase();
				if(jsonTitle.indexOf(inputString)>-1){
					$(".modal-body").append("<div class='eachResult'><strong>Title: "+jsonObject[i]['name']+"</strong><br>"+"</div>");
					$(".modal-body").append('<button type="button" onclick="loadVideo(\''+jsonObject[i]['name']+'\',\''+jsonObject[i]['ids']+'\',\''+jsonObject[i]['view']+'\',\''+jsonObject[i]['like']+'\')" class="btn btn-primary" data-dismiss="modal">Load video</button>');
				};//if
			};//for
		};//if length
	});//when search button is clicked
}); //Document ready
