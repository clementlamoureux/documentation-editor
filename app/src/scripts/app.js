
angular.module('documentation', ['ui.router'])
.config(['$stateProvider', function($stateProvider){
  $stateProvider.state('root', {
    url: '/',
    templateUrl: 'src/views/root.html'
  });
}])
.run(function($rootScope){
  console.log('hey');
  $rootScope.data = {};
  $rootScope.data.editing = '';
})
.directive('markdownSimplemde', function($interval, $rootScope){
  return {
    link : function(scope, element){
      console.log(scope, element);
      var mde = new SimpleMDE({ element: element[0] });
      var interval = $interval(function(){
        $rootScope.data.editing = mde.value();
      }, 1000);
      scope.$on('destroy', function(){
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