
angular.module('documentation', ['ui.router'])
.config(['$stateProvider', function($stateProvider){
  $stateProvider.state('root', {
    url: '/',
    templateUrl: 'src/views/root.html'
  });
}])
.run(function($rootScope, $window){
  $rootScope.window = $window;
  $rootScope.data = {};
  $rootScope.data.editing = '';
  $rootScope.message = function(sender, message){
    $rootScope.mdFiles = message;
    $rootScope.$apply();
  };
  $rootScope.openFile = function(sender, text){
    $rootScope.data.editing = text[0];
    $rootScope.$apply();
  };
  $rootScope.askOpenFile = function(fileName){
    window.openFile(fileName);
  }
})
.directive('markdownSimplemde', function($interval, $rootScope){
  return {
    link : function(scope, element){
      console.log(scope, element);
      var mde = new SimpleMDE({ element: element[0] });
      $rootScope.$watch(function(){
        return $rootScope.data.editing;
      }, function(a){
        mde.value(a);
      });
      var interval = $interval(function(){
        $rootScope.data.editing = mde.value();
      }, 1000);
      scope.$on('$destroy', function(){
        console.log('destroy');
        $interval.cancel(interval);
      });
    }
  }
})
.directive('markdownViewer', function($interval, $rootScope){
  return {
    link : function(scope, element){
      $rootScope.$watch(function(){
        return $rootScope.data.editing;
      }, function(a){
        element[0].innerHTML = markdown.toHTML(a);
      });
    }
  }
});


angular.element(document).ready(function() {
  angular.bootstrap(document, ['documentation']);
});