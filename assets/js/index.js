/**
 * Created by Administrator on 2017/2/6.
 */
define(['route'], function (app) {
	app.controller('idxCtrl', ['$scope', '_ajax','$rootScope','$state', function ($scope, _ajax,$rootScope,$state) {
		$rootScope.state=$state;
		// 服务器时间获取
		_ajax.get('/teacher/teacher/getServerTime','',function (res) {
			$scope.BJTime = res.resultData;
			setInterval(function () {
				$scope.$apply(function () {
					$scope.BJTime += 1000
				})
			}, 1000)
		});
		// 退出登陆
		$scope.logOut = function () {
			_ajax.get('/login/logout', '', function (res) {
				sessionStorage.removeItem('idTeacher');
				location.href = '/lfd_web/offcial/pages/en-index.html';
			});
		}
		//获取Message数量
		_ajax.get('/message/notRead/nums','',function (res) {
			$rootScope.messageNum=res.resultData;
		})
	}])
});