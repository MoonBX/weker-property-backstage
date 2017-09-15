/**
 * Created by zhongyuqiang on 2017/8/1.
 */
angular.module('doorMdl', [])
  .controller('doorCtl', doorCtl)
  .controller('householdCtl', householdCtl)
  .controller('commonCtl', commonCtl)
  .controller('detailHouseholdCtl', detailHouseholdCtl)
  .controller('createHouseholdCtl', createHouseholdCtl)
  .controller('editHouseholdCtl', editHouseholdCtl)
  .controller('importHouseholdCtl', importHouseholdCtl)
  .controller('crudCommonCtl', crudCommonCtl)
  .controller('detailCommonCtl', detailCommonCtl)
  .controller('AsideCtrl', AsideCtrl)
  .controller('doorAlarm', doorAlarm);

function doorCtl($modal) {
  var vm = this;
  vm.openModal = openModal;

  function openModal(template, controller, item) {
    $modal.open({
      templateUrl: './views/door/' + template + '.html',
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

function householdCtl($rootScope, $aside, $scope, $location, $state, $modal, $stateParams, doorSrv, mainSrv, toastr) {
  var vm = this;
  vm.getResidentList = getResidentList;
  vm.selectPage = selectPage;
  vm.getSearch = getSearch;
  vm.clearSession = clearSession;

  if($stateParams.home){
    $location.search('home',null);
    openModal('modal-household-create', 'createHouseholdCtl as createVm');
  }

  function openModal(template, controller, item) {
    $modal.open({
      templateUrl: './views/door/' + template + '.html',
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

  vm.selectList = {};
  vm.residentList = [];
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

  vm.getRooms = getRooms;
  function getRooms(id){
    mainSrv.getRooms(id).then(function(res){
      console.log(res);
      vm.block.rooms = res.data;
    })
  }

  vm.openAside = openAside;
  function openAside(){
    console.log('open');
    $aside.open({
      templateUrl: 'views/door/aside.demo.tpl.html',
      backdrop: 'static',
      placement: 'right',
      controller: 'createHouseholdCtl as createVm'
    });
  }

  checkFilter();
  function checkFilter() {
    if (!sessionStorage.filterList) {
      getResidentList(vm.pageNo);
    } else {
      var obj = JSON.parse(sessionStorage.filterList);
      vm.selectList = obj;
      getBlocks(obj.partitionId);
      getUnits(obj.blockId);
      getRooms(obj.unitId);
      getResidentList(vm.pageNo, vm.selectList);
      $location.search('id', vm.pageNo);
    }
  }

  function clearSession() {
    sessionStorage.removeItem('filterList');
    vm.selectList = {};
    vm.block.blocks = {};
    vm.block.units = {};
    vm.block.rooms = {};
    getResidentList(1);
    $location.search('id', 1);
  }

  function getSearch(obj, cb) {
    mainSrv.getSearch(obj, cb);
    $location.search('id', 1);
  }

  function selectPage(tag, pageNo) {
    if (tag == 'next') {
      $state.go('door.household', {id: vm.pageNo + 1});
    } else if (tag == 'prev') {
      $state.go('door.household', {id: vm.pageNo - 1});
    } else {
      $state.go('door.household', {id: pageNo});
    }
  }

  function getResidentList(pageNo, obj) {
    doorSrv.getResident(pageNo, 7, obj).then(function (res) {
      console.log('获取住户列表: ', res);
      vm.pages = [];
      if(res.success){
        if (res.data.list) {
          for (var i = 0; i < res.data.list.length; i++) {
            switch (res.data.list[i].status) {
              case 0:
                res.data.list[i].status_cn = '正常';
                break;
              case 1:
                res.data.list[i].status_cn = '已过期';
                break;
              default:
                res.data.list[i].status_cn = '';
            }
            switch (res.data.list[i].userType) {
              case 0:
                res.data.list[i].userType_cn = '户主';
                break;
              case 1:
                res.data.list[i].userType_cn = '家人';
                break;
              case 2:
                res.data.list[i].userType_cn = '租客';
                break;
              default:
                res.data.list[i].userType_cn = '';
            }
            res.data.list[i].prop = 'household';
          }
          vm.residentList = res.data.list;
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

  $rootScope.$on('refresh-resident', function ($event, option) {
    if(option == 'create'){
      clearSession();
    }else{
      getResidentList(parseInt($location.search().id), vm.selectList);
    }
  });
}

function AsideCtrl($scope, $modalInstance){
  console.log('a');
}

function commonCtl($rootScope, $location, $state, $stateParams, $modal, doorSrv, mainSrv) {
  var vm = this;
  vm.getCommonList = getCommonList;
  vm.selectPage = selectPage;
  vm.getSearch = getSearch;
  vm.clearSession = clearSession;

  vm.selectList = {};
  vm.commonList = [];
  vm.pageNo = parseInt($location.search().id);

  if($stateParams.home){
    $location.search('home',null);
    openModal('modal-common-crud', 'crudCommonCtl as crudVm');
  }

  function openModal(template, controller, item) {
    $modal.open({
      templateUrl: './views/door/' + template + '.html',
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
      getCommonList(vm.pageNo);
    } else {
      var obj = JSON.parse(sessionStorage.filterList);
      vm.selectList = obj;
      getCommonList(vm.pageNo, vm.selectList);
      $location.search('id', vm.pageNo);
    }
  }

  function clearSession() {
    sessionStorage.removeItem('filterList');
    vm.selectList = {};
    getCommonList(1);
    $location.search('id', 1);
  }

  function getSearch(obj, cb) {
    mainSrv.getSearch(obj, cb);
    $location.search('id', 1);
  }

  function selectPage(tag, pageNo) {
    if (tag == 'next') {
      $state.go('door.common', {id: vm.pageNo + 1});
    } else if (tag == 'prev') {
      $state.go('door.common', {id: vm.pageNo - 1});
    } else {
      $state.go('door.common', {id: pageNo});
    }
  }

  function getCommonList(pageNo, obj) {
    doorSrv.getPublicCard(pageNo, 7, obj).then(function (res) {
      console.log('获取公卡列表: ', res);
      vm.pages = [];
      if(res.success){
        if (res.data.list) {
          for (var i = 0; i < res.data.list.length; i++) {
            switch (res.data.list[i].vaildType) {
              case 0:
                res.data.list[i].vaildType = '月卡';
                break;
              case 1:
                res.data.list[i].vaildType = '季卡';
                break;
              case 2:
                res.data.list[i].vaildType = '年卡';
                break;
              default:
                res.data.list[i].vaildType = '';
            }
            switch (res.data.list[i].status) {
              case 0:
                res.data.list[i].status = '正常';
                break;
              case 1:
                res.data.list[i].status = '过期';
                break;
              default:
                res.data.list[i].status = '';
            }
            switch (res.data.list[i].userStatus) {
              case 0:
                res.data.list[i].userStatus = '物业人员';
                break;
              case 1:
                res.data.list[i].userStatus = '外部人员';
                break;
              default:
                res.data.list[i].userStatus = '';
            }
            switch (res.data.list[i].cardType) {
              case 1:
                res.data.list[i].cardType = 'IC';
                break;
              case 2:
                res.data.list[i].cardType = 'ID';
                break;
              default:
                res.data.list[i].cardType = '';
            }
            res.data.list[i].prop = 'common';
          }
          vm.commonList = res.data.list;
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

  $rootScope.$on('refresh-common', function ($event, option) {
    if(option == 'create'){
      clearSession();
    }else{
      getCommonList(parseInt($location.search().id), vm.selectList);
    }
  });
}

function detailHouseholdCtl(items, $modalInstance) {
  var vm = this;
  console.log(items);
  if (items) {
    if (items.cardTypeName) {
      var a = items.cardTypeName.split(' ');
      a.pop();
      items.cardTypeNameArr = listTemp(a);
    }
    vm.model = items;
  }

  vm.cancel = cancel;
  function cancel() {
    $modalInstance.dismiss('cancel');
  }

//列表分组
  function listTemp(oldList) {
    var list = oldList;
    var arrTemp = [];
    var index = 0;
    var sectionCount = 2;
    for (var i = 0; i < list.length; i++) {
      index = parseInt(i / sectionCount);
      if (arrTemp.length <= index) {
        arrTemp.push([]);
      }
      arrTemp[index].push(list[i]);
    }
    console.log(arrTemp);
    return arrTemp;
  }
}

function createHouseholdCtl($rootScope, $scope, $modalInstance, $timeout, doorSrv, mainSrv, toastr) {
  var vm = this;
  vm.postList = {};
  vm.block = {};

  vm.createResident = createResident;
  vm.cancel = cancel;

  vm.getBlocks = getBlocks;
  vm.getUnits = getUnits;
  vm.getRooms = getRooms;
  vm.checkEntranceExist = checkEntranceExist;

  //vm.userType_make_me = false;

  vm.title = '添加住户';
  getPartition();

  function transform(obj) {
    var arr = [];
    for (var item in obj) {
      arr.push(obj[item]);
    }
    return arr;
  }

  vm.postList.userType = 0;
  vm.userType_make_me = true;
  vm.postList.effectiveType = 0;
  vm.userEffectStatus = 0;

  vm.userType_change_to_effectiveTime = userType_change_to_effectiveTime;
  function userType_change_to_effectiveTime(value) {
    if (value == 0) {
      vm.userEffectStatus = 0;
    } else if (value == 1) {
      vm.userEffectStatus = 1;
    } else {
      vm.userEffectStatus = 2;
    }
    if (value == 0) {
      vm.userType_make_me = true;
      vm.postList.effectiveType = 0;
    } else {
      vm.userType_make_me = false;
      vm.postList.effectiveType = 1;
    }
  }

  vm.compareIdident = compareIdident;
  function compareIdident(){
    console.log('ain');

  }

  vm.radio_change = radio_change;
  function radio_change() {
    if (vm.postList.effectiveType == 0) {
      vm.userType_make_me = true;
    } else {
      vm.userType_make_me = false;
    }
  }

  function groupArray(data, cols) {
    var list = [];
    var current = [];

    // for (t of data) {
    data.forEach(function (t) {
      current.push(t);
      if (current.length === cols) {
        list.push(current);
        current = [];
      }
    });
    // }    // for (t of data)

    if (current.length) {
      list.push(current);
    }
    return list;
  }

  function getPartition() {
    mainSrv.getPartitions().then(function (res) {
      vm.block.partitions = res.data;
    })
  }

  function getBlocks(id) {
    vm.block.units = [];
    if (id) {
      mainSrv.getBlocks(id).then(function (data) {
        vm.block.blocks = data.data;
      }, function (err) {
        console.log(err);
      })
    }
  }

  function getUnits(id) {
    vm.block.rooms = [];
    if (id) {
      mainSrv.getUnits(id).then(function (data) {
        vm.block.units = data.data;
      }, function (err) {
        console.log(err);
      })
    }
  }

  function getRooms(id) {
    if (id) {
      mainSrv.getRooms(id).then(function (data) {
        vm.block.rooms = data.data;
      }, function (err) {
        console.log(err);
      }).then(function(){

      })
    }
  }

  vm.idCardCheck = 0;
  vm.getCardInfo = getCardInfo;
  function getCardInfo(cardNo){
    if(cardNo&&cardNo.length == 18){
      doorSrv.getIdCardInfo(cardNo).then(function(res){
        console.log(res);
        if(res.success){
          vm.idCardList = res.data;
          //if(cardNo == vm.idCardList.identityNum){
            vm.idCardCheck = 1;
          //}else{
          //  toastr.info('匹配身份证失败');
          //  vm.idCardCheck = 2;
          //}
        }else{
          toastr.info('匹配身份证失败');
          vm.idCardCheck = 2;
        }

      })
    }else{
      toastr.info('请输入正确的身份证号码');
      vm.idCardCheck = 0;
    }
  }


  vm.isEntranceExist = false;
  function checkEntranceExist(partitionId){
    console.log(vm.postList.unitId);
    doorSrv.checkExist(partitionId, vm.postList.unitId).then(function(res){
      console.log(res);
      if(res.success){
        vm.isEntranceExist = res.data;
      }
    })
  }

  vm.back = back;
  function back(){
    vm.householdStep = 1;
  }

  vm.householdStep = 1;
  function createResident(obj) {
    console.log(obj);
    if ($scope.houseForm.$valid&&vm.postList.idCard == vm.idCardList.identityNum) {
      if (obj.effectiveEndTime) {
        if (obj.effectiveStartTime == obj.effectiveEndTime) {
          obj.effectiveEndTime = obj.effectiveEndTime + 24 * 60 * 60 * 1000 - 1;
        }
      }
      if (vm.userType_make_me) { obj.effectiveType = 0 }
      else { obj.effectiveType = 1 }
      //obj.cardTypeNames = arr.join(',');
      obj.name = vm.idCardList.customerName;
      doorSrv.createResident(obj).then(function (res) {
        console.log(res);
        if (res.success) {
          var faceObj = {};
          faceObj.id = vm.idCardList.id;
          faceObj.mobile = obj.mobile;
          doorSrv.uploadFaceImage(faceObj).then(function(res){
            if(res.success){
              toastr.info("新建住户成功");
              $rootScope.$broadcast('refresh-resident', 'create');
              vm.householdStep = 2;
            }
          })
        } else {
          toastr.info(res.message);
        }
      })
    } else {
      $scope.houseForm.submitted = true;
      $scope.houseForm.identityCardCheck = true;
    }
  }

  //var arr = [];
  //var cardBox = myFrame.window.document.getElementById("cardBox");
  //var cardBoxLen = $(cardBox).children('.row').length;
  //for (var i = 0; i < cardBoxLen; i++) {
  //  if ($(cardBox).children('.row').eq(i).children("input")[0].value) {
  //    arr.push($(cardBox).children('.row').eq(i).children("input")[0].value)
  //  }
  //}

  function cancel() {
    $modalInstance.dismiss('cancel');
  }
}

function editHouseholdCtl($rootScope, doorSrv, $timeout, toastr, items, $modalInstance) {
  var vm = this;
  console.log(items);
  vm.postList = items;
  vm.userType_make_me = false;
  vm.editResident = editResident;
  vm.cancel = cancel;

  function cancel() {
    $modalInstance.dismiss('cancel');
  }

  function groupArray(data, cols) {
    var list = [];
    var current = [];

    // for (t of data) {
    data.forEach(function (t) {
      current.push(t);
      if (current.length === cols) {
        list.push(current);
        current = [];
      }
    });
    // }    // for (t of data)

    if (current.length) {
      list.push(current);
    }
    return list;
  }

  vm.isEntranceExist = false;
  checkEntranceExist();
  function checkEntranceExist(){
    console.log(vm.postList.partitionId, vm.postList.unitId);
    doorSrv.checkExist(vm.postList.partitionId, vm.postList.unitId).then(function(res){
      console.log(res);
      if(res.success){
        vm.isEntranceExist = res.data;
      }
    })
  }

  function transform(obj) {
    var arr = [];
    for (var item in obj) {
      arr.push(obj[item]);
    }
    return arr;
  }

  vm.radio_change = radio_change;
  function radio_change() {
    if (vm.postList.effectiveType == 0) {
      vm.userType_make_me = true;
    } else {
      vm.userType_make_me = false;
    }
  }

  check_userType(items.userType);
  function check_userType(value) {
    if (value == 0) {
      vm.userType_make_me = true;
      vm.userEffectStatus = 0;
      vm.postList.effectiveType = 0;
    } else if (value == 1) {
      vm.userType_make_me = false;
      vm.userEffectStatus = 1;
      vm.postList.effectiveType = 1;
    } else {
      vm.userType_make_me = false;
      vm.userEffectStatus = 2;
      vm.postList.effectiveType = 1;
    }
  }

  function editResident(obj) {
    var objNew;
    var arr = [];
    var cardBox = myFrame.window.document.getElementById("cardBox");
    var cardBoxLen = $(cardBox).children('.row').length;
    for (var i = 0; i < cardBoxLen; i++) {
      if ($(cardBox).children('.row').eq(i).children("input")[0].value) {
        arr.push($(cardBox).children('.row').eq(i).children("input")[0].value)
      }
    }
    if (obj.effectiveEndTime) {
      if (obj.effectiveStartTime == obj.effectiveEndTime) {
        obj.effectiveEndTime = obj.effectiveEndTime + 24 * 60 * 60 * 1000 - 1;
      }
    }
    if (vm.userType_make_me) obj.effectiveType = 0;
    else obj.effectiveType = 1;

    obj.cardTypeNames = arr.join(',');
    objNew = {
      id: obj.id,
      name: obj.name,
      userType: obj.userType,
      mobile: obj.mobile,
      idCard: obj.idCard,
      partitionId: obj.partitionId,
      partitionName: obj.partitionName,
      blockId: obj.blockId,
      blockName: obj.blockName,
      unitId: obj.unitId,
      unitName: obj.unitName,
      roomNoId: obj.roomNoId,
      roomNo: obj.roomNo,
      effectiveType: obj.effectiveType,
      effectiveStartTime: obj.effectiveStartTime,
      effectiveEndTime: obj.effectiveEndTime,
      cardTypeNames: obj.cardTypeNames
    };
    console.log(objNew);
    doorSrv.editResident(objNew).then(function (res) {
      console.log(res);
      if (res.success) {
        toastr.info("修改住户成功");
        $timeout(function () {
          $rootScope.$broadcast('refresh-resident', 'edit');
          cancel();
        }, 500);
      } else {
        toastr.info(res.message);
      }
    })
  }
}

function importHouseholdCtl() {

}

function crudCommonCtl($rootScope, $scope, $modalInstance, propertySrv, doorSrv, ivhTreeviewBfs, toastr, $timeout) {
  var vm = this;
  vm.getDeviceDetail = getDeviceDetail;
  vm.getTreeNode = getTreeNode;
  vm.createCommon = createCommon;
  vm.cancel = cancel;

  vm.stuff = [];
  vm.count = false;
  $scope.createCommonForm = {};
  $scope.createCommonForm.submitted = false;

  getDeviceDetail();

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
        console.log(node);
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
    $scope.createCommonForm.submitted = false;
    vm.count = checkTreeEmpty();
  }

  function createCommon(obj) {
    vm.count = checkTreeEmpty();
    console.log(vm.count)
    var cardTypeName = myFrame.window.document.getElementById("CardNo").value;
    if ($scope.createCommonForm.$valid && vm.count > 0 && cardTypeName) {
      var a = getTreeNode();
      var cardNo = cardTypeName.split('-')[1];
      var cardType = 1;
      obj.fenceIds = a.fenceIds;
      obj.unitIds = a.unitIds;
      obj.cardType = cardType;
      obj.cardNo = cardNo;
      console.log(obj);
      doorSrv.createPublicCard(obj).then(function (res) {
        console.log('公卡创建成功', res);
        if (res.success) {
          toastr.info('公卡创建成功')
          $timeout(function () {
            $rootScope.$broadcast('refresh-common', 'create');
            cancel();
          }, 500)
        } else {
          toastr.info(res.message);
        }
      })
    } else {
      console.log('invalid');
      $scope.createCommonForm.submitted = true;
      if(!cardTypeName){
        $scope.createCommonForm.noCardNo = true;
      }
    }

  }

  function cancel() {
    $modalInstance.dismiss('cancel');
  }
}

function detailCommonCtl(doorSrv, items, $modalInstance) {
  var vm = this;
  vm.getCommonDetail = getCommonDetail;

  vm.detailList = {};
  vm.id = items;

  vm.cancel = cancel;

  function cancel() {
    $modalInstance.dismiss('cancel');
  }

  console.log(items);

  getCommonDetail(vm.id);

  function getCommonDetail(id) {
    doorSrv.detailPublicCard(id).then(function (res) {
      console.log('公卡详情: ', res);
      vm.detailList = res.data;
    })
  }
}

function doorAlarm($rootScope, $modalInstance, $timeout, items, doorSrv, toastr) {
  var vm = this;
  vm.model = items;

  if (vm.model.prop == 'household') {
    vm.deal = deleteResident;
    vm.alert = '确认删除住户?';
  } else if (vm.model.prop == 'common') {
    vm.deal = deleteCommon;
    vm.alert = '确认删除公卡?';
  }

  vm.cancel = cancel;
  function cancel() {
    $modalInstance.dismiss('cancel');
  }

  function deleteResident(id) {
    doorSrv.deleteResident(id).then(function (res) {
      console.log(res);
      if (res.success) {
        toastr.info('删除成功');
        $timeout(function () {
          $rootScope.$broadcast('refresh-resident');
          cancel();
        }, 500);
      } else {
        toastr.info(res.message);
      }
    })
  }

  function deleteCommon(id) {
    doorSrv.deletePublicCard(id).then(function (res) {
      console.log('删除成功: ', res);
      if (res.success) {
        toastr.info('删除成功');
        $timeout(function () {
          $rootScope.$broadcast('refresh-common');
          cancel();
        }, 500);
      } else {
        toastr.info(res.message);
      }
    })
  }


}