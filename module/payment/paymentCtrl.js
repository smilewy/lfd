define(["jquery", "route", 'bootstrap'], function ($, app) {
    app.register.controller("paymentViewCtrl", ["$rootScope", "$scope", "$filter", "_ajax", function ($rootScope, $scope, $filter, _ajax) {
        var monthAry=[{
            eDate:'Jan',
            cDate:1
        },{
            eDate:'Feb',
            cDate:2
        },{
            eDate:'Mar',
            cDate:3
        },{
            eDate:'Apr',
            cDate:4
        },{
            eDate:'May',
            cDate:5
        },{
            eDate:'Jun',
            cDate:6
        },{
            eDate:'Jul',
            cDate:7
        },{
            eDate:'Aug',
            cDate:8
        },{
            eDate:'Sep',
            cDate:9
        },{
            eDate:'Oct',
            cDate:10
        },{
            eDate:'Nov',
            cDate:11
        },{
            eDate:'Dec',
            cDate:12
        }];  //月份列表
        var curIdx=new Date().getMonth();
        $scope.curMonth=monthAry[curIdx].eDate;
        $scope.curYear=new Date().getFullYear();
        var curMonthNum=monthAry[curIdx].cDate;
        $scope.accountType=1;

        getTeacherSalary();
        //查询教师薪资星级
        _ajax.get('/teacherSalary/getCurrentContractLevel','',function (res) {
            $scope.star=res.resultData;
        });
        //日历切换
        $scope.changeMonth=function (type) {
            if(type=='prev'){   //上一月
                curIdx--;
                if(curIdx<0){
                    curIdx=11;
                    $scope.curYear--;
                }
            }else{   //下一月
                curIdx++;
                if(curIdx>11){
                    curIdx=0;
                    $scope.curYear++;
                }
            }
            $scope.curMonth=monthAry[curIdx].eDate;
            curMonthNum=monthAry[curIdx].cDate;
            getTeacherSalary();
        };
        //数据切换
        $scope.changeAccount=function (type) {
            $scope.accountType=type;
            getTeacherSalary();
        };
        //查询薪资列表
        function getTeacherSalary() {
            if(parseInt(curMonthNum)<10){
                curMonthNum='0'+parseInt(curMonthNum);
            }
            var tTime=$scope.curYear+'-'+curMonthNum;
            _ajax.get('/teacherSalary/queryTeacherSalary/'+$scope.accountType+'/'+tTime,'', function (res) {
                $scope.salaryLists=res.resultData;
            });
        }
    }])
});
