/**
 * Created by zhongyuqiang on 16/11/30.
 */
angular.module('app.router', ['ui.router'])
  .config(config);

function config($stateProvider, $urlRouterProvider, $httpProvider){
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
  if (!$httpProvider.defaults.headers.get) {
    $httpProvider.defaults.headers.get = {};
  }
  $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
  $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';

  $httpProvider.interceptors.push(function($q) {
    return {
      responseError: function(rejection) {
        if(rejection.status <= 0) {
          if(window.navigator.onLine==true){
            window.location.href = '#/login';
            return;
          }else{
            alert("网络已断开");
          }
        }
        return $q.reject(rejection);
      }
    };
  });

  $urlRouterProvider.otherwise('/login');

  $stateProvider
    // 首页
    .state('home', {
      url: "/index?:query",
      templateUrl: "views/home/index.html",
      controller: 'homeCtl',
      controllerAs: 'homeVm'
    })
    .state('login', {
      url: "/login",
      templateUrl: "login.html"
    })
    .state('property', {
      url: "/property",
      templateUrl: "views/property/property.html",
      controller: "propertyCtl",
      controllerAs: "propertyVm"
    })
    .state('property.announce', {
      url: "/announce?:id&:home",
      templateUrl: "views/property/property-announce.html",
      controller: "announceCtl",
      controllerAs: "announceVm"
    })
    .state('property.complain', {
      url: "/complain?:id",
      templateUrl: "views/property/property-complain.html",
      controller: "complainCtl",
      controllerAs: "complainVm"
    })
    .state('property.repair', {
      url: "/repair?:id",
      templateUrl: "views/property/property-repair.html",
      controller: "repairCtl",
      controllerAs: "repairVm"
    })
    .state('device', {
      url: "/device?:id",
      templateUrl: "views/device/device.html",
      controller: "deviceCtl",
      controllerAs: "deviceVm"
    })
    .state('door', {
      url: "/door",
      templateUrl: "views/door/door.html",
      controller: "doorCtl",
      controllerAs: "doorVm"
    })
    .state('door.household', {
      url: "/household?:id&:home",
      templateUrl: "views/door/door-household.html",
      controller: "householdCtl",
      controllerAs: "householdVm"
    })
    .state('door.common', {
      url: "/common?:id&:home",
      templateUrl: "views/door/door-common.html",
      controller: "commonCtl",
      controllerAs: "commonVm"
    })
    .state('log', {
      url: "/log",
      templateUrl: "views/log/log.html",
      controller: "logCtl",
      controllerAs: "logVm"
    })
    .state('log.open', {
      url: "/open?:id",
      templateUrl: "views/log/log-open.html",
      controller: "openCtl",
      controllerAs: "openVm"
    })
    .state('log.remove', {
      url: "/remove?:id",
      templateUrl: "views/log/log-remove.html",
      controller: "removeCtl",
      controllerAs: "removeVm"
    })
    .state('log.visitor', {
      url: "/visitor?:id",
      templateUrl: "views/log/log-visitor.html",
      controller: "visitorCtl",
      controllerAs: "visitorVm"
    })
    .state('analyse', {
      url: "/analyse",
      templateUrl: "views/analyse/analyse.html"
    })
    .state('analyse.zhongdian', {
      url: "/zhongdian?:id",
      templateUrl: "views/analyse/analyse-zhongdian.html"
    })
    .state('analyse.renkou', {
      url: "/renkou?:id",
      templateUrl: "views/analyse/analyse-renkou.html"
    })
    .state('analyse.fangwu', {
      url: "/fangwu?:id",
      templateUrl: "views/analyse/analyse-fangwu.html"
    })
    .state('analyse.yanpan', {
      url: "/yanpan?:id",
      templateUrl: "views/analyse/analyse-yanpan.html"
    })
}