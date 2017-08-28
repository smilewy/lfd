define(["jquery", "route", "common"], function ($, app, comm) {
    app.register.controller('socialStudyCtrl', ['$scope', '_ajax', '$state', function ($scope, _ajax, $state) {
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
         * social study model
         * @type {{part_1: {question_1: string, question_2: string, question_3: string, question_4: string, question_5: string}, part_2: {question_1: string}, part_3: {question_1: string}}}
         */
        $scope.socialStudy = {
            part_1 : {
                question_1 : '',
                question_2 : '',
                question_3 : '',
                question_4 : '',
                question_5 : ''
            },
            part_2 : '',
            part_3 : ''
        };

        /**
         * social study model
         * @type {{part_1: {question_1: string, question_2: string, question_3: string, question_4: string, question_5: string, question_6: string, question_7: string, question_8: string}, part_2: string, part_3: string}}
         */
        $scope.socialStudyDemo = {
            part_1 : {
                question_1 : '',
                question_2 : '',
                question_3 : '',
                question_4 : '',
                question_5 : '',
                question_6 : '',
                question_7 : '',
                question_8 : ''
            },
            part_2 : '',
            part_3 : ''
        }

        /**
         * 保存socialStudy 课程反馈
         */
        $scope.submitSocialFeedback = function () {
            $scope.socialStudy.part_1.question_1 = $scope.part_1_question_1;
            $scope.socialStudy.part_1.question_2 = $scope.part_1_question_2;
            $scope.socialStudy.part_1.question_3 = $scope.part_1_question_3;
            $scope.socialStudy.part_1.question_4 = $scope.part_1_question_4;
            $scope.feedback.idLfdLesson = $scope.lessonInfo.idLfdLesson;
	        if (!comm.validNull($scope.socialStudy)) {
		        return
	        }
            $scope.feedback.feedbackText = JSON.stringify($scope.socialStudy);
            _ajax.post('/teacher/save/feedback', $scope.feedback, function (res) {
                $state.go('sessionHistory');
            });
        };

        /**
         * 保存socialStudy demo课程反馈
         */
        $scope.submitSocialDemoFeedback = function () {
            $scope.feedback.idLfdLesson = $scope.lessonInfo.idLfdLesson;
	        if (!comm.validNull($scope.socialStudyDemo)) {
		        return
	        }
	        if (confirm("The information you submit must be complete and accurate because after it has been submitted it is not possible to change！")) {
		        $scope.feedback.feedbackText = JSON.stringify($scope.socialStudyDemo);
		        _ajax.post('/teacher/save/feedback', $scope.feedback, function (res) {
			        $state.go('sessionHistory');
		        });
	        }
        }
    }]);
});