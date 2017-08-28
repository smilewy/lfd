
define(["jquery", "route", "common"], function ($, app, comm) {
    app.register.controller('pictureBookCtrl', ['$scope', '_ajax', '$state', function ($scope, _ajax, $state) {
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

        $scope.pictureBookDemo = {
            part_1:{
                question_1 : '',
                question_2 : '',
                question_3 : '',
                question_4 : '',
                question_5 : '',
                question_6 : '',
                question_7 : ''
            },
            part_2:{
                question_1:''
            },part_3:{
                question_1:''
            }
        };
        $scope.pictureBook = {
            part_1:{
                question_1 : '',
                question_2 : '',
                question_3 : '',
                question_4 : '',
                question_5 : '',
                question_6 : ''
            },
            part_2:{
                question_1:''
            }
        };

        $scope.submitPictureBook = function () {
            $scope.pictureBook.part_1.question_1 = $scope.part_1_question_1;
            $scope.pictureBook.part_1.question_2 = $scope.part_1_question_2;
            $scope.pictureBook.part_1.question_3 = $scope.part_1_question_3;
            $scope.pictureBook.part_1.question_4 = $scope.part_1_question_4;
            $scope.pictureBook.part_1.question_5 = $scope.part_1_question_5;
            $scope.feedback.idLfdLesson = $scope.lessonInfo.idLfdLesson;
	        if (!comm.validNull($scope.pictureBook)) {
		        return
	        }
	        if (confirm("The information you submit must be complete and accurate because after it has been submitted it is not possible to change！")) {
		        $scope.feedback.feedbackText = JSON.stringify($scope.pictureBook);
		        _ajax.post('/teacher/save/feedback', $scope.feedback, function () {
			        $state.go('sessionHistory');
		        });
	        }
        };
        $scope.submitPictureBookDemo = function () {
            $scope.feedback.idLfdLesson = $scope.lessonInfo.idLfdLesson;
	        if (!comm.validNull($scope.pictureBookDemo)) {
		        return
	        }
            $scope.feedback.feedbackText = JSON.stringify($scope.pictureBookDemo);
            _ajax.post('/teacher/save/feedback', $scope.feedback, function () {
                $state.go('sessionHistory');
            });
        }


    }])
});