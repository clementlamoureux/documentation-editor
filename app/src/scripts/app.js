
angular.module('documentation', ['ui.router'])
.config(['$stateProvider', function($stateProvider){
  $stateProvider.state('root', {
    url: '/',
    templateUrl: 'src/views/root.html'
  });
}])
.run(function(){
  console.log('hey');
})
.directive('markdownSimplemde', function(){
  return {
    link : function(scope, element){
      console.log(scope, element);
      new SimpleMDE({ element: element[0] });
    }
  }
});


angular.element(document).ready(function() {
  angular.bootstrap(document, ['documentation']);
});