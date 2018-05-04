$(function(){
    $('select[name=key]').change(function() {
        var key = $(this).val();
        var element;
        if (key == 'username') {
            $("#searchValDiv").empty();
            element = '<input name="value" class="form-control input-sm" placeholder="查询内容" style="width: 150px;"/>';
        }
        if (key == "type") {
            $("#searchValDiv").empty();
            element = '<select name="value" tyle="width: 150px;" class="form-control input-sm">' +
                '<option disabled selected>请选择用户类型</option>' +
                '<option value="0">管理员</option>' +
                '<option value="1">普通用户</option></select>';
        }
        if (key == "all") {
            $("#searchValDiv").empty();
        }
        $("#searchValDiv").append(element);
    });

    $('#editForm').bootstrapValidator({
        message : 'This value is not valid',
        feedbackIcons : {
            valid : 'glyphicon glyphicon-ok',
            invalid : 'glyphicon glyphicon-remove',
            validating : 'glyphicon glyphicon-refresh'
        },
        fields : {
            username : {
                message : '用户名验证失败',
                validators : {
                    notEmpty : {
                        message : '用户名不能为空'
                    },
                    stringLength : {
                        min : 6,
                        max : 20,
                        message : '用户名长度必须在6到20之间'
                    }
                }
            },
            password : {
                message : '密码验证失败',
                validators : {
                    notEmpty : {
                        message : '密码不能为空'
                    },
                    stringLength : {
                        min : 6,
                        max : 20,
                        message : '密码长度必须在6到20之间'
                    }
                }
            },
            password2 : {
                message : '确认密码验证失败',
                validators : {
                    notEmpty : {
                        message : '确认密码不能为空'
                    },
                    stringLength : {
                        min : 6,
                        max : 20,
                        message : '密码长度必须在6到20之间'
                    },
                    identical : {// 相同
                        field : 'password',
                        message : '两次密码不一致'
                    }
                }
            }
        }
    });
    var format1 = "yyyy年M月d日";
    var format2 = "yyyy-MM-dd";
    var format3 = "yyyy-MM-dd hh:mm:ss";
    var tables = $("#dataTable").dataTable({
        serverSide: true,// 分页，取数据等等的都放到服务端去
        processing: true,// 载入数据的时候是否显示“载入中”
        pageLength: 10,  // 首次加载的数据条数
        ordering: false,// 排序操作在服务端进行，所以可以关了。
        pagingType: "full_numbers",
        autoWidth: false,
        stateSave: true,// 保持翻页状态，和tables.fnDraw(false);结合使用
        searching: false,
        scrollX: true,			// 横向滚动条
        scrollY: "350px",			// 纵向滚动条
        ajax: {   // 类似jquery的ajax参数，基本都可以用。
            type: "GET",// 后台指定了方式，默认get，外加datatable默认构造的参数很长，有可能超过get的最大长度。
            url: path + "/user/getData",
            dataSrc: "data",// 默认data，也可以写其他的，格式化table的时候取里面的数据
            data: function (d) {// d是原始的发送给服务器的数据，默认很长。
                var param = {}; // 因为服务端排序，可以新建一个参数对象
                param.pageIndex = d.start;
                param.pageSize = d.length;
                var formData = $("#queryForm").serializeArray();// 把form里面的数据序列化成数组
                formData.forEach(function (e) {
                    param[e.name] = e.value;
                });
                return param;// 自定义需要传递的参数。
            },
        },
        columns: [// 对应上面thead里面的序列
            // {"data": null,"width":"10px"},
            {"data": null},
            {"data": 'username'},
            {"data": 'type',
                "render" : function(data){
                    return data == 0 ? '管理员' : '普通用户';
                }
            },
            {"data": 'created',
                "render":function(data){
                    return data == null ? '-' : millisecondToDate(data, format3);
                }
            },
            {"data": 'updated',
                "render":function(data){
                    return data == null ? '-' : millisecondToDate(data, format3);
                }
            },
            {"data": null,"width":"100px"}
        ],
        // 操作按钮
        columnDefs: [
            {
                targets: -1,// 编辑
                data: null,// 下面这行，添加了编辑按钮和删除按钮
                defaultContent:
                " <div class='btn-group'>"+
                "<p><button id='delRow' class='btn btn-primary btn-sm' type='button' data-toggle='tooltip' data-placement='top' title='删除'><i class='fa fa-trash-o'></i></button></p></div>"
            }
        ],
        // 在每次table被draw完后调用
        fnDrawCallback: function(){
            var api = this.api();
            // 获取到本页开始的条数
            var startIndex= api.context[0]._iDisplayStart;
            api.column(0).nodes().each(function(cell, i) {
                cell.innerHTML = startIndex + i + 1;
            });
        },
        language: {
            lengthMenu: "",// 不显示记录条数选择
            processing: "加载中...",// 处理页面数据的时候的显示
            paginate: {// 分页的样式文本内容。
                previous: "<",
                next: ">",
                first: "<<",
                last: ">>"
            },
            zeroRecords: "无数据",// table tbody 内容为空时，tbody的内容。
            info: "第_START_-_END_条,共 _TOTAL_ 条,共_PAGES_ 页",
            infoEmpty: "无数据",// 筛选为空时左下角的显示。0条记录
            infoFiltered: "",	// 筛选之后的左下角筛选提示(另一个是分页信息显示，在上面的info中已经设置，所以可以不显示)，
            sSearch: "关键字：",
        }
    });
    // 查询按钮
    $("#btn-query").on("click", function () {
        tables.fnDraw();
    });
    // 刷新
    $("#btn-re").on("click", function () {
        tables.fnDraw(false);
    });
    // 点击添加按钮，显示 editModal 窗口
    $("#btn-add").on("click", function () {
        if(currUser.type != 0){
            toastr.error("无权限！");
            return;
        }
        url = path + "/user/save";
        $("#editForm input[name=id]").val("");
        $("#editForm input[name=username]").val("");
        // $("#editForm select[name=userType]").val("");
        $("#editForm input[name=password]").val("");
        $("#editForm input[name=password2]").val("");
        $("#editModal").modal("show");
    });
    // 点击 editModal 弹出窗口的提交按钮
    $("#btn-submit").on("click", function(){
        // 表单验证
        var bootstrapValidator = $("#editForm").data('bootstrapValidator');
        bootstrapValidator.validate();
        if (!bootstrapValidator.isValid()) return;// 表单验证失败
        $.ajax({
            cache: false,
            type: "POST",
            url: url,
            data: $("#editForm").serialize(),
            async: false,
            error: function(request) {
                toastr.error("Server Connection Error...");
            },
            success: function(result) {
                if(result.status == 200){
                    $("#editModal").modal("hide");
                    toastr.success(result.msg);
                    tables.fnDraw(false);
                }else{
                    toastr.error(result.msg);
                }
            }
        });
        $("#editForm").data('bootstrapValidator').destroy();
        $('#editForm').data('bootstrapValidator', null);
    });
    // 点击删除按钮
    $('#dataTable tbody').on( 'click', '#delRow', function () {
        if(currUser.type != 0){
            toastr.error("无权限！");
            return;
        }
        var data = tables.api().row($(this).parents('tr')).data();
        swal({
                title: "确定删除?",
                text: "删除后将无法恢复!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "删除",
                cancelButtonText: "放弃",
                closeOnConfirm: false,
            },
            function(){
                $.ajax({
                    url:path + '/user/del/' + data.id,
                    type:'delete',
                    dataType: "json",
                    cache:"false",
                    success:function(result){
                        if(result.status == 200){
                            swal(result.msg, "", "success");
                            //toastr.success(result.msg);
                            tables.api().row().remove().draw(false);// 删除这行的数据
                        }else{
                            swal(result.msg, "", "error");
                            //toastr.error(result.msg);
                        }
                    },
                    error:function(err){
                        swal("Server Connection Error...", "", "error");
                        //toastr.error("Server Connection Error...");
                    }
                });
            });
    });
});

//将毫毫秒转化为日期
function millisecondToDate(ms, format){
    if(ms == null){
        return '';
    }
    var date = new Date(parseInt(ms));
    return date.format(format);
}

// 格式化时间
Date.prototype.format = function(fmt) {
    var o = {
        "M+" : this.getMonth()+1,                 // 月份
        "d+" : this.getDate(),                    // 日
        "h+" : this.getHours(),                   // 小时
        "m+" : this.getMinutes(),                 // 分
        "s+" : this.getSeconds(),                 // 秒
        "q+" : Math.floor((this.getMonth()+3)/3), // 季度
        "S"  : this.getMilliseconds()             // 毫秒
    };
    if(/(y+)/.test(fmt)) {
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}