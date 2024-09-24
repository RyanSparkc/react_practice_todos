import PropTypes from 'prop-types';
import axios from 'axios';

function TodoList({ todos, getTodos, activeFilter, setActiveFilter, VITE_API, Toast }) {
  // 修改任務狀態
  const apiPatchTodos = async (id) => {
    try {
      const res = await axios.patch(`${VITE_API}/todos/${id}/toggle`, {});
      Toast.fire({
        icon: 'success',
        title: res.data.message,
      });
      getTodos();
      console.log(res);
    } catch (err) {
      Toast.fire({
        icon: 'error',
        title: err.response.data.message,
      });
    }
  };

  // 清除單一任務
  const apiDeleteTodos = async (id) => {
    try {
      const res = await axios.delete(`${VITE_API}/todos/${id}`);
      console.log(res);
      Toast.fire({
        icon: 'success',
        title: res.data.message,
      });
      getTodos();
    } catch (err) {
      Toast.fire({
        icon: 'error',
        title: err.response.data.message,
      });
    }
  };

  // 清除已完成任務
  const apiDeleteCompletedTodos = async (e) => {
    e.preventDefault();
    try {
      const filterTodos = todos.filter((todo) => todo.status);
      if (filterTodos.length === 0) {
        Toast.fire({
          icon: 'warning',
          title: '目前沒有已完成任務',
        });
        return;
      }
      for (let i = 0; i < filterTodos.length; i++) {
        await axios.delete(`${VITE_API}/todos/${filterTodos[i].id}`);
      }
      Toast.fire({
        icon: 'success',
        title: '清除已完成項目',
      });
      getTodos();
    } catch (err) {
      Toast.fire({
        icon: 'error',
        title: err.response.data.message,
      });
    }
  };

  return (
    <div className="todoList_list">
      <ul className="todoList_tab">
        <li>
          <a
            href="#"
            className={activeFilter === '全部' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              setActiveFilter('全部');
              getTodos();
            }}
          >
            全部
          </a>
        </li>
        <li>
          <a
            href="#"
            className={activeFilter === '待完成' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              setActiveFilter('待完成');
              getTodos();
            }}
          >
            待完成
          </a>
        </li>
        <li>
          <a
            href="#"
            className={activeFilter === '已完成' ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              setActiveFilter('已完成');
              getTodos();
            }}
          >
            已完成
          </a>
        </li>
      </ul>
      <div className="todoList_items">
        <ul className="todoList_item">
          {Array.isArray(todos) &&
            todos
              .filter((todo) => {
                if (activeFilter === '全部') return true;
                if (activeFilter === '待完成') return !todo.status;
                if (activeFilter === '已完成') return todo.status;
              })
              .map((todo) => (
                <li key={todo.id}>
                  <label className="todoList_label">
                    <input
                      className="todoList_input"
                      type="checkbox"
                      checked={todo.status}
                      onChange={() => {
                        apiPatchTodos(todo.id);
                      }}
                    ></input>
                    <span>{todo.content}</span>
                  </label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      apiDeleteTodos(todo.id);
                    }}
                  >
                    <i className="fa fa-times"></i>
                  </a>
                </li>
              ))}
        </ul>
        <div className="todoList_statistics">
          <p>
            {Array.isArray(todos)
              ? todos.filter((todo) => !todo.status).length
              : 0}{' '}
            個待完成項目
          </p>
          <a href="#" onClick={apiDeleteCompletedTodos}>
            清除已完成項目
          </a>
        </div>
      </div>
    </div>
  );
}

TodoList.propTypes = {
  todos: PropTypes.array.isRequired,
  getTodos: PropTypes.func.isRequired,
  activeFilter: PropTypes.string.isRequired,
  setActiveFilter: PropTypes.func.isRequired,
  VITE_API: PropTypes.string.isRequired,
  Toast: PropTypes.func.isRequired,  // 將 object 改為 func
};

export default TodoList;