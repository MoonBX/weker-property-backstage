/**
 * Created by zhongyuqiang on 2017/7/31.
 */
angular.module('deviceMdl', [])
  .controller('deviceCtl', deviceCtl)
  .controller('timerDeviceCtl', timerDeviceCtl)
  .controller('detailDeviceCtl', detailDeviceCtl);

function deviceCtl($rootScope, $modal, $location, $state, deviceSrv, mainSrv){
  var vm = this;
  vm.openModal = openModal;
  vm.getDevice = getDevice;
  vm.selectPage = selectPage;
  vm.getSearch = getSearch;
  vm.clearSession = clearSession;
  vm.closeDoor = closeDoor

  vm.selectList = {};
  vm.deviceList = [];
  vm.block = {};
  vm.pageNo = parseInt($location.search().id);

  getPartitions();
  function getPartitions(){
    mainSrv.getPartitions().then(function(res){
      console.log(res);
      vm.block.partitions = res.data;
    })
  }

  vm.getBlocks = getBlocks;
  function getBlocks(id){
    mainSrv.getBlocks(id).then(function(res){
      console.log(res);
      vm.block.blocks = res.data;
    })
  }

  vm.getUnits = getUnits;
  function getUnits(id){
    mainSrv.getUnits(id).then(function(res){
      console.log(res);
      vm.block.units = res.data;
    })
  }

  checkFilter();
  function checkFilter() {
    if (!sessionStorage.filterList) {
      getDevice(vm.pageNo);
    } else {
      var obj = JSON.parse(sessionStorage.filterList);
      vm.selectList = obj;
      getBlocks(obj.partitionId);
      getUnits(obj.blockId);
      getDevice(vm.pageNo, vm.selectList);
      $location.search('id', vm.pageNo);
    }
  }

  function clearSession() {
    sessionStorage.removeItem('filterList');
    vm.selectList = {};
    vm.block.blocks = {};
    vm.block.units = {};
    getDevice(1);
    $location.search('id', 1);
  }

  function getSearch(obj, cb) {
    mainSrv.getSearch(obj, cb);
    $location.search('id', 1);
  }

  function openModal(template, controller, item) {
    $modal.open({
      templateUrl: './views/device/' + template + '.html',
      controller: controller,
      backdrop: 'static',
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

  function selectPage(tag, pageNo) {
    if (tag == 'next') {
      $state.go('device', {id: vm.pageNo + 1});
    } else if (tag == 'prev') {
      $state.go('device', {id: vm.pageNo - 1});
    } else {
      $state.go('device', {id: pageNo});
    }
  }

  function getDevice(pageNo, obj){
    deviceSrv.getDevice(pageNo,7, obj).then(function(res){
      console.log('获取设备列表: ',res);
      vm.pages = [];
      if(res.success){
        if(res.data.list) {
          for (var i = 0; i < res.data.list.length; i++) {
            switch (res.data.list[i].type) {
              case 0:
                res.data.list[i].type = '围墙机';
                break;
              case 1:
                res.data.list[i].type = '单元机';
                break;
              default:
                res.data.list[i].type = '';
            }
            switch (res.data.list[i].status) {
              case 0:
                res.data.list[i].status_cn = '离线';
                break;
              case 1:
                res.data.list[i].status_cn = '在线';
                break;
              default:
                res.data.list[i].status_cn = '';
            }
            switch (res.data.list[i].lockType) {
              case 0:
                res.data.list[i].lockType_cn = '磁力锁';
                break;
              case 1:
                res.data.list[i].lockType_cn = '电控锁';
                break;
              default:
                res.data.list[i].lockType_cn = '';
            }
            switch (res.data.list[i].lockStatus) {
              case 0:
                res.data.list[i].lockStatus_cn = '关门';
                break;
              case 1:
                res.data.list[i].lockStatus_cn = '开门';
                break;
              default:
                res.data.list[i].lockStatus_cn = '';
            }
          }

          vm.deviceList = res.data.list;
          vm.pagesNum = Math.ceil(res.data.total / 7);
          vm.pagesTotal = res.data.total;
          var pagesSplit = 7;

          if (vm.pageNo == 1 && vm.pageNo == vm.pagesNum) {
            vm.isFirstPage = true;
            vm.isLastPage = true;
          } else if (vm.pageNo == 1) {
            vm.isFirstPage = true;
            vm.isLastPage = false;
          } else if (vm.pageNo == vm.pagesNum) {
            vm.isLastPage = true;
            vm.isFirstPage = false;
          }
          mainSrv.pagination(vm.pagesNum, pagesSplit, vm.pages, vm.pageNo);
        }
      }else if(res.code == "401"){
        $rootScope.$broadcast('tokenExpired');
      } else {
        toastr.info(res.message);
      }
    })
  }

  function closeDoor(id, status){
    console.log(id, status)
    deviceSrv.closeDoor(id, status).then(function(res){
      console.log(res);
      $rootScope.$broadcast('refresh-device');
    })
  }

  $rootScope.$on('refresh-device', function($event){
    getDevice(parseInt($location.search().id));
  });
}

function timerDeviceCtl(items){

}

function detailDeviceCtl(items, $modalInstance){
  var vm = this;
  if(items){
    vm.model = items;
  }

  vm.cancel = cancel;
  function cancel() {
    $modalInstance.dismiss('cancel');
  }
}
