/**
 * Created by zhongyuqiang on 2017/7/21.
 */
angular.module('directive.cascade', [])
  .directive('myCascade', myCascade)
  .directive('myCascadeCheck', myCascadeCheck)
  .directive('myCascadeThree', myCascadeThree);

function myCascade(){
  return {
    restrict: 'E',
    scope: {
      partitionId: '=',
      blockId: '=',
      unitId: '=',
      roomId: '=',
      getBlocks: '&',
      getUnits: '&',
      getRooms: '&',
      partitions: '=',
      blocks: '=',
      units: '=',
      rooms: '='
    },
    template: '<div class="pull-left w-sm m-r-sm"> <select ui-select2 ng-model="partitionId" data-placeholder="分区" ng-change="getBlocks({partitionId: partitionId})"> <option value=""></option><option ng-value="item.id" ng-repeat="item in partitions"> {{item.name}} </option> </select> </div><div class="pull-left w-xs m-r-sm" > <select ui-select2 name="louyu" ng-model="blockId" data-placeholder="楼宇" ng-change="getUnits({blockId: blockId})"> <option value=""></option> <option ng-value="item.id" ng-repeat="item in blocks"> {{item.name}} </option> </select> </div><div class="pull-left w-xs m-r-sm"> <select ui-select2 name="danyuan" ng-model="unitId" data-placeholder="单元" ng-change="getRooms({unitId: unitId})"> <option value=""></option> <option ng-value="item.id" ng-repeat="item in units" > {{item.name}} </option> </select> </div><div class="pull-left w-xs m-r-lg"> <select required ui-select2 name="fanghao" ng-model="roomId" data-placeholder="房号"> <option value=""></option> <option ng-value="item.id" ng-repeat="item in rooms"> {{item.code}} </option> </select> </div>'
  }
}

function myCascadeCheck(){
  return {
    restrict: 'E',
    scope: {
      partitionId: '=',
      blockId: '=',
      unitId: '=',
      roomId: '=',
      getBlocks: '&',
      getUnits: '&',
      getRooms: '&',
      checkEntranceExist: '&',
      partitions: '=',
      blocks: '=',
      units: '=',
      rooms: '='
    },
    template: '<div class="pull-left w-sm m-r-sm"> <select ui-select2 ng-model="partitionId" data-placeholder="分区" ng-change="getBlocks({partitionId: partitionId})"> <option value=""></option><option ng-value="item.id" ng-repeat="item in partitions"> {{item.name}} </option> </select> </div><div class="pull-left w-xs m-r-sm" > <select ui-select2 name="louyu" ng-model="blockId" data-placeholder="楼宇" ng-change="getUnits({blockId: blockId})"> <option value=""></option> <option ng-value="item.id" ng-repeat="item in blocks"> {{item.name}} </option> </select> </div><div class="pull-left w-xs m-r-sm"> <select ui-select2 name="danyuan" ng-model="unitId" data-placeholder="单元" ng-change="getRooms({unitId: unitId})"> <option value=""></option> <option ng-value="item.id" ng-repeat="item in units" > {{item.name}} </option> </select> </div><div class="pull-left w-xs m-r-lg"> <select ng-change="checkEntranceExist({partitionId: partitionId})" required ui-select2 name="fanghao" ng-model="roomId" data-placeholder="房号"> <option value=""></option> <option ng-value="item.id" ng-repeat="item in rooms"> {{item.code}} </option> </select> </div>'
  }
}

function myCascadeThree(){
  return {
    restrict: 'E',
    scope: {
      partitionId: '=',
      blockId: '=',
      unitId: '=',
      getBlocks: '&',
      getUnits: '&',
      partitions: '=',
      blocks: '=',
      units: '='
    },
    template: '<div class="pull-left w-sm m-r-sm"> <select ui-select2 ng-model="partitionId" data-placeholder="分区" ng-change="getBlocks({partitionId: partitionId})"> <option value=""></option><option ng-value="item.id" ng-repeat="item in partitions"> {{item.name}} </option> </select> </div><div class="pull-left w-xs m-r-sm" > <select ui-select2 name="louyu" ng-model="blockId" data-placeholder="楼宇" ng-change="getUnits({blockId: blockId})"> <option value=""></option> <option ng-value="item.id" ng-repeat="item in blocks"> {{item.name}} </option> </select> </div><div class="pull-left w-xs m-r-lg"> <select ui-select2 name="danyuan" ng-model="unitId" data-placeholder="单元"> <option value=""></option> <option ng-value="item.id" ng-repeat="item in units" > {{item.name}} </option> </select> </div>'
  }
}