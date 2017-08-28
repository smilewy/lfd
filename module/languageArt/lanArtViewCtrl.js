define(["jquery", "route"], function ($, app) {
	app.register.controller('lanArtViewCtrl', ['$scope', '_ajax', function ($scope, _ajax) {
		$scope.lessonInfo = JSON.parse(sessionStorage.getItem("lesssonInfo"));  //获取课程信息
		_ajax.get('/lesson/feedback/' + $scope.lessonInfo.idLfdLesson, '', function (res) {
			$scope.languageArt = JSON.parse(res.resultData.feedbackText);
		});
	}])
});