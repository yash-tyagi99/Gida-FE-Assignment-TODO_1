// js/app.js
var app = angular.module("todoApp", []);

// Include the header directive
app.directive('appHeader', function() {
    return {
        restrict: 'E',
        template: `
            <div class="header">
                <img src="logo.png" alt="Checklist Logo">
                <h1>Hello,</h1>
                <p>Get started by creating your first checklist.</p>
            </div>
        `,
        replace: true
    };
});

app.controller("TodoController", function ($scope, $http) {
    // Load todos from localStorage or fetch initial data
    $scope.loadTodos = function () {
        let storedTodos = localStorage.getItem("todos");
        if (storedTodos) {
            $scope.todos = JSON.parse(storedTodos);
        } else {
            $http
                .get("https://jsonplaceholder.typicode.com/todos")
                .then(function (response) {
                    $scope.todos = response.data.slice(0, 20);
                    localStorage.setItem("todos", JSON.stringify($scope.todos));
                })
                .catch(function (error) {
                    console.error("Error fetching initial data:", error);
                });
        }
    };

    // Initialize todos
    $scope.loadTodos();

    // Add new todo
    $scope.addTodo = function () {
        if ($scope.newTodo) {
            let newTodo = {
                id: Date.now(), // Generate a unique id based on timestamp
                title: $scope.newTodo,
                completed: false,
            };

            $http
                .post("https://jsonplaceholder.typicode.com/todos", newTodo)
                .then(function (response) {
                    response.data.id = newTodo.id; // Ensure the ID is set correctly
                    $scope.todos.push(response.data);
                    localStorage.setItem("todos", JSON.stringify($scope.todos));
                    $scope.newTodo = "";
                })
                .catch(function (error) {
                    console.error("Error adding new todo:", error);
                });
        }
    };

    // Toggle completed status
    $scope.toggleCompleted = function (todo) {
        todo.completed = !todo.completed;
        localStorage.setItem("todos", JSON.stringify($scope.todos));
    };

    // Remove todo
    $scope.removeTodo = function (id) {
        $http
            .delete(`https://jsonplaceholder.typicode.com/todos/${id}`)
            .then(function (response) {
                $scope.todos = $scope.todos.filter(function (todo) {
                    return todo.id !== id;
                });
                localStorage.setItem("todos", JSON.stringify($scope.todos));
            })
            .catch(function (error) {
                console.error("Error removing todo:", error);
            });
    };
});
