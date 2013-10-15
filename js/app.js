"use strict"

angular.module("d2tr", [])
.factory("rankings", ["$http", function($http){
	function Rankings(){ 
		this.data = [];
		this.p = null;
		this.xhr = function(){
			var $this = this;
			this.p = $http({method:"GET",url:"api/getRanks.php"});
			this.p.then(function(response){ 
				for(var i=0,l=response.data.jd.length;i<l;i++){
					var xml = $(response.data.jd[i]),
						logo = xml.find("img").attr("src"),
						team = $.trim(xml.find("td").eq(1).text()),
						rank = $.trim(xml.find("td.textRight").text());

					$this.data.push({
						logo: logo,
						team: team,
						rank: rank
					})
				}
			})
		}

		this.xhr();
	}
	return Rankings;
}])
.directive("rankings", function(){
	return {
		restrict: "E",
		controller: ["$scope", "rankings", function($scope, Rankings){
			var r = new Rankings();	
			r.p.then(function(){ 
				$scope.teams = r.data;
			});
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

			var range = first.rank-last.rank,
				pos = (first.rank-teams[i].rank)/range * 100;
				ele.css("top", pos+"%");
		}
	}
}])