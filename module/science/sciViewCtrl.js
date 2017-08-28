define(["jquery", "route"], function ($, app) {
    app.register.controller('sciViewCtrl', ['$scope', '_ajax', '$state', function ($scope, _ajax, $state) {
        $scope.lessonInfo = JSON.parse(sessionStorage.getItem("lesssonInfo"));  //获取课程信息
        _ajax.get('/lesson/feedback/' + $scope.lessonInfo.idLfdLesson, '', function (res) {
            $scope.content =JSON.parse(res.resultData.feedbackText);
        });
    }])
});