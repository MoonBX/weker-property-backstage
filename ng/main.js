/**
 * Created by zhongyuqiang on 16/11/30.
 */
angular.module('mainMdl', [])
  .controller('mainCtl', mainCtl);

function mainCtl($scope, $rootScope, $location, $state, $timeout, cfpLoadingBar, mainSrv, toastr){
  var mainVm = this;

  mainVm.asideArr = [
    {title: '首页', b_title: '首页', icon: 'fa-home', sref: 'home', path: 'index', isActive: true},
    {title: '物业中心', icon: 'fa-building', sref: 'property', path: 'property', isActive: false, item:[
      {b_title: '物业中心', itemName:"公告管理", sref:"property.announce", pageNo: 1, isActive: false},
      {b_title: '物业中心', itemName:"投诉", sref:"property.complain", pageNo: 1, isActive: false},
      {b_title: '物业中心', itemName:"维修", sref:"property.repair", pageNo: 1, isActive: false}
    ]},
    {title: '设备管理', icon: 'fa-cog', sref: 'device', path: 'device', pageNo: 1, isActive: false},
    {title: '门禁管理', icon: 'fa-unlock-alt', sref: 'door', path: 'door', isActive: false, item: [
      {b_title: '门禁管理', itemName:"住户管理", sref:"door.household", pageNo: 1, isActive: false},
      {b_title: '门禁管理', itemName:"公卡管理", sref:"door.common", pageNo: 1, isActive: false},
    ]},
    {title: '日志查询', icon: 'fa-file-text-o', sref: 'log', path: 'log', isActive: false, item:[
      {b_title: '日志查询', itemName:"开门日志", sref:"log.open", pageNo: 1, isActive: false},
      {b_title: '日志查询', itemName:"防拆日志", sref:"log.remove", pageNo: 1, isActive: false},
      {b_title: '日志查询', itemName:"访客日志", sref:"log.visitor", pageNo: 1, isActive: false},
    ]},
    {title: '数据分析', icon: 'fa-file-text-o', sref: 'analyse', path: 'analyse', isActive: false, item:[
      {b_title: '数据分析', itemName:"重点关注", sref:"analyse.zhongdian", pageNo: 1, isActive: false},
      {b_title: '数据分析', itemName:"人口分析", sref:"analyse.renkou", pageNo: 1, isActive: false},
      {b_title: '数据分析', itemName:"房屋分析", sref:"analyse.fangwu", pageNo: 1, isActive: false},
      {b_title: '数据分析', itemName:"研判分析", sref:"analyse.yanpan", pageNo: 1, isActive: false}
    ]}
  ];
  var pathNav = [
    {path: '/index', b_title: '首页', itemName: ''},
    {path: '/property/announce', b_title: '物业中心', itemName: '公告管理'},
    {path: '/property/complain', b_title: '物业中心', itemName: '投诉'},
    {path: '/property/repair', b_title: '物业中心', itemName: '维修'},
    {path: '/device', b_title: '设备管理', itemName: ''},
    {path: '/door/household', b_title: '门禁管理', itemName: '住户管理'},
    {path: '/door/common', b_title: '门禁管理', itemName: '公卡管理'},
    {path: '/log/open', b_title: '日志查询', itemName: '开门日志'},
    {path: '/log/remove', b_title: '日志查询', itemName: '防拆日志'},
    {path: '/log/visitor', b_title: '日志查询', itemName: '访客日志'},
    {path: '/account/update-password', b_title: '修改密码', itemName: ''}
  ];
  mainVm.currentNav = {title: '首页', b_title: '首页', icon: 'user', sref: 'home', path: 'index', isActive: true};
  mainVm.account = {};
  $scope.user = {};
  mainVm.switchNavItem = switchNavItem;
  mainVm.switchItem = switchItem;
  mainVm.login = login;
  mainVm.logout = logout;
  mainVm.logup = logup;
  mainVm.wekerUsername = localStorage.wekerUsername;
  $scope.state = $state;

  function checkUrl(){
    var pathArr = $location.path().split('/');
    var path = pathArr[1];
    var arr = mainVm.asideArr;

    if(path == 'login'){
      mainVm.isLogin = false;
    }else{
      mainVm.isLogin = true;
    }
    for(var i=0;i<arr.length;i++){
      mainVm.asideArr[i].isActive = false;
      if(path === arr[i].path){
        mainVm.asideArr[i].isActive = true;
        mainVm.currentNav = mainVm.asideArr[i]
      }
    }
    for(var j=0; j<pathNav.length; j++){
      if($location.path() == pathNav[j].path){
        mainVm.currentNav.b_title = pathNav[j].b_title;
        mainVm.currentNav.itemName = pathNav[j].itemName;
      }
    }
  }

  function login(obj){
    if(localStorage.wekerToken){
      localStorage.removeItem('wekerToken');
    }
    mainSrv.login(obj).then(function(data){
      console.log(data);
      if(data.success){
        cfpLoadingBar.start();
        console.log(data.data);
        localStorage.wekerToken = data.data.token;
        localStorage.wekerUsername = data.data.community.name;
        localStorage.wekerEstateName = data.data.community.eatateName;
        mainVm.wekerUsername = localStorage.wekerUsername;
        $timeout(function(){
          window.location.href = '/#/index';
          cfpLoadingBar.complete();
        }, 1000)
        mainVm.isLoginError = false;
      }else{
        mainVm.isLoginError = true;
      }

    }, function(error){
      console.log(error)
    })
  }

  function logout(){
    mainSrv.logout().then(function(res){
      if(res.success){
        localStorage.removeItem('wekerToken');
        localStorage.removeItem('wekerUsername');
        localStorage.removeItem('wekerEstateName');
        toastr.info('退出登录');
        $timeout(function(){
          window.location.href = '/#/login';
        }, 500)
      }else{
        toastr.info(res.message);
      }

    }, function(error){
      console.log(error)
    })
  }

  function logup(obj){
    if($scope.updateForm.$valid){
      mainSrv.logup(obj).then(function(data){
        if(data.success){
          toastr.success('请重新登录','密码修改成功');
          $timeout(function(){
            mainVm.pwdIsError = false;
            window.location.href = '/#/login';
          }, 2000);
        }else{
          mainVm.pwdIsError = true;
        }
      }, function(error){
        console.log(error)
      })
    }else{
      $scope.updateForm.submitted = true;
    }
  }

  function switchNavItem(index){

    mainVm.currentNav = mainVm.asideArr[index];
    for(var i=0;i<mainVm.asideArr.length;i++){
      if(index == i){
        mainVm.currentNav.isActive = !mainVm.currentNav.isActive;
      }else{
        mainVm.asideArr[i].isActive = false;
      }
    }
    if(sessionStorage.filterList){
      sessionStorage.removeItem('filterList');
    }
    if(!mainVm.currentNav.item){
      cfpLoadingBar.start();
      $timeout(function(){
        $state.go(mainVm.currentNav.sref, {id: mainVm.currentNav.pageNo});
        cfpLoadingBar.complete();
      }, 1000)
    }else{
      for(var j=0; j<pathNav.length; j++){
        if($location.path() == pathNav[j].path){
          mainVm.currentNav.b_title = pathNav[j].b_title;
          mainVm.currentNav.itemName = pathNav[j].itemName;
        }
      }
    }
  }

  function switchItem(item){
    if(item.pageNo){
      $state.go(item.sref, {id: item.pageNo});
    }else{
      $state.go(item.sref);
    }
    if(sessionStorage.filterList){
      sessionStorage.removeItem('filterList');
    }
    mainVm.currentNav.itemName = item.itemName;
    mainVm.currentNav.b_title = item.b_title;
  }

  $rootScope.$on('$stateChangeStart', function(){
    cfpLoadingBar.start();
    $timeout(function(){
      cfpLoadingBar.complete();
    }, 1000)
  });

  $rootScope.$on("tokenExpired", function(){
    window.location.href = '/#/login';
    //toastr.info('登录信息失效, 请重新登录');
  });

  //$locationChangeSuccess: 监听路由变化事件
  $scope.$on("$locationChangeSuccess", function () {
    checkUrl();
  });

}