import { NavLink, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { apiUsersSignIn } from '../api/index'
import Swal from 'sweetalert2'

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

function SignIn() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    try {
      const response = await apiUsersSignIn({
        email: data.email,
        password: data.password,
      })
      console.log(response)
      if (response.data.status) {
        Toast.fire({
          icon: 'success',
          title: '登入成功'
        })
        navigate('/todo')
      }
    } catch (error) {
      Toast.fire({
        icon: 'error',
        title: '登入失敗',
        text: error.response?.data?.message || '請檢查您的帳號或密碼',
      })
    }
  }

  return (
    <>
      <div id="loginPage" className="bg-yellow">
        <div className="conatiner loginPage vhContainer">
          <div className="side">
            <a href="#">
              <img
                className="logoImg"
                src="https://upload.cc/i1/2022/03/23/rhefZ3.png"
                alt=""
              />
            </a>
            <img
              className="d-m-n"
              src="https://upload.cc/i1/2022/03/23/tj3Bdk.png"
              alt="workImg"
            />
          </div>
          <div>
            <form className="formControls" onSubmit={handleSubmit(onSubmit)}>
              <h2 className="formControls_txt">最實用的線上代辦事項服務</h2>
              <label className="formControls_label" htmlFor="email">
                Email
              </label>
              <input
                className="formControls_input"
                type="text"
                id="email"
                {...register('email', { required: true })}
                placeholder="請輸入 email"
              />
              {errors.email && <span>此欄位不可留空</span>}
              <label className="formControls_label" htmlFor="pwd">
                密碼
              </label>
              <input
                className="formControls_input"
                type="password"
                id="pwd"
                {...register('password', { required: true })}
                placeholder="請輸入密碼"
              />
              {errors.password && <span>此欄位不可留空</span>}
              <input
                className="formControls_btnSubmit"
                type="submit"
                value="登入"
              />
              <NavLink className="formControls_btnLink" to="/signup">
                註冊帳號
              </NavLink>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignIn