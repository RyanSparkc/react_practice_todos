import { useState } from 'react';
import { apiUsersSignUp } from '../api/index';
import { NavLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // {{ edit_1 }}

function SignUp() {
  const navigate = useNavigate();
  // 新增狀態管理
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [pwd, setPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  // 新增錯誤狀態管理
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [pwdError, setPwdError] = useState('');

  // 新增 Email 格式驗證正則表達式
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // 新增 Toast 設定
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  // 處理註冊提交
  const handleSignUp = async () => {
    // 檢查暱稱是否有值
    if (!name.trim()) {
      setNameError('暱稱不能為空。');
      return;
    }

    // 檢查密碼長度
    if (pwd.length < 6) {
      setPwdError('密碼必須至少六個字符。');
      return;
    }

    // 檢查密碼是否一致
    if (pwd !== confirmPwd) {
      setPwdError('密碼不一致！');
      return;
    }

    try {
      const response = await apiUsersSignUp({ email, nickname: name, password: pwd });
      console.log(response);
      if (response.data.status) {
        // 顯示 Toast 成功訊息
        Toast.fire({ 
          icon: 'success',
          title: '註冊成功!'
        });
        // 使用 router 跳轉
        navigate('/signin');
      }
    } catch (error) {
      console.error(error);
      // 顯示 Toast 錯誤訊息
      Toast.fire({
        icon: 'error',
        title: '註冊失敗',
        text: error.response?.data?.message || '請檢查您的網路連線或稍後再試',
      });
    }
  };

  return (
    <>
      <div id="signUpPage" className="bg-yellow">
        <div className="conatiner signUpPage vhContainer">
          <div className="side">
            <a href="#">
              <img className="logoImg" src="https://upload.cc/i1/2022/03/23/rhefZ3.png" alt=""></img>
            </a>
            <img className="d-m-n" src="https://upload.cc/i1/2022/03/23/tj3Bdk.png" alt="workImg"></img>
          </div>
          <div>
            <form className="formControls" onSubmit={(e) => { e.preventDefault(); handleSignUp(); }}>
              <h2 className="formControls_txt">註冊帳號</h2>

              <label className="formControls_label" htmlFor="email">Email</label>
              <input 
                className="formControls_input" 
                type="text" 
                id="email" 
                name="email" 
                placeholder="請輸入 email" 
                required 
                value={email} 
                onChange={(e) => { 
                  setEmail(e.target.value);
                  if (emailRegex.test(e.target.value)) {
                    setEmailError('');
                  } else {
                    setEmailError('請輸入有效的電子郵件地址。');
                  }
                }} 
              />
              {emailError && <span className="error">{emailError}</span>}

              <label className="formControls_label" htmlFor="name">您的暱稱</label>
              <input 
                className="formControls_input" 
                type="text" 
                name="name" 
                id="name" 
                placeholder="請輸入您的暱稱"
                value={name} 
                onChange={(e) => { 
                  setName(e.target.value);
                  if (e.target.value.trim()) {
                    setNameError('');
                  } else {
                    setNameError('暱稱不能為空。');
                  }
                }} 
              />
              {nameError && <span className="error">{nameError}</span>}

              <label className="formControls_label" htmlFor="pwd">密碼</label>
              <input 
                className="formControls_input" 
                type="password" 
                name="pwd" 
                id="pwd" 
                placeholder="請輸入密碼" 
                required 
                value={pwd} 
                onChange={(e) => { 
                  setPwd(e.target.value);
                  if (e.target.value.length >= 6) {
                    setPwdError('');
                  } else {
                    setPwdError('密碼必須至少六個字符。');
                  }
                }} 
              />
              {pwdError && <span className="error">{pwdError}</span>}

              <label className="formControls_label" htmlFor="confirmPwd">再次輸入密碼</label>
              <input 
                className="formControls_input" 
                type="password" 
                name="confirmPwd" 
                id="confirmPwd" 
                placeholder="請再次輸入密碼" 
                required 
                value={confirmPwd} 
                onChange={(e) => { 
                  setConfirmPwd(e.target.value);
                }} 
              />
              {/* 即時確認密碼一致性 */}
              {pwd !== confirmPwd && confirmPwd && (
                <span className="error">密碼不一致</span>
              )}

              <input 
                className="formControls_btnSubmit" 
                type="submit" 
                value="註冊帳號" 
                // 可選：禁用提交按鈕，直到所有驗證通過
                // disabled={!emailRegex.test(email) || !name.trim() || pwd.length < 6 || pwd !== confirmPwd}
              />
              <NavLink className="formControls_btnLink" to="/signin">登入</NavLink>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignUp