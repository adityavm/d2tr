"use strict";

angular.module("d2tr")
.service("history", ["$http", "rankings", function($http, rankings){
	var obj = {},
		xhr = $http({
			method: "GET",
			url: "api/getHistory.php"
		});

	var processHistory = function(data){
		var week = 604800000;
		var now = +new Date();
		var lastSave = new Date(data.timestamp);
		/* store new rank if a week has gone by
		   since last save
		*/
		if(now - lastSave.getTime() > week)
			rankings.xhr.then(function(){
				var r = rankings.data,
					output = {};

				for(var i=0,l=r.length;i<l;i++)
					output[r[i].id] = data[r[i].id].concat([r[i].score]);

				output["timestamp"] = now;
				obj.store(output);
			})	
	}

	xhr.then(function(response){
		var data = response.data;
		processHistory(data);
		obj.data = data;
	});

	obj = {
		data: null,
		xhr: xhr,
		store: function(hist){
			$http({
				method: "POST",
				url: "api/storeHistory.php",
				data: {history: JSON.stringify(hist)}
			}).then(function(response){
				console.log(response.data);
			})
		}
	}
	return obj;
}])