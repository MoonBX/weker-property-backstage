/**
 * Created by zhongyuqiang on 2017/7/27.
 */
angular.module('homeMdl', [])
  .controller('homeCtl', homeCtl);

function homeCtl(homeSrv, $rootScope, $modal, toastr, $state, propertySrv) {
  var vm = this;
  vm.alarmInfoList = []; //异常设备信息列表
  vm.statisticsList = {}; //小区数据信息统计
  vm.estateName = localStorage.wekerEstateName;
  vm.userName = localStorage.wekerUsername;
  vm.addUserSkip = addUserSkip;

  function addUserSkip(sref, from) {
    if (from == 'home') {
      $state.go(sref, {id: 1, home: true});
    } else {
      $state.go(sref, {id: 1});
    }
  }

  vm.openModal = openModal;

  function openModal(template, controller, item) {
    $modal.open({
      templateUrl: './views/property/' + template + '.html',
      controller: controller,
      backdrop:'static',
      size: 'sm',
      resolve: {
        items: function () {
          if (item) {
            return item;
          }
        }
      }
    })
  }

  homeSrv.getAlarmInfo().then(function (res) {
    console.log('小区异常设备列表: ', res);
    for (var i = 0; i < res.data.length; i++) {
      switch (res.data[i].type) {
        case 0:
          res.data[i].type = '不在线';
          break;
        case 1:
          res.data[i].type = '防拆警报';
          break;
        default:
          res.data[i].type = '';
      }
    }
    vm.alarmInfoList = res.data;
  });

  getComplaintList();
  function getComplaintList() {
    var obj = {};
    obj.status = 0;
    propertySrv.getComplaint(1, 7, obj).then(function (res) {
      console.log('获取投诉列表: ', res);
      vm.pages = [];
      if (res.success) {
        if (res.data.list) {
          for (var i = 0; i < res.data.list.length; i++) {
            switch (res.data.list[i].type) {
              case 0:
                res.data.list[i].type_cn = '投诉';
                break;
              case 1:
                res.data.list[i].type_cn = '报修';
                break;
              default:
                res.data.list[i].type_cn = '';
            }
          }
          vm.complainList = res.data.list;
        }
      } else if (res.code == "401") {
        $rootScope.$broadcast('tokenExpired');
      } else {
        toastr.info(res.message);
      }
    })
  }

  homeSrv.getStatistics().then(function (res) {
    console.log('小区数据信息统计: ', res);
    if (res.success) {
      vm.statisticsList = res.data;
    } else if (res.code == "401") {
      $rootScope.$broadcast('tokenExpired');
    } else {
      toastr.info(res.message);
    }
  })

  $rootScope.$on('refresh-complain-repair', function($event){
    getComplaintList();
  })

}