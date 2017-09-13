/**
 * Created by zhongyuqiang on 2017/7/20.
 */
angular.module('directive.pagination', [])
  .directive('myPagination', myPagination);

function myPagination(){
  return{
    restrict: 'E',
    scope: {
      pages: '=',
      selectPage: '&',
      isFirstPage: '=',
      isLastPage: '=',
      pageActive: '=',
      pagesNum: '=',
      pagesTotal: '=',
      pageSkip: '='
    },
    template: '<ul class="pagination pull-left p-h-sm"><li ng-class="{active: pageActive, disabled: isFirstPage}" class="pagination-first"> <a href="javascript:;" ng-click="selectPage({pageTag: \'current\', pageNo: 1})">首页</a> </li> <li ng-class="{disabled:isFirstPage}" class="pagination-prev"> <a href ng-click="isFirstPage || selectPage({pageTag: \'prev\'})">上一页</a> </li> <li ng-repeat="page in pages" ng-class="{active: page.active}" class="pagination-page"><a href ng-click="selectPage({pageTag: \'current\', pageNo: page.text})">{{page.text}}</a> </li>  <li ng-class="{disabled:isLastPage}" class="pagination-next"> <a href ng-click="isLastPage || selectPage({pageTag: \'next\'})">下一页</a> </li> <li ng-class="{disabled:isLastPage}" class="pagination-last"> <a href ng-click="isLastPage || selectPage({pageTag: \'current\', pageNo: pagesNum})">尾页</a> </li></ul><div class="page-skip pull-left m-l-sm"> <span class="m-r-xs">共<b>{{pagesTotal}}</b>条</span> <span>跳转至</span> <input type="number" class="form-control" id="pageBinding" min="1" ng-model="pageSkip" max="{{pagesNum}}" style="width:80px;display: inline-block;"><span style="margin-left: 5px;">页</span><button class="btn btn-info btn-sm" style="margin-left: 10px;margin-top: -5px;" ng-disabled="!pageSkip" ng-click="selectPage({pageTag: \'current\', pageNo: pageSkip})">确定 </button></div>'
  }
}