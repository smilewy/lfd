/**
 * Created by Administrator on 2017/2/10.
 */
define(["jquery", "route", "common"], function ($, app, comm) {
	app.register.controller('sciCtrl', ['$scope', '$timeout', "_ajax", "$state", function ($scope, $timeout, _ajax, $state) {
	    $('.radio-group input').on('click',function () {
            $(this).parent().addClass('checked').siblings('label').removeClass('checked');
        });
	    $timeout(function () {
            $('.radio-group input:checked').parent().addClass('checked');
        });
        $scope.lessonInfo = JSON.parse(sessionStorage.getItem("lesssonInfo"));
        //lessonInfo.teacherName
        //lessonInfo.studentEnName
        //lessonInfo.studentEnName
        //lessonInfo.coursewareCompleteCode
        //lessonInfo.coursewareName

        $scope.content = {
            "q01_01_s":"",
            "q01_02_s":"",
            "q01_03_s":"",
            "q01_04_s":"",
            "q01_05_s":"",
            "q01_06":"",
            "q02_01":"",
            "q02_02":"",
            "q02_03":""
        };
        $scope.params = {
            "idLfdLesson": $scope.lessonInfo.idLfdLesson,
            "feedbackText": ""
        };
        $scope.save = function () {
            $scope.content.q01_01_s = $scope.q01_01_s;
            $scope.content.q01_02_s = $scope.q01_02_s;
            $scope.content.q01_03_s = $scope.q01_03_s;
            $scope.content.q01_04_s = $scope.q01_04_s;
            $scope.content.q01_05_s = $scope.q01_05_s;
	        if (!comm.validNull($scope.content)) {
		        return
	        }
            $scope.params.feedbackText = JSON.stringify($scope.content);
            _ajax.post('/teacher/save/feedback', $scope.params, function (data) {
                $state.go('sessionHistory');
            });
        }
	}]);

	app.register.controller('sciDemoCtrl', ['$scope', '$timeout', "_ajax", "$state", function ($scope, $timeout, _ajax, $state) {
        $('.radio-group input').on('click',function () {
            $(this).parent().addClass('checked').siblings('label').removeClass('checked');
        });
        $timeout(function () {
            $('.radio-group input:checked').parent().addClass('checked');
        });
        $scope.lessonInfo = JSON.parse(sessionStorage.getItem("lesssonInfo"));

        $scope.content = {
            "q01_01":"",
            "q01_01_t":"",
            "q01_02":"",
            "q01_03":"",
            "q01_03_t":"",
            "q01_04":"",
            "q01_04_t":"",
            "q01_05":"",
            "q01_06":"",
            "q01_07":"",
            "q02_01":"",
            "q03_01":""
        };
        $scope.params = {
            "idLfdLesson": $scope.lessonInfo.idLfdLesson,
            "feedbackText": ""
        };
        $scope.save = function () {
	        if (!comm.validNull($scope.content)) {
		        return
	        }
	        if (confirm("The information you submit must be complete and accurate because after it has been submitted it is not possible to change！")) {
		        $scope.params.feedbackText = JSON.stringify($scope.content);
		        _ajax.post('/teacher/save/feedback', $scope.params, function (data) {
			        $state.go('sessionHistory');
		        });
	        }
        }
	}]);
});