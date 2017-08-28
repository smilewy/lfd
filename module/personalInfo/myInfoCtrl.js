define(["jquery", "route", 'bootstrap', 'cropper'], function ($, app) {
    app.register.controller("personalInfoViewCtrl", ["$rootScope", "$scope", "$filter", "_ajax","$timeout","$stateParams", function ($rootScope, $scope, $filter, _ajax,$timeout,$stateParams) {
        var teacherId=$stateParams.id;
        $scope.param={
            idTeacher:teacherId,  //老师id
            name:'',  //姓名
            idLfdDic:'', //国籍id
            major:'',  //专业
            graduationCollege:'', //毕业院校
            motto:'',  //人生格言
            selfEvaluation:'',  //自我评价
            wechat:'', //微信
            headImage:'',  //头像
            loginName:''  //邮箱
        };
        $scope.imgHave=false;
        $scope.fullHeadImage='';
        //选择本地文件
        var upImgageToken='';    //上传需要的token
        //获取token
        $.ajax({
            type:'GET',
            async:false,
            data:'',
            url:baseUrl+'/qiniu/token',
            dataType:'json',
            success:function (res) {
                upImgageToken=res.uptoken;
            }
        });
        //请求老师信息
        _ajax.get('/teacher/teacher/getTeacherInfoById?idTeacher='+teacherId,'',function (res) {
            $scope.param.name=res.resultData.name;
            $scope.param.major=res.resultData.major;
            $scope.param.idLfdDic=res.resultData.idLfdDic;
            $scope.param.graduationCollege=res.resultData.graduationCollege;
            $scope.param.motto=res.resultData.motto;
            $scope.param.selfEvaluation=res.resultData.selfEvaluation;
            $scope.param.wechat=res.resultData.wechat;
            $scope.fullHeadImage=res.resultData.fullHeadImage;
            $scope.param.headImage=res.resultData.headImage;
            $scope.param.loginName=res.resultData.loginName;
        });
        //请求国家
        _ajax.get('/common/country/list','',function (res) {
           $scope.countries=res.resultData;
        });
        //保存个人信息
        $scope.saveInfo=function () {
            _ajax.post('/teacher/teacher/saveTeacherInfo',$scope.param,function (res) {
                alert('保存成功');
            })
        };
        //上传图片
        $("body").on("change",".file_upload",function(e){
            $scope.imgHave=true;
            var $file = $(this);
            var fileObj = $file[0];
            var windowURL = window.URL || window.webkitURL;
            var dataURL;
            var $img = $("#preview");
            var filemaxsize = 1024 * 5;//5M
            var target = $(e.target);
            var Size = target[0].files[0].size / 1024;
            if(Size > filemaxsize) {
                alert('图片过大，请重新选择!');
	            $scope.imgHave = false;
                return false;
            }
            if(!this.files[0].type.match(/image.*/)) {
                alert('请选择正确的图片!');
                $scope.imgHave = false;
                return false;
            }
            if(fileObj && fileObj.files && fileObj.files[0]){
                dataURL = windowURL.createObjectURL(fileObj.files[0]);
                $img.attr('src',dataURL);
            }else{
                dataURL = $file.val();
                var imgObj = document.getElementById("preview");
                imgObj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
                imgObj.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = dataURL;

            }
            $img.cropper({
                aspectRatio: 297/392,
                preview: [$('.previewBimg'),$('.previewSimg')],
                strict: false
                /*crop: function(data) {
                    var $imgData=$img.cropper('getCroppedCanvas')
                    var dataurl = $imgData.toDataURL('image/png');
                    $("#previewyulan").attr("src",dataurl)
                }*/
            });
            $img.cropper('replace',dataURL);

            $("body").unbind("click").on("click",".queding",function(){
                var $imgData=$img.cropper('getCroppedCanvas');
                var dataurl = $imgData.toDataURL('image/png');  //dataurl便是base64图片
                $(".myimg").attr("src",dataurl);
                $(".parsetcroBox").remove();
                imgReplaceBtn=1;
                //下面两种方法需要用到那种使用哪种即可,或者都不使用直接上传base64文件给后台即可，哈哈
                putb64(dataurl);    //上传base64图片上传至七牛云方法，需要先获取到后台生成的上传token
                //blob = dataURLtoBlob(dataurl);   //将base64图片转化为blob文件方法
            })
        });

        $('#myModal').on('hidden.bs.modal', function (e) {
            destroyCropper();
        });

        function putb64(picBase){   //七牛云官方文档方法
            /*picUrl用来存储返回来的url*/
            var picUrl;
            /*把头部的data:image/png;base64,去掉。（注意：base64后面的逗号也去掉）*/
            picBase=picBase.substring(22);
            /*通过base64编码字符流计算文件流大小函数*/
            function fileSize(str) {
                var fileSize;
                if(str.indexOf('=')>0)  {
                    var indexOf=str.indexOf('=');
                    str=str.substring(0,indexOf);//把末尾的’=‘号去掉
                }
                fileSize=parseInt(str.length-(str.length/8)*2);
                return fileSize;
            }
            /*把字符串转换成json*/
            function strToJson(str) {
                var json = eval('(' + str + ')');
                return json;
            }
            //http://upload-z2.qiniu.com/putb64/ 只适用于七牛云华南空间 因为我的是七牛云华南空间，如果不是华南空间需要根据七牛云文档进行更改
            var url = "http://upload.qiniu.com/putb64/"+fileSize(picBase);
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange=function(){
                if (xhr.readyState==4&&xhr.status==200){
                    var keyText=xhr.responseText;
                    /*返回的key是字符串，需要装换成json*/
                    keyText=strToJson(keyText);
                    /* http://image.haoqiure.com/ 是我的七牛云空间网址，keyText.key 是返回的图片文件名*/
                    picUrl="http://static.lefundo.com/"+keyText.key;
                   // $("#imgShowurl").val(picUrl) ;  //将图片链接显示在输入框去
                    $('#myModal').modal('hide');
                    $scope.fullHeadImage=picUrl;
                    $scope.param.headImage=keyText.key;
                }
            };
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-Type", "application/octet-stream");
            xhr.setRequestHeader("Authorization", "UpToken "+upImgageToken+"");
            xhr.send(picBase);
        }
        //销毁cropper
        function destroyCropper() {
            $("#preview").cropper('destroy');
            $('#preview').attr('src','');
            $('.file_upload').val('');
            $scope.imgHave = false;
        }
    }])
});