/**
 * Created by zhongyuqiang on 16/11/30.
 */
angular.module('app', [
  'ui.router',
  'ui.select2',
  'ui.bootstrap',
  'mgcrea.ngStrap.datepicker',
  'mgcrea.ngStrap.dropdown',
  'ngAnimate',
  'angular-loading-bar',
  //'angular-underscore',
  'ivh.treeview',
  'ksSwiper',
  'toastr',
  'angularFileUpload',
  'ngSanitize',
  'app.router',
  'mainMdl',
  'mainApi',
  'homeMdl',
  'homeApi',
  'propertyMdl',
  'propertyApi',
  'deviceMdl',
  'deviceApi',
  'doorMdl',
  'doorApi',
  'logMdl',
  'logApi',
  'directive.pagination',
  'directive.cascade',
  'directive.filterButton',
  'directive.select'
]);

angular.module('app')
  .run(initConfig)
  .config(config)
  .animation('.fad',fad);

function initConfig(uiSelect2Config){
  uiSelect2Config.minimumResultsForSearch = -1;
  uiSelect2Config.placeholder = "Placeholder text";
}

function config(ivhTreeviewOptionsProvider, toastrConfig){
  ivhTreeviewOptionsProvider.set({
    idAttribute: 'id',
    labelAttribute: 'name',
    childrenAttribute: 'children',
    selectedAttribute: 'selected',
    useCheckboxes: true,
    expandToDepth: 0,
    indeterminateAttribute: '__ivhTreeviewIndeterminate',
    expandedAttribute: '__ivhTreeviewExpanded',
    defaultSelectedState: false,
    validate: true,
    twistieExpandedTpl: '<span class="fa fa-minus" style="margin-right: 2px;"></span>',
    twistieCollapsedTpl: '<span class="fa fa-plus" style="margin-right: 2px;"></span>',
    twistieLeafTpl: '<span class="fa fa-file" style="margin-right: 2px;"></span>'
  });

  angular.extend(toastrConfig, {
    iconClasses: {
      error: 'toast-error',
      info: 'toast-dark',
      success: 'toast-success',
      warning: 'toast-warning'
    },
    timeOut: 500
  });
}

function fad() {
  return {
    enter: function(element, done) {
      element.css({
        opacity: 0
      });
      element.animate({
        opacity: 1
      }, 0, done);
    },
    leave: function (element, done) {
      element.css({
        opacity: 1
      });
      element.animate({
        opacity: 0
      }, 1, done);
    }
  };
}
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
    .state('log.ocx', {
      url: "/ocx",
      templateUrl: "views/log/log-ocx.html"
    })
}
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
      //{b_title: '日志查询', itemName:"ocx", sref:"log.ocx", pageNo: 1, isActive: false},
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
(function() {
  var module,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  module = angular.module('angularBootstrapNavTree', []);

  module.directive('abnTree', [
    '$timeout', function($timeout) {
      return {
        restrict: 'E',
        template:
        "<ul class=\"nav nav-list nav-pills nav-stacked abn-tree\">" +
        "<li ng-repeat=\"row in tree_rows | filter:{visible:true} track by row.branch.uid\"" +
        "ng-animate=\"'abn-tree-animate'\" " +
        "ng-class=\"'level-' + {{ row.level }} + (row.branch.selected ? ' active':'') + ' ' +row.classes.join(' ')\" " +
        "class=\"abn-tree-row\">" +
        "<div ng-click=\"user_clicks_branch(row.branch)\">" +
        "<i ng-class=\"row.tree_icon\" " +
        "ng-click=\"row.branch.expanded = !row.branch.expanded\" " +
        "class=\"indented tree-icon\"> " +
        "</i>" +
        "<input type='checkbox' ng-model='apple' ng-change='user_check(row.branch)' checked>" +
        "<span class=\"indented tree-label\">{{ row.label }} </span>" +
        "</div>" +
        "</li>" +
        "</ul>",
        replace: true,
        scope: {
          treeData: '=',
          onSelect: '&',
          initialSelection: '@',
          treeControl: '='
        },
        link: function(scope, element, attrs) {
          var error, expand_all_parents, expand_level, for_all_ancestors, for_each_branch, get_parent, n, on_treeData_change, select_branch, selected_branch, tree;
          error = function(s) {
            console.log('ERROR:' + s);
            debugger;
            return void 0;
          };
          if (attrs.iconExpand == null) {
            attrs.iconExpand = 'icon-plus  glyphicon glyphicon-plus  fa fa-plus';
          }
          if (attrs.iconCollapse == null) {
            attrs.iconCollapse = 'icon-minus glyphicon glyphicon-minus fa fa-minus';
          }
          if (attrs.iconLeaf == null) {
            attrs.iconLeaf = 'icon-file  glyphicon glyphicon-file  fa fa-file';
          }
          if (attrs.expandLevel == null) {
            attrs.expandLevel = '3';
          }
          expand_level = parseInt(attrs.expandLevel, 10);
          if (!scope.treeData) {
            alert('no treeData defined for the tree!');
            return;
          }
          if (scope.treeData.length == null) {
            if (treeData.label != null) {
              scope.treeData = [treeData];
            } else {
              alert('treeData should be an array of root branches');
              return;
            }
          }
          for_each_branch = function(f) {
            var do_f, root_branch, _i, _len, _ref, _results;
            do_f = function(branch, level) {
              var child, _i, _len, _ref, _results;
              f(branch, level);
              if (branch.children != null) {
                _ref = branch.children;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  child = _ref[_i];
                  _results.push(do_f(child, level + 1));
                }
                return _results;
              }
            };
            _ref = scope.treeData;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              root_branch = _ref[_i];
              _results.push(do_f(root_branch, 1));
            }
            return _results;
          };
          selected_branch = null;
          select_branch = function(branch) {
            if (!branch) {
              if (selected_branch != null) {
                selected_branch.selected = false;
              }
              selected_branch = null;
              return;
            }
            if (branch !== selected_branch) {
              if (selected_branch != null) {
                selected_branch.selected = false;
              }
              branch.selected = true;
              selected_branch = branch;
              expand_all_parents(branch);
              if (branch.onSelect != null) {
                return $timeout(function() {
                  return branch.onSelect(branch);
                });
              } else {
                if (scope.onSelect != null) {
                  return $timeout(function() {
                    return scope.onSelect({
                      branch: branch
                    });
                  });
                }
              }
            }
          };
          scope.user_clicks_branch = function(branch) {
            if (branch !== selected_branch) {
              return select_branch(branch);
            }
          };
          scope.user_check = function(branch){
            console.log(this.row.branch);
            console.log(element);
            console.log(branch);
          };
          get_parent = function(child) {
            var parent;
            parent = void 0;
            if (child.parent_uid) {
              for_each_branch(function(b) {
                if (b.uid === child.parent_uid) {
                  return parent = b;
                }
              });
            }
            return parent;
          };
          for_all_ancestors = function(child, fn) {
            var parent;
            parent = get_parent(child);
            if (parent != null) {
              fn(parent);
              return for_all_ancestors(parent, fn);
            }
          };
          expand_all_parents = function(child) {
            return for_all_ancestors(child, function(b) {
              return b.expanded = true;
            });
          };
          scope.tree_rows = [];
          on_treeData_change = function() {
            var add_branch_to_list, root_branch, _i, _len, _ref, _results;
            for_each_branch(function(b, level) {
              if (!b.uid) {
                return b.uid = "" + Math.random();
              }
            });
            for_each_branch(function(b) {
              var child, _i, _len, _ref, _results;
              if (angular.isArray(b.children)) {
                _ref = b.children;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  child = _ref[_i];
                  _results.push(child.parent_uid = b.uid);
                }
                return _results;
              }
            });
            scope.tree_rows = [];
            for_each_branch(function(branch) {
              var child, f;
              if (branch.children) {
                if (branch.children.length > 0) {
                  f = function(e) {
                    if (typeof e === 'string') {
                      return {
                        label: e,
                        children: []
                      };
                    } else {
                      return e;
                    }
                  };
                  return branch.children = (function() {
                    var _i, _len, _ref, _results;
                    _ref = branch.children;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                      child = _ref[_i];
                      _results.push(f(child));
                    }
                    return _results;
                  })();
                }
              } else {
                return branch.children = [];
              }
            });
            add_branch_to_list = function(level, branch, visible) {
              var child, child_visible, tree_icon, _i, _len, _ref, _results;
              if (branch.expanded == null) {
                branch.expanded = false;
              }
              if (branch.classes == null) {
                branch.classes = [];
              }
              if (!branch.noLeaf && (!branch.children || branch.children.length === 0)) {
                tree_icon = attrs.iconLeaf;
                if (__indexOf.call(branch.classes, "leaf") < 0) {
                  branch.classes.push("leaf");
                }
              } else {
                if (branch.expanded) {
                  tree_icon = attrs.iconCollapse;
                } else {
                  tree_icon = attrs.iconExpand;
                }
              }
              scope.tree_rows.push({
                level: level,
                branch: branch,
                label: branch.label,
                classes: branch.classes,
                tree_icon: tree_icon,
                visible: visible
              });
              if (branch.children != null) {
                _ref = branch.children;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  child = _ref[_i];
                  child_visible = visible && branch.expanded;
                  _results.push(add_branch_to_list(level + 1, child, child_visible));
                }
                return _results;
              }
            };
            _ref = scope.treeData;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              root_branch = _ref[_i];
              _results.push(add_branch_to_list(1, root_branch, true));
            }
            return _results;
          };
          scope.$watch('treeData', on_treeData_change, true);
          if (attrs.initialSelection != null) {
            for_each_branch(function(b) {
              if (b.label === attrs.initialSelection) {
                return $timeout(function() {
                  return select_branch(b);
                });
              }
            });
          }
          n = scope.treeData.length;
          for_each_branch(function(b, level) {
            b.level = level;
            return b.expanded = b.level < expand_level;
          });
          if (scope.treeControl != null) {
            if (angular.isObject(scope.treeControl)) {
              tree = scope.treeControl;
              tree.expand_all = function() {
                return for_each_branch(function(b, level) {
                  return b.expanded = true;
                });
              };
              tree.collapse_all = function() {
                return for_each_branch(function(b, level) {
                  return b.expanded = false;

                });
              };
              tree.get_first_branch = function() {
                n = scope.treeData.length;
                if (n > 0) {
                  return scope.treeData[0];
                }
              };
              tree.select_first_branch = function() {
                var b;
                b = tree.get_first_branch();
                return tree.select_branch(b);
              };
              tree.get_selected_branch = function() {
                return selected_branch;
              };
              tree.get_parent_branch = function(b) {
                return get_parent(b);
              };
              tree.select_branch = function(b) {
                select_branch(b);
                return b;
              };
              tree.get_children = function(b) {
                return b.children;
              };
              tree.select_parent_branch = function(b) {
                var p;
                if (b == null) {
                  b = tree.get_selected_branch();
                }
                if (b != null) {
                  p = tree.get_parent_branch(b);
                  if (p != null) {
                    tree.select_branch(p);
                    return p;
                  }
                }
              };
              tree.add_branch = function(parent, new_branch) {
                if (parent != null) {
                  parent.children.push(new_branch);
                  parent.expanded = true;
                } else {
                  scope.treeData.push(new_branch);
                }
                return new_branch;
              };
              tree.add_root_branch = function(new_branch) {
                tree.add_branch(null, new_branch);
                return new_branch;
              };
              tree.expand_branch = function(b) {
                if (b == null) {
                  b = tree.get_selected_branch();
                }
                if (b != null) {
                  b.expanded = true;
                  return b;
                }
              };
              tree.collapse_branch = function(b) {
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  b.expanded = false;
                  return b;
                }
              };
              tree.get_siblings = function(b) {
                var p, siblings;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  p = tree.get_parent_branch(b);
                  if (p) {
                    siblings = p.children;
                  } else {
                    siblings = scope.treeData;
                  }
                  return siblings;
                }
              };
              tree.get_next_sibling = function(b) {
                var i, siblings;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  siblings = tree.get_siblings(b);
                  n = siblings.length;
                  i = siblings.indexOf(b);
                  if (i < n) {
                    return siblings[i + 1];
                  }
                }
              };
              tree.get_prev_sibling = function(b) {
                var i, siblings;
                if (b == null) {
                  b = selected_branch;
                }
                siblings = tree.get_siblings(b);
                n = siblings.length;
                i = siblings.indexOf(b);
                if (i > 0) {
                  return siblings[i - 1];
                }
              };
              tree.select_next_sibling = function(b) {
                var next;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  next = tree.get_next_sibling(b);
                  if (next != null) {
                    return tree.select_branch(next);
                  }
                }
              };
              tree.select_prev_sibling = function(b) {
                var prev;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  prev = tree.get_prev_sibling(b);
                  if (prev != null) {
                    return tree.select_branch(prev);
                  }
                }
              };
              tree.get_first_child = function(b) {
                var _ref;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  if (((_ref = b.children) != null ? _ref.length : void 0) > 0) {
                    return b.children[0];
                  }
                }
              };
              tree.get_closest_ancestor_next_sibling = function(b) {
                var next, parent;
                next = tree.get_next_sibling(b);
                if (next != null) {
                  return next;
                } else {
                  parent = tree.get_parent_branch(b);
                  return tree.get_closest_ancestor_next_sibling(parent);
                }
              };
              tree.get_next_branch = function(b) {
                var next;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  next = tree.get_first_child(b);
                  if (next != null) {
                    return next;
                  } else {
                    next = tree.get_closest_ancestor_next_sibling(b);
                    return next;
                  }
                }
              };
              tree.select_next_branch = function(b) {
                var next;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  next = tree.get_next_branch(b);
                  if (next != null) {
                    tree.select_branch(next);
                    return next;
                  }
                }
              };
              tree.last_descendant = function(b) {
                var last_child;
                if (b == null) {
                  debugger;
                }
                n = b.children.length;
                if (n === 0) {
                  return b;
                } else {
                  last_child = b.children[n - 1];
                  return tree.last_descendant(last_child);
                }
              };
              tree.get_prev_branch = function(b) {
                var parent, prev_sibling;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  prev_sibling = tree.get_prev_sibling(b);
                  if (prev_sibling != null) {
                    return tree.last_descendant(prev_sibling);
                  } else {
                    parent = tree.get_parent_branch(b);
                    return parent;
                  }
                }
              };

              return tree.select_prev_branch = function(b) {
                var prev;
                if (b == null) {
                  b = selected_branch;
                }
                if (b != null) {
                  prev = tree.get_prev_branch(b);
                  if (prev != null) {
                    tree.select_branch(prev);
                    return prev;
                  }
                }
              };
            }
          }
        }
      };
    }
  ]);

}).call(this);

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
/**
 * Created by zhongyuqiang on 2017/7/21.
 */
angular.module('directive.filterButton', [])
  .directive('myFilterButton', myFilterButton);

function myFilterButton(){
  return {
    restrict: 'E',
    scope: {
      getSearch: '&',
      clearSession: '&',
      selectList: '=',
      getList: '='
    },
    template: '<button class="btn btn-sm btn-primary p-h-lg" ng-click="getSearch({selectList: selectList, getList: getList})"> 搜索 </button> <button class="btn btn-sm btn-primary btn-stroke p-h-lg m-l-md" ng-click="clearSession()"> 清空 </button>'
  }
}
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
/**
 * Created by zhongyuqiang on 2017/7/21.
 */
angular.module('directive.select', [])
  .directive('mySelect', mySelect);

function mySelect(){
  return {
    restrict: 'E',
    scope: {
      optList: '=',
      model: '=',
      name: '@',
      placeholder: '@'
    },
    template: '<select ui-select2 ng-model="model" data-placeholder="{{placeholder}}"> <option value=""></option> <option ng-repeat="item in optList" ng-value="$index">{{item}}</option></select>'
  }
}
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

function householdCtl($rootScope, $location, $state, $modal, $stateParams, doorSrv, mainSrv, toastr) {
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

function createHouseholdCtl($rootScope, $scope, $modalInstance, $timeout, doorSrv, mainSrv, items, toastr) {
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

  if (items) {
    console.log(items);
    vm.title = '编辑住户';
    vm.postList = items;
    getPartition();
  } else {
    vm.title = '添加住户';
    getPartition();
  }

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

  function createResident(obj) {
    console.log(obj);

    if ($scope.houseForm.$valid) {
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
      if (vm.userType_make_me) {
        obj.effectiveType = 0
      }
      else {
        obj.effectiveType = 1
      }
      obj.cardTypeNames = arr.join(',');
      console.log(obj);
      doorSrv.createResident(obj).then(function (res) {
        console.log(res);
        if (res.success) {
          toastr.info("新建住户成功");
          $timeout(function () {
            $rootScope.$broadcast('refresh-resident', 'create');
            cancel();
          }, 500);
        } else {
          toastr.info(res.message);
        }
      })
    } else {
      console.log($scope.houseForm)
      $scope.houseForm.submitted = true;
    }
  }

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

  //check_userType(items.userType);
  //function check_userType(value) {
  //  if(!items.effectiveType){
  //    if (value == 0) {
  //      vm.userType_make_me = true;
  //      vm.userEffectStatus = 0;
  //      vm.postList.effectiveType = 0;
  //    } else if (value == 1) {
  //      vm.userType_make_me = false;
  //      vm.userEffectStatus = 1;
  //      vm.postList.effectiveType = 1;
  //    } else {
  //      vm.userType_make_me = false;
  //      vm.userEffectStatus = 2;
  //      vm.postList.effectiveType = 1;
  //    }
  //  }else{
  //    if(items.effectiveType == 1){
  //      vm.userType_make_me = true;
  //      vm.postList.effectiveType = 0;
  //    }else{
  //      vm.userType_make_me = false;
  //      vm.postList.effectiveType = 1;
  //    }
  //  }
  //}

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

function openCtl($rootScope, $location, $state, logSrv, mainSrv, toastr){
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
                res.data.list[i].type = 'APP';
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
/**
 * Created by zhongyuqiang on 2017/8/13.
 */
angular.module('deviceApi', [])
  .factory('deviceSrv', deviceSrv);

deviceSrv.$inject = ['$q', '$http', 'mainSrv'];
function deviceSrv($q, $http, mainSrv){
  var server = mainSrv.getHttpRoot();

  var deviceList = {
    getDevice: function(pageNo, limit, obj) {
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/device/list/' + pageNo + '/' + limit,
        params: obj,
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function (data) {
          defer.resolve(data);
        })
        .error(function (error) {
          defer.reject(error);
        });
      return defer.promise;
    },
    closeDoor: function(id, status) {
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/device/'+id+'/'+status+'/change',
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function (data) {
          defer.resolve(data);
        })
        .error(function (error) {
          defer.reject(error);
        });
      return defer.promise;
    },
  }

  return deviceList;
}
/**
 * Created by zhongyuqiang on 2017/8/11.
 */
angular.module('doorApi', [])
  .factory('doorSrv', doorSrv);

doorSrv.$inject = ['$q', '$http', 'mainSrv'];
function doorSrv($q, $http, mainSrv){
  var server = mainSrv.getHttpRoot();
  var doorList = {
    getResident: function(pageNo, limit, obj){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/resident/list/' + pageNo + '/' + limit,
        params: obj,
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    createResident: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/resident/add',
        data: obj,
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    deleteResident: function(id){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/resident/'+id+'/delete',
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    editResident: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/resident/edit',
        data: obj,
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    getPublicCard: function(pageNo, limit, obj){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/public/card/list/' + pageNo + '/' + limit,
        params: obj,
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    createPublicCard: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/public/card/add',
        data: obj,
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    detailPublicCard: function(id){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/public/card/'+id+'/detail',
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    deletePublicCard: function(id){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/public/card/'+id+'/delete',
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    checkExist: function(partitionId, unitId){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/device/isExist/'+partitionId+'/'+unitId,
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    }
  };
  return doorList;
}
/**
 * Created by zhongyuqiang on 2017/8/11.
 */
angular.module('homeApi', [])
  .factory('homeSrv', homeSrv);

homeSrv.$inject = ['$q', '$http', 'mainSrv'];
function homeSrv($q, $http, mainSrv){
  var server = mainSrv.getHttpRoot();
  var homeList = {
    getAlarmInfo: function(){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/device/alarmInfo/list',
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    getStatistics: function(){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/statistics/homepage',
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    }
  };

  return homeList;
}
/**
 * Created by zhongyuqiang on 2017/8/13.
 */
angular.module('logApi', [])
  .factory('logSrv', logSrv);

logSrv.$inject = ['$q', '$http', 'mainSrv'];
function logSrv($q, $http, mainSrv) {
  var server = mainSrv.getHttpRoot();
  var logList = {
    getIntercom: function(pageNo, limit, obj) {
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/log/intercom/' + pageNo + '/' + limit,
        params: obj,
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function (data) {
          defer.resolve(data);
        })
        .error(function (error) {
          defer.reject(error);
        });
      return defer.promise;
    },
    getAlarmInfo: function(pageNo, limit, obj){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/device/alarmInfo/log/list/' + pageNo + '/' + limit,
        params: obj,
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function (data) {
          defer.resolve(data);
        })
        .error(function (error) {
          defer.reject(error);
        });
      return defer.promise;
    }
  }
  return logList;
}
/**
 * Created by zhongyuqiang on 16/11/30.
 */
angular.module('mainApi', [])
  .factory('mainSrv', mainSrv)
  .service('fileUpload', fileUpload);

mainSrv.$inject = ['$q', '$http'];
function mainSrv($q, $http){
  var server = "http://192.168.23.241:8082";
  //var server = "http://114.55.143.170:8082";
   //var server = "http://116.62.39.38:8081";

  var mainList = {
    getHttpRoot: function(){
      return server;
    },
    login: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/account/login',
        data: obj
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },

    logout: function(){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/account/logout',
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },

    logup: function(obj){
      var defer = $q.defer();
      console.log(obj);
      $http({
        method: 'POST',
        url: server + '/account/password/edit',
        data: obj,
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },

    getAddress: function (){
      var defer = $q.defer();
      $http.get("../../data/data.json")
        .success(function (data) {
          defer.resolve(data);
        })
        .error(function(data){
          defer.reject();
          console.log(data);
        });
      return defer.promise;
    },

    getPartitions: function(){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/partitions',
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function (data) {
          defer.resolve(data);
        })
        .error(function(data){
          defer.reject();
          console.log(data);
        });
      return defer.promise;
    },

    getBlocks: function(partitionId){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/'+partitionId+'/blocks',
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function (data) {
          defer.resolve(data);
        })
        .error(function(data){
          defer.reject();
          console.log(data);
        });
      return defer.promise;
    },

    getUnits: function(blockId){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/' + blockId + '/units',
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function (data) {
          defer.resolve(data);
        })
        .error(function(data){
          defer.reject();
          console.log(data);
        });
      return defer.promise;
    },

    getRooms: function(unitId){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/' + unitId + '/rooms',
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function (data) {
          defer.resolve(data);
        })
        .error(function(data){
          defer.reject();
          console.log(data);
        });
      return defer.promise;
    },

    // pagesNum , pagesSplit , pages, pageNo
    pagination: function(pagesNum, pagesSplit, pages, pageNo){

      if(pagesNum<=7){
        for(var i=0;i<pagesNum;i++){
          pages[i] = {text: i+1, active: false};
        }
        if(pages.length){
          pages[pageNo-1].active = true;
        }
      }else{
        //页码小于5的情况
        if(pageNo<5){
          for(var i=0;i<pagesSplit;i++){
            pages[i] = {text: i+1, active: false};
          }
          pages[pageNo-1].active = true;
        }
        //页码大于5 小于(全部页码-3)的情况
        else if(pageNo>=5&&pageNo<pagesNum-3){
          for(var i=pageNo-4, j=0;i<pageNo+3, j<7;i++, j++){
            pages[j] = {text: i+1, active: false};
          }
          pages[3].active = true; // 当大于5条信息时, 它的位置总是第4个
        }
        //最后三个页码
        else if(pageNo>=pagesNum-3){
          for(var i=pagesNum-7, j=0;i<pagesNum, j<7;i++, j++){
            pages[j] = {text: i+1, active: false};
          }
          pages[6-(pagesNum-pageNo)].active = true; // 最后3条信息的位置是: 7-(总共页码-当前页码)-1
        }
      }
    },

    getSearch: function(newobj, cb){
      var obj = newobj;
      for(var a in obj){
        if(obj[a]==0&&typeof obj[a] == "number"){
          continue;
        }
        if(obj[a]==""||obj[a]=='undefined'){
          delete obj[a]
        }
      }
      var str = JSON.stringify(newobj);
      sessionStorage.filterList = str;
      console.log(obj);
      cb(1, obj);
    }
  };

  return mainList;
}

fileUpload.$inject = ['$http', '$q'];
function fileUpload($http, $q){
  this.uploadFileToUrl = function(file, uploadUrl){
    var defer = $q.defer();
    var fd = new FormData();
    console.log(file, 'ff');
    fd.append('picture', file);
    console.log(fd);
    $http.post(uploadUrl, fd, {
      transformRequest: angular.identity,
      headers: {
        'Content-Type': 'multipart/form-data;boundary='+ Math.random()
      }
    }).success(function(data, status){
      console.log('success', data);
      defer.resolve({'code': 0, 'status': status, 'data': data});
    }).error(function(error, status){
      console.log('error');
      defer.reject({'code': -200, 'status': status, 'data': error});
    });
    return defer.promise;
  }
}
/**
 * Created by zhongyuqiang on 2017/8/11.
 */
angular.module('propertyApi', [])
  .factory('propertySrv', propertySrv);

propertySrv.$inject = ['$q', '$http', 'mainSrv'];
function propertySrv($q, $http, mainSrv){
  var server = mainSrv.getHttpRoot();
  var propertyList = {
    getAnnounce: function(pageNo, limit, obj){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/announcement/list/' + pageNo + '/' + limit,
        params: obj,
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    getDeviceDetail: function(){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/community/device/detail/',
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    createAnnounce: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/announcement/add',
        data: obj,
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    editAnnounce: function(id){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/announcement/'+id+'/edit',
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    editAnnounceSave: function(obj){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/announcement/editSave',
        data: obj,
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    deleteAnnounce: function(id){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/announcement/'+id+'/delete',
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    getAnnounceDetail: function(id){
      var defer = $q.defer();
      $http({
        method: 'POST',
        url: server + '/community/announcement/'+id+'/detail',
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    getComplaint: function(pageNo, limit, obj){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/estate/complaint/list/'+ pageNo + '/' + limit,
        params: obj,
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    dealComplaint: function(id, data){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/estate/complaint/'+id+'/updateStatus/'+data,
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    getComplaintDetail: function(id){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/estate/complaint/'+id+'/detail',
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    getStandard: function(){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/charge/standard/list',
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    createStandard: function(obj){
      var defer = $q.defer();
      console.log(obj);
      $http({
        method: 'POST',
        url: server + '/charge/standard/save',
        data: obj,
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    },
    deleteStandard: function(id){
      var defer = $q.defer();
      $http({
        method: 'GET',
        url: server + '/charge/standard/'+id+'/delete',
        headers: {
          'token': localStorage.wekerToken,
          'Content-Type': 'application/json;charset=UTF-8'
        }
      })
        .success(function(data){
          defer.resolve(data);
        })
        .error(function(error){
          defer.reject(error);
        });
      return defer.promise;
    }
  };
  return propertyList;
}