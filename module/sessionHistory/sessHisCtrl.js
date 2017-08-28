/**
 * Created by Administrator on 2017/2/9.
 */
define(["jquery", "route", "datetimepicker", "swiper"], function ($, app) {
	app.register.controller('sessCtrl', ['$scope', '$timeout', '$state', '_ajax', function ($scope, $timeout, $state, _ajax) {
		$("#dateTime").datetimepicker({
			format: "yyyy.mm.dd",
			autoclose: true,
			minView: 2,
			pickerPosition: "bottom-left"
		}).on('changeDate', function (e) {
			getTeacherSessionHistory();
		});

		var mySwiper = new Swiper('.homework-carousel', {
			spaceBetween: 10,
			nextButton: '.swiper-button-next',
			prevButton: '.swiper-button-prev'
		});

		var mySwiperCtrl = new Swiper('.homework-ctrl', {
			spaceBetween: 14,
			centeredSlides: true,
			slidesPerView: 'auto',
			touchRatio: 0.2,
			onlyExternal: true,
			slideToClickedSlide: true
		});

		mySwiper.params.control = mySwiperCtrl;
		mySwiperCtrl.params.control = mySwiper;

		$scope.pageConf = {
			showTotal: true,
			currentPage: 1,
			itemsPerPage: 10,
			prevBtn: 'Prev',
			nextBtn: 'Next',
			onChange: getTeacherSessionHistory
		};

		//请求参数
		$scope.requestParam = {
			"pageNo": 1,
			"pageSize": 10,
			"note": {
				"day": "",
				"enName": ""
			}
		};

		//上传视频
		$scope.file = {
			name: ''
		};
		$scope.uploadClick = function (id) {
			sessionStorage.setItem('lessonId', id);
			$('#fileupload').trigger('click')
		};

		$scope.$watch('file.name', function (newval, oldval) {
			console.log(newval);
			if (newval != oldval) {
				var videoName = newval.name;
				if (videoName.lastIndexOf('.mp4') == -1) {
					alert("视频的格式仅支持mp4");
					return false;
				}
				if (newval.size / 1024 / 1024 > 200) {
					alert("视频大小不能超过200M");
					return false;
				}
				var JSONRPC = {
					title: suffix(newval.name),
					tag: '',
					desc: ''
				};
				var formData = new FormData();
				formData.append('writetoken', 'f7425ccc-00cb-4a5e-9bcc-045961d54d52');
				formData.append('cataid', 1482756657334);
				formData.append('fcharset', 'ISO-8859-1');
				formData.append('JSONRPC', JSON.stringify(JSONRPC));
				formData.append('Filedata', newval);
				$.ajax({
					url: ' http://v.polyv.net/uc/services/rest?method=uploadfile',
					type: 'POST',
					data: formData,
					processData: false,
					contentType: false,
					beforeSend: function () {
						var loading = $('#loading');
						var node = '<div id="loading" class="loading-modal"><div><div class="spinner"><div class="spinner-container container1"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container2"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div><div class="spinner-container container3"><div class="circle1"></div><div class="circle2"></div><div class="circle3"></div><div class="circle4"></div></div></div></div></div>';
						if (loading.length != 0) {
							loading.remove()
						}
						$('body').append(node);
					},
					success: function (res) {
						if (res.error == 0) {
							var params = {
								lessonVedio: res.data[0].vid,    // 视频url
								idLfdLesson: sessionStorage.getItem('lessonId'),    // 课程ID
								vedioName: res.data[0].title       // 视频名称
							};
							_ajax.post('/lesson/upload/vedio', params, function (res) {
								getTeacherSessionHistory();
								alert("上传成功")
							})
						} else if (res.error == 4) {
							alert("视频的格式仅支持mp4")
						}
					},
					complete: function () {
						$('#loading').remove()
					}
				})
			}
		});
		
		/**
		 * 分页获取老师上课列表
		 */
		function getTeacherSessionHistory(time) {
			$scope.requestParam.note.day = $("#dateTime").val();
			$scope.requestParam.pageNo = $scope.pageConf.currentPage;
			_ajax.post('/teacher/queryTeacherLessonHistory', $scope.requestParam, function (res) {
				$scope.pageConf.totalItems = res.resultData.total;
				$scope.sessionList = res.resultData.records;
			});
		}

		/**
		 * 条件收索
		 * @type {getTeacherSessionHistory}
		 */
		$scope.search = getTeacherSessionHistory;

		/**
		 * 显示评价弹框
		 */
		$scope.showComments = function (commentId) {
			$scope.isShowCom = true;
			getComment(commentId);
		};

		/**
		 * 隐藏评价弹框
		 */
		$scope.closeComment = function () {
			$scope.isShowCom = false;
		};

		/**
		 * 获取评价详情
		 */
		function getComment(commentId) {
			_ajax.get('/teacher/comment/' + commentId, '', function (res) {
				$scope.comment = res.resultData;
			})
		}

		/**
		 * 显示作业弹框
		 */
		$scope.showHomework = function (homeworkId) {
			$scope.homework = true;
			getHomework(homeworkId);
		};

		/**
		 * 隐藏作业弹框
		 */
		$scope.hiddenHomework = function () {
			$scope.homework = false;
		};
		/**
		 * 获取作业详情
		 * @param homeworkId
		 */
		function getHomework(homeworkId) {
			_ajax.get('/teacher/homework/' + homeworkId, '', function (res) {
				$scope.homeworkDetail = res.resultData;
				$timeout(function () {
					mySwiper.update();
					mySwiperCtrl.update();
					mySwiperCtrl.slideTo(0)
				})
			})
		}

		/**
		 * 路由
		 * @param obj
		 */
		$scope.writeFeedback = function (obj) {
			var info = JSON.stringify(obj);
			sessionStorage.setItem('lesssonInfo', info);
			switch (obj.courseSystemEnName.toLowerCase()) {
				case 'language art':
					if (obj.previewStatus == '1') {
						$state.go('lanArtDemo');
					} else {
						$state.go('lanArt');
					}
					break;
				case 'picture book':
					if (obj.previewStatus == '1') {
						$state.go('picBookDemo');
					} else {
						$state.go('picbook');
					}
					break;
				case 'science':
					if (obj.previewStatus == '1') {
						$state.go('scienceDemo');
					} else {
						$state.go('science');
					}
					break;
				case 'social study':
					if (obj.previewStatus == '1') {
						$state.go('socStuDemo');
					} else {
						$state.go('socStu');
					}
					break;
			}
		};

		$scope.viewFeedback = function (obj) {
			var info = JSON.stringify(obj);
			sessionStorage.setItem('lesssonInfo', info);
			switch (obj.courseSystemEnName.toLowerCase()) {
				case 'language art':
					if (obj.previewStatus == '1') {
						$state.go('lanArtDemoView');
					} else {
						$state.go('lanArtView');
					}
					break;
				case 'picture book':
					if (obj.previewStatus == '1') {
						$state.go('picBookDemoView');
					} else {
						$state.go('picbookView');
					}
					break;
				case 'science':
					if (obj.previewStatus == '1') {
						$state.go('scienceDemoView');
					} else {
						$state.go('scienceView');
					}
					break;
				case 'social study':
					if (obj.previewStatus == '1') {
						$state.go('socStuDemoView');
					} else {
						$state.go('socStuView');
					}
					break;
			}
		};
		/**
		 * 去掉后缀名
		 * @param str 字符串
		 * @returns {*|void|XML|string}
		 */
		function suffix(str) {
			var reg = /(\.mp4|\.flv)$/;
			return str.replace(reg, '')
		}
	}])
});