define(["jquery", "route", 'bootstrap'], function ($, app) {
    app.register.controller("messageViewCtrl", ["$rootScope", "$scope", "$filter", "_ajax","$state", function ($rootScope, $scope, $filter, _ajax,$state) {
        $scope.messageType=0;
        $scope.pageConf = {
            showTotal: true,
            currentPage: 1,
            itemsPerPage: 10,
            prevBtn: 'Prev',
            nextBtn: 'Next',
            onChange: getMsgList
        };

        //请求参数
        $scope.requestParam = {
            "pageNo": 1,
            "pageSize": 10
        };

        function getMsgList() {
            $scope.requestParam.pageNo = $scope.pageConf.currentPage;
            var url;
            if($scope.messageType==0){
                url='/notice/pageNotice';
            }else{
                url='/message/page';
            }
            _ajax.post(url,$scope.requestParam,function (res) {
                $scope.pageConf.totalItems = res.resultData.total;
                $scope.lists=res.resultData.records;
            })
        }
        //改变数据
        $scope.changeMessage=function (type) {
            $scope.messageType=type;
            $scope.pageConf.currentPage=1;
            getMsgList();
        };
        //删除操作
        $scope.operation=function (idx,type) {
            if(type==1){   //读
                if($scope.lists[idx].isRead=='N'){
                    _ajax.get('/notice/updateTeacherNotice/'+$scope.lists[idx].idLfdNotice+'/'+type,'',function (res) {
                        sessionStorage.teacherMsg=JSON.stringify($scope.lists[idx]);
                        $state.go('msgFromI2View');
                        $rootScope.messageNum--;
                    })
                }else{
                    sessionStorage.teacherMsg=JSON.stringify($scope.lists[idx]);
                    $state.go('msgFromI2View');
                }
            }else{   //删除
                if(confirm('确定删除该消息吗？')){
                    _ajax.get('/notice/updateTeacherNotice/'+$scope.lists[idx].idLfdNotice+'/'+type,'',function (res) {
                        getMsgList();
                    })
                }
            }
        }
        $scope.operations=function (idx, type) {
            if(type==1){
                if($scope.lists[idx].isTeacherRead=='N'){
                    _ajax.get('/message/change/readStatus/'+$scope.lists[idx].idLfdMessage,'',function (res) {
                        $state.go('msgFromStudentView',{id:$scope.lists[idx].idLfdMessage});
                        $rootScope.messageNum--;
                    })
                }else{
                    $state.go('msgFromStudentView',{id:$scope.lists[idx].idLfdMessage});
                }
            }else{   //删除
                if(confirm('确定删除该消息吗？')){
                    _ajax.get('/message/delete/'+$scope.lists[idx].idLfdMessage,'',function (res) {
                        getMsgList();
                    })
                }
            }
        }
    }]);
    app.register.controller('msgFromI2ViewCtrl',["$rootScope", "$scope", "$filter", "_ajax", function ($rootScope, $scope, $filter, _ajax) {
        $scope.info=JSON.parse(sessionStorage.teacherMsg);
    }]);
    app.register.controller('msgFromStudentViewCtrl',["$rootScope", "$scope", "$filter", "_ajax","$stateParams", function ($rootScope, $scope, $filter, _ajax,$stateParams) {
        var id=$stateParams.id;
        $scope.editState=false;
        $scope.param={
            "idLfdMessage": id,  //消息Id
            "teacherMessage": ""  //老师回复消息
        };

        _ajax.get('/message/'+id,'',function (res) {
            $scope.msgInfo=res.resultData;
        });
        //打开回复
        $scope.replay=function () {
            $scope.editState=!$scope.editState;
            $scope.param.teacherMessage='';
        };
        //确定回复
        $scope.replayConfirm=function () {
            if(!$scope.param.teacherMessage){
                alert('回复不能为空');
                return false;
            }
            _ajax.post('/message/reply',$scope.param,function (res) {
                _ajax.get('/message/'+id,'',function (res) {
                    $scope.msgInfo=res.resultData;
                });
            })
        }
    }])
});
