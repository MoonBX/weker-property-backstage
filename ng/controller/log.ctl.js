/**
 * Created by zhongyuqiang on 2017/8/1.
 */
angular.module('logMdl', [])
  .controller('logCtl', logCtl)
  .controller('openCtl', openCtl)
  .controller('removeCtl', removeCtl)
  .controller('detailOpenCtl', detailOpenCtl);

function logCtl($modal){
  var vm = this;
  vm.openModal = openModal;

  function openModal(template, controller, item) {
    $modal.open({
      templateUrl: './views/log/' + template + '.html',
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
}

function openCtl($rootScope, $location, $state, logSrv, mainSrv, toastr, $modal){
  var vm = this;
  vm.getOpenList = getOpenList;
  vm.selectPage = selectPage;
  vm.getSearch = getSearch;
  vm.clearSession = clearSession;

  vm.selectList = {};
  vm.intercomList = [];
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
      getOpenList(vm.pageNo);
    } else {
      var obj = JSON.parse(sessionStorage.filterList);
      vm.selectList = obj;
      getBlocks(obj.partitionId);
      getUnits(obj.blockId);
      getOpenList(vm.pageNo, vm.selectList);
      $location.search('id', vm.pageNo);
    }
  }

  function clearSession() {
    sessionStorage.removeItem('filterList');
    vm.selectList = {};
    vm.block.blocks = {};
    vm.block.units = {};
    getOpenList(1);
    $location.search('id', 1);
  }

  function getSearch(obj, cb) {
    if(obj.et){
      if(obj.st == obj.et){
        obj.et = obj.et+24*60*60*1000-1;
      }
    }
    console.log(obj);
    mainSrv.getSearch(obj, cb);
    $location.search('id', 1);
  }

  vm.gallary = gallary;
  function gallary(url) {
    $modal.open({
      templateUrl: './views/log/gallary.html',
      controller: function($scope, items){
        $scope.url = items;
      },
      size: 'sm',
      resolve: {
        items: function () {
          if (url) {
            return url;
          }
        }
      }
    })
  }

  function selectPage(tag, pageNo) {
    if (tag == 'next') {
      $state.go('log.open', {id: vm.pageNo + 1});
    } else if (tag == 'prev') {
      $state.go('log.open', {id: vm.pageNo - 1});
    } else {
      $state.go('log.open', {id: pageNo});
    }
  }

  function getOpenList(pageNo, obj){
    logSrv.getIntercom(pageNo, 7, obj).then(function (res) {
      console.log('获取开门日志列表: ', res);
      vm.pages = [];
      if(res.success){
        if(res.data.list){
          for (var i = 0; i < res.data.list.length; i++) {
            switch (res.data.list[i].type) {
              case 0:
                res.data.list[i].type = '呼叫';
                break;
              case 1:
                res.data.list[i].type = '刷卡';
                break;
              case 2:
                res.data.list[i].type = '密码';
                break;
              case 3:
                res.data.list[i].type = '手机开门';
                break;
              case 4:
                res.data.list[i].type = '人脸开门';
                break;
              case 5:
                res.data.list[i].type = '身份证开门';
                break;
              case 6:
                res.data.list[i].type = '扫码开门';
                break;
              default:
                res.data.list[i].type = '';
            }
            switch (res.data.list[i].cardType) {
              case 0:
                res.data.list[i].cardType = '无';
                break;
              case 1:
                res.data.list[i].cardType = 'IC';
                break;
              case 1:
                res.data.list[i].cardType = 'ID';
                break;
              default:
                res.data.list[i].cardType = '';
            }
            switch (res.data.list[i].deviceType) {
              case 0:
                res.data.list[i].deviceType = '围墙机';
                break;
              case 1:
                res.data.list[i].deviceType = '单元机';
                break;
              default:
                res.data.list[i].deviceType = '';
            }
          }
          vm.intercomList = res.data.list;
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
}

function removeCtl($rootScope, $location, $state, logSrv, mainSrv){
  var vm = this;
  vm.getRemoveList = getRemoveList;
  vm.selectPage = selectPage;
  vm.getSearch = getSearch;
  vm.clearSession = clearSession;

  vm.selectList = {};
  vm.removeList = [];
  vm.pageNo = parseInt($location.search().id);

  checkFilter();
  function checkFilter() {
    if (!sessionStorage.filterList) {
      getRemoveList(vm.pageNo);
    } else {
      var obj = JSON.parse(sessionStorage.filterList);
      vm.selectList = obj;
      getRemoveList(vm.pageNo, vm.selectList);
      $location.search('id', vm.pageNo);
    }
  }

  function clearSession() {
    sessionStorage.removeItem('filterList');
    vm.selectList = {};
    getRemoveList(1);
    $location.search('id', 1);
  }

  function getSearch(obj, cb) {
    mainSrv.getSearch(obj, cb);
    $location.search('id', 1);
  }

  function selectPage(tag, pageNo) {
    if (tag == 'next') {
      $state.go('log.remove', {id: vm.pageNo + 1});
    } else if (tag == 'prev') {
      $state.go('log.remove', {id: vm.pageNo - 1});
    } else {
      $state.go('log.remove', {id: pageNo});
    }
  }

  function getRemoveList(pageNo, obj){
    logSrv.getAlarmInfo(pageNo, 7, obj).then(function (res) {
      console.log('获取公卡列表: ', res);
      vm.pages = [];
      if(res.success){
        if(res.data.list){
          for (var i = 0; i < res.data.list.length; i++) {
            switch (res.data.list[i].type) {
              case 0:
                res.data.list[i].type = '呼叫';
                break;
              case 1:
                res.data.list[i].type = '刷卡';
                break;
              case 2:
                res.data.list[i].type = '密码';
                break;
              case 3:
                res.data.list[i].type = 'APP';
                break;
              default:
                res.data.list[i].type = '';
            }
          }
          vm.removeList = res.data.list;
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
}

function detailOpenCtl(items, $modalInstance){
  var vm = this;
  vm.model = items;
  console.log(items);

  vm.cancel = cancel;
  function cancel() {
    $modalInstance.dismiss('cancel');
  }
}