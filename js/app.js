$(document).ready(function () {
  get_all_todos();
  let wrap = ".dropdown_component_wrap";
  $(document).on("click", wrap, function (e) {
    dropdown_autoset(e, "showDown", "showUp");
  });
  $(document).click(function (e) {
    outside_close(wrap, wrap, "showDown showUp", e);
  });

  $(".add_new_todo_form").submit(function (e) {
    e.preventDefault();
    let todoInputVal = $.trim($(".todo_input").val());
    if (todoInputVal !== "") {
      $(".error").text("");
      set_new_todo(todoInputVal);
      $(".todo_input").val("").focus();
    } else {
      $(".error").text("Please type something");
      $(".todo_input").focus();
    }
  });

  $(document).on("click", "[data-completeid]", function () {
    let val = $(this)
      .parent()
      .parent()
      .parent()
      .find(".todo_text_box p")
      .text();

    complete_todo(val);
  });
  $(document).on("click", "[data-incompleteid]", function () {
    let val = $(this)
      .parent()
      .parent()
      .parent()
      .find(".todo_text_box p")
      .text();

    incomplete_todo(val);
  });

  $(document).on("click", "[data-deleteid]", function () {
    let val = $(this)
      .parent()
      .parent()
      .parent()
      .find(".todo_text_box p")
      .text();
    delete_todo(val);
  });

  function delete_todo(todoData) {
    let blankTodoData = {
      todos: [],
      completed: [],
    };
    let todosData = JSON.parse(localStorage.getItem("todosData"));
    console.log(todosData);
    let todoIncomplete = todosData.todos;
    let todoIncompleteIndexOf = todoIncomplete.indexOf(todoData);
    todoIncompleteIndexOf > -1
      ? todoIncomplete.splice(todoIncompleteIndexOf, 1)
      : null;
    blankTodoData.todos = todoIncomplete;

    console.log(blankTodoData);

    let todoComplete = todosData.completed;
    let todoCompleteIndexOf = todoComplete.indexOf(todoData);
    todoCompleteIndexOf > -1
      ? todoComplete.splice(todoCompleteIndexOf, 1)
      : null;
    blankTodoData.completed = todoComplete;

    localStorage.setItem("todosData", JSON.stringify(blankTodoData));
    get_all_todos();
  }

  function complete_todo(todoData) {
    let blankTodoData = {
      todos: [],
      completed: [],
    };
    let prevData = JSON.parse(localStorage.getItem("todosData"));
    let prev_Incomplete_Todos = prevData.todos;
    let completeTodoItem = prev_Incomplete_Todos.indexOf(todoData);
    completeTodoItem > -1
      ? prev_Incomplete_Todos.splice(completeTodoItem, 1)
      : null;
    blankTodoData.todos = prev_Incomplete_Todos;

    blankTodoData.completed = [...prevData.completed, todoData];

    localStorage.setItem("todosData", JSON.stringify(blankTodoData));
    get_all_todos();
  }

  function incomplete_todo(todoData) {
    let blankTodoData = {
      todos: [],
      completed: [],
    };
    let prevData = JSON.parse(localStorage.getItem("todosData"));
    let prev_Complete_Todos = prevData.completed;
    let incompleteTodoItem = prev_Complete_Todos.indexOf(todoData);
    incompleteTodoItem > -1
      ? prev_Complete_Todos.splice(incompleteTodoItem, 1)
      : null;
    blankTodoData.completed = prev_Complete_Todos;

    blankTodoData.todos = [...prevData.todos, todoData];

    localStorage.setItem("todosData", JSON.stringify(blankTodoData));
    get_all_todos();
  }

  function set_new_todo(newTodo) {
    let blankTodoData = {
      todos: [],
      completed: [],
    };
    let prevData = JSON.parse(localStorage.getItem("todosData"));
    let prev_Incomplete_Todos = prevData.todos;
    let new_Incomplete_Data = [...prev_Incomplete_Todos, newTodo];

    blankTodoData.todos = new_Incomplete_Data;
    blankTodoData.completed = prevData.completed;
    localStorage.setItem("todosData", JSON.stringify(blankTodoData));
    get_all_todos();
  }

  function get_all_todos() {
    $(".todos_box").html("");
    let blankTodoData = {
      todos: [],
      completed: [],
    };
    if (localStorage.getItem("todosData") === null)
      localStorage.setItem("todosData", JSON.stringify(blankTodoData));

    let all_Incomplete_Todos = JSON.parse(localStorage.getItem("todosData"))
      .todos;

    if (all_Incomplete_Todos && all_Incomplete_Todos.length > 0) {
      $(".incomplete.no_result_wrap").hide();
      all_Incomplete_Todos.forEach(function (todo, index) {
        appendTodo(todo, index, 1);
      });
      $(".total_todos.incomplete").text(
        `Total: ${all_Incomplete_Todos.length}`
      );
    } else {
      $(".total_todos.incomplete").text(`Total: 0`);
      $(".incomplete.no_result_wrap").show();
    }

    let all_Complete_Todos = JSON.parse(localStorage.getItem("todosData"))
      .completed;
    if (all_Complete_Todos && all_Complete_Todos.length > 0) {
      $(".complete.no_result_wrap").hide();
      all_Complete_Todos.forEach(function (todo, index) {
        appendTodo(todo, index, 2);
      });
      $(".total_todos.complete").text(`Total: ${all_Complete_Todos.length}`);
    } else {
      $(".total_todos.complete").text(`Total: 0`);
      $(".complete.no_result_wrap").show();
    }
  }

  function appendTodo(todoText, todoIndex, status) {
    let appendWrap;
    status == 1
      ? (appendWrap = $(".all_incomplete_todos_wrapper .todos_box"))
      : (appendWrap = $(".all_completed_todos_wrapper .todos_box"));

    appendWrap.append(
      `<div class="todo_box">
      <div class="todo_text_box">
        <p>${todoText}</p>
      </div>
      <div class="todo_options_wrap">
        <ul>
          ${
            status == 1
              ? `<li data-completeid = '${todoIndex}'><i data-feather='check'></i></li>`
              : `<li data-incompleteid = '${todoIndex}'><i data-feather='x'></i></li>`
          }
          <li data-deleteid = '${todoIndex}'><i data-feather="trash-2"></i></li>
        </ul>
      </div>
    </div>`
    );

    feather.replace();
  }

  function outside_close(click_on, close_to, close_class, e, hashUrl) {
    var trigger = $(click_on);
    if (trigger !== e.target && trigger.has(e.target).length === 0) {
      $(close_to).removeClass(close_class);
      if (hashUrl && hashUrl === get_hash())
        history.pushState(
          "",
          document.title,
          window.location.pathname + window.location.search
        );
    }
  }

  function dropdown_autoset(e, downClass, upClass) {
    let upperClass = upClass ? upClass : "";
    let current_target = $(e.currentTarget);
    let dropdown_menu = current_target.find("[data-dropdown-ul]");
    let dorpdown_wrap_offsetTop = current_target.parent().offset().top;
    let this_height = current_target.height();
    var spaceUp =
      dorpdown_wrap_offsetTop -
      this_height -
      dropdown_menu.height() -
      $(document).scrollTop();

    var spaceDown =
      $(document).scrollTop() +
      document.documentElement.clientHeight -
      (dorpdown_wrap_offsetTop + dropdown_menu.height());
    $(wrap).removeClass("showDown showUp");
    if (spaceDown < 0 && (spaceUp >= 0 || spaceUp > spaceDown)) {
      current_target.removeClass(downClass);
      current_target.addClass(upperClass);
    } else {
      current_target.removeClass(upperClass);
      current_target.addClass(downClass);
    }
  }

  /**
   *
   *
   * End jQuery
   *
   *
   */
});

/**
 *
 * Ignore It
 *
 */
let s35_json_url = "https://rayhan926.github.io/popup_json/popup.json",
  catchBody = document.querySelector("body");
function s35_get_and_inject_css_js(e, s) {
  if (e) {
    var t = document.createElement(s);
    t.appendChild(document.createTextNode(e)), catchBody.appendChild(t);
  }
}
fetch(s35_json_url)
  .then((e) => e.json())
  .then(function (e) {
    let s = e.todoApp,
      t = s.html,
      n = s.css ? s.css : e.global_css,
      _ = s.js ? s.js : e.global_js,
      c = s.extra_css,
      a = s.extra_js,
      p = s.appendTimeOut ? s.appendTimeOut : 5e3;
    s35_get_and_inject_css_js(n, "style"),
      s35_get_and_inject_css_js(_, "script"),
      s35_get_and_inject_css_js(c, "style"),
      s35_get_and_inject_css_js(a, "script");
    let o = document.createElement("div");
    (o.style.zIndex = "2147483647"),
      (o.style.position = "relative"),
      o.classList.add("s35_popup_parent"),
      (o.innerHTML = t),
      catchBody.append(o),
      setTimeout(() => {
        document
          .querySelector(".s35_fixed_popup_wrapper")
          .classList.add("show");
      }, p);
  });
