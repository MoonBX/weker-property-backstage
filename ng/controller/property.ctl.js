/**
 * Created by zhongyuqiang on 2017/7/28.
 */
angular.module('propertyMdl', [])
  .controller('propertyCtl', propertyCtl)
  .controller('announceCtl', announceCtl)
  .controller('announceCrudCtl', announceCrudCtl)
  .controller('announceDetailCtl', announceDetailCtl)
  .controller('complainCtl', complainCtl)
  .controller('detailComplainCtl', detailComplainCtl)
  .controller('repairCtl', repairCtl)
  .controller('detailRepairCtl', detailRepairCtl)
  .controller('payRepairCtl', payRepairCtl)
  .controller('announceAlarm', announceAlarm);

function propertyCtl($modal, propertySrv) {
  var vm = this;
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

}

//二级
function announceCtl($rootScope, $location, $state, $stateParams, $modal, propertySrv, mainSrv, toastr) {
  var vm = this;
  vm.getAnnounce = getAnnounce;
  vm.selectPage = selectPage;

  vm.announceList = [];
  vm.selectList = {};
  vm.pageNo = parseInt($location.search().id);

  if ($stateParams.home) {
    $location.search('home', null);
    openModal('modal-announce-crud', 'announceCrudCtl as crudVm');
  }

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

  checkFilter();
  function checkFilter() {
    if (!sessionStorage.filterList) {
      getAnnounce(vm.pageNo);
    } else {
      var obj = JSON.parse(sessionStorage.filterList);
      vm.selectList = obj;
      console.log(vm.selectList);
      getAnnounce(vm.pageNo, vm.selectList);
      $location.search('id', vm.pageNo);
    }
  }

  vm.getSearch = getSearch;
  vm.clearSession = clearSession;
  function clearSession() {
    sessionStorage.removeItem('filterList');
    vm.selectList = {};
    getAnnounce(1);
    $location.search('id', 1);
  }

  function getSearch(obj, cb) {
    if (obj.et) {
      if (obj.st == obj.et) {
        obj.st = obj.et + 24 * 60 * 60 * 1000 - 1;
      }
    }
    mainSrv.getSearch(obj, cb);
    $location.search('id', 1);
  }

  function selectPage(tag, pageNo) {
    if (tag == 'next') {
      $state.go('property.announce', {id: vm.pageNo + 1});
    } else if (tag == 'prev') {
      $state.go('property.announce', {id: vm.pageNo - 1});
    } else {
      $state.go('property.announce', {id: pageNo});
    }
  }

  function getAnnounce(pageNo, obj) {
    propertySrv.getAnnounce(pageNo, 7, obj).then(function (res) {
      console.log('获取公告列表: ', res);
      vm.pages = [];
      if (res.success) {
        if (res.data.list) {
          for (var i = 0; i < res.data.list.length; i++) {
            switch (res.data.list[i].status) {
              case 0:
                res.data.list[i].status = '撤销';
                break;
              case 1:
                res.data.list[i].status = '发布';
                break;
              case 2:
                res.data.list[i].status = '已过期';
                break;
              case 3:
                res.data.list[i].status = '未生效';
                break;
              default:
                res.data.list[i].status = '';
            }
            res.data.list[i].prop = 'announce'
          }

          vm.announceList = res.data.list;
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
      } else if (res.code == "401") {
        $rootScope.$broadcast('tokenExpired');
        //toastr.info('登录信息失效, 请重新登录');
      } else {
        toastr.info(res.message);
      }
    });
  }

  $rootScope.$on('refresh-announce', function ($event, option) {
    if(option == 'create'){
      clearSession();
    }else{
      getAnnounce(parseInt($location.search().id), vm.selectList);
    }
  })

}
function complainCtl($scope, $rootScope, $location, $state, propertySrv, mainSrv) {
  var vm = this;
  vm.getComplaintList = getComplaintList;
  vm.selectPage = selectPage;
  vm.getSearch = getSearch;
  vm.clearSession = clearSession;

  vm.selectList = {};
  vm.complainList = [];
  vm.pageNo = parseInt($location.search().id);

  checkFilter();
  function checkFilter() {
    if (!sessionStorage.filterList) {
      getComplaintList(vm.pageNo, {type: 0});
    } else {
      var obj = JSON.parse(sessionStorage.filterList);
      vm.selectList = obj;
      getComplaintList(vm.pageNo, vm.selectList);
      $location.search('id', vm.pageNo);
    }
  }


  function clearSession() {
    sessionStorage.removeItem('filterList');
    vm.selectList = {};
    getComplaintList(1, {type: 0});
    $location.search('id', 1);
  }

  function getSearch(obj, cb) {
    if (obj.endTime) {
      if (obj.startTime == obj.endTime) {
        obj.endTime = obj.endTime + 24 * 60 * 60 * 1000 - 1;
      }
    }
    obj.type = 0;
    mainSrv.getSearch(obj, cb);
    $location.search('id', 1);
  }

  function selectPage(tag, pageNo) {
    if (tag == 'next') {
      $state.go('property.complain', {id: vm.pageNo + 1});
    } else if (tag == 'prev') {
      $state.go('property.complain', {id: vm.pageNo - 1});
    } else {
      $state.go('property.complain', {id: pageNo});
    }
  }

  function getComplaintList(pageNo, obj) {
    propertySrv.getComplaint(pageNo, 7, obj).then(function (res) {
      console.log('获取投诉列表: ', res);
      vm.pages = [];
      if (res.success) {
        if (res.data.list) {
          for (var i = 0; i < res.data.list.length; i++) {
            switch (res.data.list[i].status) {
              case 0:
                res.data.list[i].status = '未处理';
                break;
              case 1:
                res.data.list[i].status = '处理中';
                break;
              case 2:
                res.data.list[i].status = '已处理';
                break;
              default:
                res.data.list[i].status = '';
            }
            res.data.list[i].prop = 'complain';
          }
          vm.complainList = res.data.list;
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
      } else if (res.code == "401") {
        $rootScope.$broadcast('tokenExpired');
        //toastr.info('登录信息失效, 请重新登录');
      } else {
        toastr.info(res.message);
      }
    })
  }

  $scope.$on('refresh-complain', function ($event, data) {
    getComplaintList($location.search().id, {type: 0})
  });
}
function repairCtl($scope, $rootScope, $location, $state, propertySrv, mainSrv) {
  var vm = this;
  vm.getRepairList = getRepairList;
  vm.selectPage = selectPage;
  vm.getSearch = getSearch;
  vm.clearSession = clearSession;

  vm.selectList = {};
  vm.repairList = [];
  vm.pageNo = parseInt($location.search().id);

  checkFilter();
  function checkFilter() {
    if (!sessionStorage.filterList) {
      getRepairList(vm.pageNo, {type: 1});
    } else {
      var obj = JSON.parse(sessionStorage.filterList);
      vm.selectList = obj;
      getRepairList(vm.pageNo, vm.selectList);
      $location.search('id', vm.pageNo);
    }
  }

  function clearSession() {
    sessionStorage.removeItem('filterList');
    vm.selectList = {};
    getRepairList(1, {type: 1});
    $location.search('id', 1);
  }

  function getSearch(obj, cb) {
    if (obj.et) {
      if (obj.st == obj.et) {
        obj.et = obj.et + 24 * 60 * 60 * 1000 - 1;
      }
    }
    obj.type = 1;
    mainSrv.getSearch(obj, cb);
    $location.search('id', 1);
  }

  function selectPage(tag, pageNo) {
    if (tag == 'next') {
      $state.go('property.repair', {id: vm.pageNo + 1});
    } else if (tag == 'prev') {
      $state.go('property.repair', {id: vm.pageNo - 1});
    } else {
      $state.go('property.repair', {id: pageNo});
    }
  }

  function getRepairList(pageNo, obj) {
    propertySrv.getComplaint(pageNo, 7, obj).then(function (res) {
      vm.pages = [];
      if (res.success) {
        if (res.data.list) {
          for (var i = 0; i < res.data.list.length; i++) {
            switch (res.data.list[i].status) {
              case 0:
                res.data.list[i].status = '未处理';
                break;
              case 1:
                res.data.list[i].status = '处理中';
                break;
              case 2:
                res.data.list[i].status = '已处理';
                break;
              default:
                res.data.list[i].status = '';
            }
            res.data.list[i].prop = 'repair';
          }
          vm.repairList = res.data.list;
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
      } else if (res.code == "401") {
        $rootScope.$broadcast('tokenExpired');
      } else {
        toastr.info(res.message);
      }
    })
  }

  $scope.$on('refresh-repair', function ($event, data) {
    getRepairList($location.search().id, {type: 1})
  });
}

//三级
function announceCrudCtl($rootScope, $scope, $timeout, $modalInstance, propertySrv, ivhTreeviewBfs, ivhTreeviewMgr, items, toastr) {
  var vm = this;
  vm.createAnnounce = createAnnounce; //创建公告
  vm.editAnnounceSave = editAnnounceSave; //编辑公告
  vm.getTreeNode = getTreeNode;
  vm.editAnnounce = editAnnounce;

  vm.stuff = [];
  vm.model = {};
  vm.count = false;
  $scope.announceForm = {};
  $scope.announceForm.submitted = false;

  if (items) {
    editAnnounce(items);
    vm.title = '编辑公告';
  } else {
    getDeviceDetail();
    vm.title = '创建公告'
  }

  function getDeviceDetail() {
    var originArr = [];
    console.log('2');
    propertySrv.getDeviceDetail().then(function (res) {
      console.log('获取围墙机和单元机信息', res.data.partition);
      originArr = res.data.partition;
      for (var i = 0; i < originArr.length; i++) {
        originArr[i].children = originArr[i].blockDevices.concat(originArr[i].fenceLocations);
        for (var j = 0; j < originArr[i].children.length; j++) {
          if (originArr[i].children[j].units) {
            originArr[i].children[j].children = originArr[i].children[j].units;
            delete originArr[i].children[j].units;
          }
        }
        delete originArr[i].blockDevices;
        delete originArr[i].fenceLocations;
      }
      console.log(originArr);
      vm.stuff = originArr;
    });
  }


  function checkTreeEmpty() {
    var count = 0;
    ivhTreeviewBfs(vm.stuff, function (node) {
      if (node.selected) {
        count++
      }
    });
    if (count > 0) {
      return true;
    } else {
      return false;
    }
  }

  vm.awesomeCallback = awesomeCallback;
  function awesomeCallback() {
    $scope.announceForm.submitted = false;
    vm.count = checkTreeEmpty();
  }

  function createAnnounce(obj) {
    vm.count = checkTreeEmpty();
    console.log(vm.count)
    if ($scope.announceForm.$valid && vm.count > 0) {
      var a = getTreeNode();
      obj.fenceIds = a.fenceIds;
      obj.unitIds = a.unitIds;
      if (obj.st == obj.et) {
        obj.et = obj.et + 24 * 60 * 60 * 1000 - 1000;
      }
      console.log('create announce obj: ', obj);
      propertySrv.createAnnounce(obj).then(function (res) {
        console.log('创建公告成功: ', res);
        if (res.success) {
          toastr.info('创建公告成功');
          $timeout(function () {
            $rootScope.$broadcast('refresh-announce', 'create');
            cancel();
          }, 500)
        } else {
          toastr.info(res.message);
        }
      })
    } else {
      console.log('invalid form');
      $scope.announceForm.submitted = true;
    }

  }

  function editAnnounce(id) {
    var fenceIdsArr = [];
    var unitIdsArr = [];
    var arr = [];
    var originArr = [];
    propertySrv.getDeviceDetail().then(function (res) {
      console.log('获取围墙机和单元机信息', res.data.partition);
      originArr = res.data.partition;
      for (var i = 0; i < originArr.length; i++) {
        originArr[i].children = originArr[i].blockDevices.concat(originArr[i].fenceLocations);
        for (var j = 0; j < originArr[i].children.length; j++) {
          if (originArr[i].children[j].units) {
            originArr[i].children[j].children = originArr[i].children[j].units;
            delete originArr[i].children[j].units;
          }
        }
        delete originArr[i].blockDevices;
        delete originArr[i].fenceLocations;
      }
      console.log(originArr);
      vm.stuff = originArr;
    }).then(function () {
      propertySrv.editAnnounce(id).then(function (res) {
        console.log('获取单条公告: ', res);
        vm.model = res.data;
        fenceIdsArr = vm.model.fenceIds.split(',');
        unitIdsArr = vm.model.unitIds.split(',');
        arr = fenceIdsArr.concat(unitIdsArr);
        console.log(arr);
        ivhTreeviewBfs(vm.stuff, function (node) {
          console.log(typeof parseInt('1'));
          for (var i = 0; i < arr.length; i++) {
            if (node.id == parseInt(arr[i])) {
              ivhTreeviewMgr.select(vm.stuff, node);
            }
          }
        })
      })
    });

  }

  function editAnnounceSave(obj) {
    vm.count = checkTreeEmpty();
    if ($scope.announceForm.$valid && vm.count > 0) {
      var a = getTreeNode();
      obj.fenceIds = a.fenceIds;
      obj.unitIds = a.unitIds;
      obj.id = items;
      delete obj.status;
      delete obj.partitions;
      if (obj.effectiveStartTime == obj.effectiveEndTime) {
        obj.effectiveEndTime = obj.effectiveEndTime + 24 * 60 * 60 * 1000 - 1;
      }
      console.log('edit announce obj: ', obj);
      propertySrv.editAnnounceSave(obj).then(function (res) {
        console.log('编辑公告成功', res);
        if (res.success) {
          toastr.info('编辑公告成功');
          $timeout(function () {
            $rootScope.$broadcast('refresh-announce');
            cancel();
          }, 500)
        } else {
          toastr.info(res.message);
        }
      })
    } else {
      console.log('invalid form')
      $scope.announceForm.submitted = true;
    }
  }

  function getDeviceDetail() {
    var originArr = [];
    propertySrv.getDeviceDetail().then(function (res) {
      console.log('获取围墙机和单元机信息', res.data.partition);
      originArr = res.data.partition;
      for (var i = 0; i < originArr.length; i++) {
        originArr[i].children = originArr[i].blockDevices.concat(originArr[i].fenceLocations);
        for (var j = 0; j < originArr[i].children.length; j++) {
          if (originArr[i].children[j].units) {
            originArr[i].children[j].children = originArr[i].children[j].units;
            delete originArr[i].children[j].units;
          }
        }
        delete originArr[i].blockDevices;
        delete originArr[i].fenceLocations;
      }
      console.log(originArr);
      vm.stuff = originArr;
    });
  }

  function getTreeNode() {
    var fenceIdsArr = [], fenceIds = '';
    var unitIdsArr = [], unitIds = '';
    ivhTreeviewBfs(vm.stuff, function (node) {
      if (node.selected) {
        if (node.type == 2) {
          unitIdsArr.push(node.id)
        }
        if (node.type == 0) {
          fenceIdsArr.push(node.id);
        }
      }
    });
    fenceIds = fenceIdsArr.join(',');
    unitIds = unitIdsArr.join(',');
    return {
      fenceIds: fenceIds,
      unitIds: unitIds
    };
  }

  vm.cancel = cancel;
  function cancel() {
    $modalInstance.dismiss('cancel');
  }

}
function announceDetailCtl(propertySrv, items, $modalInstance) {
  var vm = this;
  vm.getAnnounceDetail = getAnnounceDetail;
  vm.cancel = cancel;

  vm.detailList = {};
  vm.id = items;

  getAnnounceDetail(vm.id);

  function cancel() {
    $modalInstance.dismiss('cancel');
  }

  function getAnnounceDetail(id) {
    propertySrv.getAnnounceDetail(id).then(function (res) {
      console.log('公告详情: ', res)
      switch (res.data.status) {
        case 0:
          res.data.status = '撤销';
          break;
        case 1:
          res.data.status = '发布';
          break;
        case 2:
          res.data.status = '已过期';
          break;
        case 3:
          res.data.status = '未生效';
          break;
        default:
          res.data.status = '';
      }
      vm.detailList = res.data;
    })
  }


}
function detailComplainCtl(propertySrv, $modalInstance, items) {
  var vm = this;
  vm.getComplaintDetail = getComplaintDetail;
  vm.cancel = cancel;

  function cancel() {
    $modalInstance.dismiss('cancel');
  }

  if (items) {
    console.log('投诉详情: ', items);
    vm.model = items;
    vm.model.snapshotArr = vm.model.snapshot.split(';');
  }

  function getComplaintDetail() {
    propertySrv.getComplaintDetail(id).then(function (res) {
      console.log('投诉详情: ', res)
    })
  }
}
function detailRepairCtl(propertySrv, $modalInstance, items) {
  var vm = this;
  vm.getRepairDetail = getRepairDetail;
  vm.cancel = cancel;

  function cancel() {
    $modalInstance.dismiss('cancel');
  }

  if (items) {
    console.log('投诉详情: ', items);
    vm.model = items;
    vm.model.snapshotArr = vm.model.snapshot.split(';');
  }

  function getRepairDetail() {
    propertySrv.getComplaintDetail(id).then(function (res) {
      console.log('报修详情: ', res)
    })
  }

}
function payRepairCtl($scope, $modalInstance, propertySrv, toastr) {
  var vm = this;
  vm.getStandard = getStandard;
  vm.createStandard = createStandard;
  vm.deleteStandard = deleteStandard;
  vm.cancel = cancel;

  vm.standardList = []
  vm.model = {};

  function cancel() {
    $modalInstance.dismiss('cancel');
  }

  getStandard();

  function getStandard() {
    propertySrv.getStandard().then(function (res) {
      console.log('收费标准列表: ', res)
      vm.standardList = res.data;
    })
  }

  function createStandard(obj) {
    console.log('收费标准对象: ', obj);
    if ($scope.payListForm.$valid) {
      propertySrv.createStandard(obj).then(function (res) {
        console.log('创建收费标准: ', res);
        if (res.success) {
          vm.model = {};
          $scope.$broadcast('refresh-standard-list');
          toastr.info('创建成功!')
        } else {
          toastr.info(res.message);
        }
      })
    } else {
      console.log('invalid');
      $scope.payListForm.submitted = true;
    }
  }

  function deleteStandard(id) {
    console.log(id);
    propertySrv.deleteStandard(id).then(function (res) {
      console.log('删除收费标准: ', res);
      if (res.success) {
        $scope.$broadcast('refresh-standard-list');
        toastr.info('删除成功!');
      } else {
        toastr.info(res.message);
      }


    })
  }

  $scope.$on('refresh-standard-list', function ($event, data) {
    getStandard()
  });
}

//alart
function announceAlarm($rootScope, $modalInstance, $timeout, items, propertySrv, toastr) {
  var vm = this;
  vm.model = items;

  if (vm.model.prop == 'announce') {
    vm.deal = deleteAnnounce;
    vm.alert = '确认删除公告?';
  } else if (vm.model.prop == 'repair') {
    vm.deal = dealRepair;
    vm.alert = '确认处理这条维修消息?';
  } else if (vm.model.prop == 'complain') {
    vm.deal = dealComplaint;
    vm.alert = '确认处理这条投诉消息?';
  } else {
    vm.deal = dealComplaintRepair;
    vm.alert = '确认处理这条消息?';

  }

  vm.cancel = cancel;
  function cancel() {
    $modalInstance.dismiss('cancel');
  }

  function deleteAnnounce(id) {
    propertySrv.deleteAnnounce(id).then(function (res) {
      console.log('删除公告: ', res);
      if (res.success) {
        toastr.info('删除公告成功');
        $timeout(function () {
          $rootScope.$broadcast('refresh-announce');
          cancel();
        }, 500)
      } else {
        toastr.info(res.message);
      }
    })
  }

  function dealComplaintRepair(id) {
    var timeStr = new Date().getTime();
    propertySrv.dealComplaint(id, timeStr).then(function (res) {
      toastr.info('处理成功');
      $timeout(function () {
        $rootScope.$broadcast('refresh-complain-repair');
        cancel();
      }, 500);
    })
  }

  function dealComplaint(id) {
    var timeStr = new Date().getTime();
    propertySrv.dealComplaint(id, timeStr).then(function (res) {
      console.log('处理投诉: ', res);
      //if(res.success){
      toastr.info('投诉处理消息成功');
      $timeout(function () {
        $rootScope.$broadcast('refresh-complain');
        cancel();
      }, 500);
      //}else{
      //  toastr.info(res.message);
      //}
    })
  }

  function dealRepair(id) {
    var timeStr = new Date().getTime();
    propertySrv.dealComplaint(id, timeStr).then(function (res) {
      console.log('处理报修: ', res);
      //if(res.success){
      toastr.info('投诉维修消息成功');
      $timeout(function () {
        $rootScope.$broadcast('refresh-repair');
        cancel();
      }, 500);
      //}else{
      //  toastr.info(res.message);
      //}
    })
  }
}