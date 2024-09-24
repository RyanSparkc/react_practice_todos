import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'; 

function Todo() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState('');
  const [activeFilter, setActiveFilter] = useState('全部');
  const { VITE_API } = import.meta.env;

  // 新增 Toast 設定
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
    },
  });

  const getTodos = useCallback(async () => {
    try {
      const res = await axios.get(`${VITE_API}/todos`);
      const { data } = res.data;
      setTodos(data);
      console.log(data);
    } catch (err) {
      alert(err.response.data.message);
    }
  }, [VITE_API]);

  // 修改任務狀態
  const apiPatchTodos = async (id) => {
    try {
      const res = await axios.patch(`${VITE_API}/todos/${id}/toggle`, {});
      // 更新狀態
      Toast.fire({
        icon: 'success',
        title: res.data.message,
      });
      getTodos();
      console.log(res);
    } catch (err) {
      alert(err.response.data.message);
    }
  };
  // 新增任務
  const addTodo = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${VITE_API}/todos/`, {
        content,
      });
      console.log(res.data);
      Toast.fire({
        icon: 'success',
        title: '新增成功',
      });
      setContent('');
      getTodos();
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
      alert(err.response.data.message);
    }
  };

  // 清除已完成任務
  // todo.status = true
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
      // 用 for 去選到 todo.status true ���項目 一一刪除
      for (let i = 0; i < filterTodos.length; i++) {
        const res = await axios.delete(
          `${VITE_API}/todos/${filterTodos[i].id}`
        );
        console.log(res);
      }
      Toast.fire({
        icon: 'success',
        title: '清除已完成項目',
      });
      getTodos();
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  // 登出
  const logout = (e) => {
    e.preventDefault();
    document.cookie =
      'React-Token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    Toast.fire({
      icon: 'success',
      title: '登出成功',
    });
    navigate('/signin');
  };
  // 驗證
  const apiUsersCheckout = async () => {
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('React-Token='))
      ?.split('=')[1];
    axios.defaults.headers.common['Authorization'] = cookieValue;
    try {
      const res = await axios.get(`${VITE_API}/users/checkout`, {
        headers: {
          Authorization: cookieValue,
        },
      });
      setUserName(res.data.nickname);
    } catch (err) {
      Toast.fire({
        icon: 'error',
        title: err.response.data.message,
      });
      navigate('/signin');
    }
  };

  useEffect(() => {
    apiUsersCheckout();
    getTodos();
  }, [VITE_API, getTodos, navigate]);

  useEffect(() => {
    console.log(activeFilter);
  }, [activeFilter]);

  return (
    <>
      <div id="todoListPage" className="bg-half">
        <nav>
          <h1>
            <a href="#">ONLINE TODO LIST</a>
          </h1>
          <ul>
            <li className="todo_sm">
              <a href="#">
                <span>{userName}</span>
              </a>
            </li>
            <li>
              <a href="#loginPage" onClick={logout}>
                登出
              </a>
            </li>
          </ul>
        </nav>
        <div className="conatiner todoListPage vhContainer">
          <div className="todoList_Content">
            <div className="inputBox">
              <input
                type="text"
                placeholder="請輸入待辦事項"
                value={content}
                onChange={(e) => setContent(e.target.value.trim())}
              ></input>
              <a href="#" onClick={addTodo}>
                <i className="fa fa-plus"></i>
              </a>
            </div>
            {todos.length === 0 ? (
              <div className="empty">
                <p>目前尚無待辦事項</p>
                <img src="/images/empty.png" alt="目前尚無待辦事項" />
              </div>
            ) : (
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
                                  /* 處理完成狀態改變 */
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
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Todo;
