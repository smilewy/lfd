/**
 * Created by Administrator on 2017/2/10.
 */
define(["jquery", "route", "common"], function ($, app, comm) {
	app.register.controller('lanArtCtrl', ['$scope', '_ajax', '$state', function ($scope, _ajax, $state) {
		/**
		 * 单选框选中事件
		 */
		$('.radio-group input').on('click',function () {
			$(this).parent().addClass('checked').siblings('label').removeClass('checked');
		});
		$scope.lessonInfo = JSON.parse(sessionStorage.getItem("lesssonInfo"));  //获取课程信息

		/**
		 * 保存课程反馈请求内容
		 * @type {{idLfdLesson: string, feedbackText: string}}
		 */
		$scope.feedback = {
			idLfdLesson : '',
			feedbackText : ''
		};

		/**
		 * 语言艺术 试听课 model
		 * @type {{part_1: {question_1: string, question_2: string}, part_2: {question_1: string, question_2: string, question_3: string, question_4: string, question_5: string}, part_3: string, part_4: string}}
		 */
		$scope.languageArtDemo = {
			part_1 : {
				question_1 : '',
				question_2 : '',
				question_3 : '',
				question_4 : ''
			},
			part_2 : {
				question_1 : '',
				question_2 : '',
				question_3 : '',
				question_4 : '',
				question_5 : ''
			},
			part_3 : '',
			part_4 : ''
		};

		/**
		 * 语言艺术 正式课 model
		 * @type {{part_1: {question_1: string, question_2: string, question_3: string}, part_2: {question_1: string, question_2: string, question_3: string}, part_3: {question_1: string}}}
		 */
		$scope.languageArt = {
			part_1 : {
				question_1 : '',
				question_2 : '',
				question_3 : ''
			},
			part_2 : {
				question_1 : '',
				question_2 : '',
				question_3 : ''
			},
			part_3 : {
				question_1 : ''
			}
		};

		/**
		 * 保存语言艺术试听课反馈
		 */
		$scope.submitLanguageArtDemo = function () {
			$scope.feedback.idLfdLesson = $scope.lessonInfo.idLfdLesson;
			if (!comm.validNull($scope.languageArtDemo)) {
				return;
			}
			if (confirm("The information you submit must be complete and accurate because after it has been submitted it is not possible to change！")) {
				$scope.feedback.feedbackText = JSON.stringify($scope.languageArtDemo);
				_ajax.post('/teacher/save/feedback', $scope.feedback, function (res) {
					$state.go('sessionHistory');
				})
			}
		};

		/**
		 * 保存语言艺术正式课反馈
		 */
		$scope.submitLanguageArt = function () {
			$scope.languageArt.part_1.question_1 = $scope.ratestar;
			$scope.languageArt.part_1.question_2 = $scope.engagement;
			$scope.feedback.idLfdLesson = $scope.lessonInfo.idLfdLesson;
			if (!comm.validNull($scope.languageArt)) {
				return;
			}
			$scope.feedback.feedbackText = JSON.stringify($scope.languageArt);
			_ajax.post('/teacher/save/feedback', $scope.feedback, function (res) {
				$state.go('sessionHistory');
			})
		};
	}])
});