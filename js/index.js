var App = angular.module('myApp',['ngStorage']);

// LOADING JSON
App.controller('myCtrl', function($scope, $http, $localStorage) {
  
  $scope.updateData = function(){
     $scope.total = 0;
     $scope.discount = 0;
     $scope.type_discount = 0;
     $scope.order_total = 0;
     for(var i = 0;i < $scope.items.length;i++){
       $scope.items[i].price = $scope.items[i].qty * $scope.items[i].rate;
       $scope.total = $scope.total + $scope.items[i].price;
       $scope.discount = $scope.discount + $scope.items[i].discount * $scope.items[i].price / 100;
       if($scope.items[i].type == "fiction")
         $scope.type_discount = $scope.type_discount + 0.15 * $scope.items[i].price;
     }
     $scope.order_total = $scope.total - $scope.discount - $scope.type_discount;
     $localStorage.itemsLocal = $scope.items;
  }

  $scope.reloadFresh = function(){
    $http.get('js/data.json')
     .then(function(res){
        $scope.items = res.data.results;

        angular.forEach($scope.items, function(item, key) {
            item.qty = 1;
            item.rate = item.price;
        });
        $scope.updateData();
      });
  }

   $scope.increaseQty = function(index){
      $scope.items[index].qty = $scope.items[index].qty + 1;
      $scope.updateData();
   }

   $scope.removeItem = function(index){
      var x = document.getElementById("snackbar");
      x.innerHTML = $scope.items[index].name + " has been deleted";
      x.className = "show";
      setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
      $scope.items.splice(index, 1);
      $scope.updateData();
   }

   $scope.decreaseQty = function(index){
      if($scope.items[index].qty != 0)
        $scope.items[index].qty = $scope.items[index].qty - 1;
      if($scope.items[index].qty == 0)
        $scope.removeItem(index);
      $scope.updateData();
   }

   if ($localStorage.itemsLocal) {
       $scope.items = $localStorage.itemsLocal;  
       $scope.updateData();
   }  
   else{
     $scope.reloadFresh();
   }  

});