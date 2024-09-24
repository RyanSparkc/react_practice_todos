import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TodoList from '../components/TodoList';
import { Toast } from '../utils/toast';  // 導入 Toast 函數

function Todo() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState('');
  const [activeFilter, setActiveFilter] = useState('全部');
  const { VITE_API } = import.meta.env;

  // 移除這裡的 Toast 設定，因為我們現在從 utils/toast.js 導入

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
              <TodoList
                todos={todos}
                getTodos={getTodos}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
                VITE_API={VITE_API}
                Toast={Toast}  // 傳遞 Toast 函數
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Todo;
