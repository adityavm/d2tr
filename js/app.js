"use strict"

angular.module("d2tr")
.service("rankings", ["$http", function($http){
	var obj = {data: [], xhr: null};

	obj.xhr = $http({method:"GET",url:"api/getRanks.php"});

	obj.xhr.then(function(response){ 
		for(var i=0,l=response.data.jd.length;i<l;i++){
			var xml = $(response.data.jd[i]),
				logo = xml.find("img").attr("src"),
				id = (function(){
					var a = xml.attr("href");
					a = a.split("/");
					a = a[a.length-1];
					return parseInt(a.match(/(\d+)/)[1]);
				})(),
				team = $.trim(xml.find("td").eq(1).text()),
				score = parseInt($.trim(xml.find("td.textRight").text()));

			obj.data.push({
				id: id,
				logo: logo,
				team: team,
				score: score
			})
		}
	})

	return obj;
}])
.directive("rankings", function(){
	return {
		restrict: "E",
		controller: ["$scope", "rankings", "history", function($scope, rankings, history){
			history.xhr.then(function(){
				var hist = history.data;
				rankings.xhr.then(function(){ 
					var ranking = rankings.data;

					for(var i=0,l=ranking.length;i<l;i++){
						var r = ranking[i],
							h = hist[ranking[i].id] ? hist[ranking[i].id].concat(ranking[i].score) : [ranking[i].score];
						ranking[i].history = h.toString();
					}

					$scope.teams = ranking;
				});
			})
		}]
	}
})
.directive("barUnit", ["rankings", function(Rankings){
	return {
		restrict: "A",
		link: function post(scope,ele,attrs){
			var teams = scope.teams,
				i = scope.$index,
				first = teams[0],
				last = teams[teams.length-1];

			var range = first.score-last.score,
				pos = (first.score-teams[i].score)/range * 100;
				ele.css("top", pos+"%");
		}
	}
}])
.directive("drawHistory", function(){
	return {
		restrict: "A",
		scope: {
			data: "=drawHistory"
		},
		link: function post(scope,ele,attrs){
			function formatData(){
				var arr = scope.data.split(","),
					first = parseInt(arr[0]);

				for(var i=0,l=arr.length;i<l;i++)
					arr[i] = parseInt(arr[i])-first;

				return arr.toString();
			}

			$(ele).peity("line", {strokeColour: "#9c3425", colour: "transparent", height: "10px"});
			$(ele).text(formatData());

			scope.$watch("data", function(){
				$(ele).text(formatData())
				$(ele).change();
			})
		}
	}
})