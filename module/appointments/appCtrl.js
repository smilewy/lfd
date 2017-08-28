define(["jquery", "route"], function ($, app) {
	app.register.controller("appCtrl", ["$scope", "$filter", "$timeout", "_ajax", function ($scope, $filter, $timeout, _ajax) {
		var isRead;
		$scope.newAppoCheck = true; // 默认勾选显示近一周的约课数据
		$scope.upAppoCheck = true;  // 默认勾选显示近一周的要上课数据
		$scope.newAppoPageConf = {  // 近一周约课数据分页
			showTotal: true,
			currentPage: 1,
			itemsPerPage: 10,
			prevBtn: "Prev",
			nextBtn: "Next",
			onChange: newAppoList
		};
		$scope.upAppoPageConf = {   // 近一周要上课数据分页
			showTotal: true,
			currentPage: 1,
			itemsPerPage: 10,
			prevBtn: "Prev",
			nextBtn: "Next",
			onChange: upAppoList
		};
		$scope.checkboxChecked = checkboxChecked;
		$scope.showStudentPlan = showStudentPlan;
		$scope.closeStuPlan = closeStuPlan;
		$scope.enterRoom = enterRoom;

		/**
		 * new appointments 数据（近一周的约课数据）
		 */
		function newAppoList() {
			var newAppoParams = {
				"pageNo": $scope.newAppoPageConf.currentPage,
				"pageSize": $scope.newAppoPageConf.itemsPerPage,
				"note": {
					"startTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm"),   // 老师当前时间 ps:2017-01-01 10:00
					"endTime": ""   // 如果查全部数据传空
				}
			};
			newAppoParams.note.endTime = lastWeek($scope.newAppoCheck);
			_ajax.post("/lesson/queryNewAppointments", newAppoParams, function (res) {
				$scope.newAppoPageConf.totalItems = res.resultData.total;
				$scope.newAppoList = res.resultData.records;
			})
		}

		/**
		 * upcoming appointments 数据（近一周的要上课数据）
		 */
		function upAppoList() {
			var upAppoParams = {
				"pageNo": $scope.upAppoPageConf.currentPage,
				"pageSize": $scope.upAppoPageConf.itemsPerPage,
				"note": {
					"startTime": $filter("date")(new Date(), "yyyy-MM-dd HH:mm"),   // 老师当前时间 ps:2017-01-01 10:00
					"endTime": ""   // 如果查全部数据传空
				}
			};
			upAppoParams.note.endTime = lastWeek($scope.upAppoCheck);
			_ajax.post("/lesson/queryUpcomingAppointments", upAppoParams, function (res) {
				$scope.upAppoList = res.resultData.records;
				$scope.upAppoPageConf.totalItems = res.resultData.total;
			})
		}

		/**
		 * 进入教室
		 * @param idLfdLesson 课程ID
		 */
		function enterRoom(idLfdLesson) {
			_ajax.get("/lesson/enterRoom/" + idLfdLesson, "", function (res) {
				var hostKey = res.resultData.hostKey,
					url = res.resultData.joinUrl;
				_alertRoom(hostKey, url)
			})
		}

		/**
		 * 显示学生弹窗
		 * @param obj
		 */
		function showStudentPlan(obj) {
			$scope.isShow = true;   // 显示弹窗
			_ajax.get("/lesson/viewStudent/" + obj.idUser, "", function (res) {
				var data = res.resultData;
				if (data.enRemark) {
					if (data.enRemark.length > 240) {
						data.enRemarkStr = $filter('limitTo')(data.enRemark, 240) + '...'
					} else {
						data.enRemarkStr = data.enRemark;
					}
				} else {
					data.enRemarkStr = ''
				}
				$scope.studentInfo = data;
				$scope.studentInfo.newAppoInfo = obj;
				console.log(res);
			});
			if (obj.isTeacherRead != "Y") { // 老师未查看此信息
				isRead = true;  // 判断约课信息是否已被查看
				_ajax.get("/lesson/readLesson/" + obj.idLfdLesson, "")
			} else {
				isRead = false;
			}
		}

		/**
		 * 关闭学生信息弹窗
		 */
		function closeStuPlan() {
			$scope.isShow = false;  // 隐藏弹窗
			if (isRead) {
				newAppoList();
				upAppoList();
			}
		}

		/**
		 * 切换显示近一周或全部的数据
		 * @param num
		 * num = 1：近一周的约课数据
		 * num = 2：近一周的要上课数据
		 */
		function checkboxChecked(num) {
			switch (num) {
				case "1":
					$scope.newAppoCheck = !$scope.newAppoCheck;
					$scope.newAppoPageConf.currentPage = 1;
					newAppoList();
					break;
				case "2":
					$scope.upAppoCheck = !$scope.upAppoCheck;
					$scope.upAppoPageConf.currentPage = 1;
					upAppoList();
			}
		}

		/**
		 * 近一周的最后一天
		 * @param bool  判断是否需要返回近一周的最后一天
		 * @returns {string}
		 */
		function lastWeek(bool) {
			var tempDate = "";
			if (bool) {  // 近一周要上课数据
				var currTime = new Date(),
					lastDay = currTime.setDate(currTime.getDate() + 6); // 当前时间往后延6天
				tempDate = $filter("date")(lastDay, "yyyy-MM-dd") + " 23:59"
			}
			return tempDate
		}

		/**
		 * Room弹窗
		 * @private
		 * @param hostKey   获取权限密码
		 * @param url   教室地址
		 */
		function _alertRoom(hostKey, url) {
			var node = '<div class="popup"><div id="alert"><button class="btn-close"></button><div><p>请复制密码:' + hostKey + '</p><p><a id="" href="' + url + '" target="_blank">进入教室</a></p></div></div></div>';
			$("body").append(node);
			$("#alert").find(".btn-close").one("click", function () {
				$(this).parents(".popup").remove()
			})
		}
	}])
});