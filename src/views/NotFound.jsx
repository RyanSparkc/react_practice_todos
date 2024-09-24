import { NavLink } from 'react-router-dom'
function NotFound() {
  return (
    <>
      <div id="notFoundPage" className="bg-yellow">
        <div className="d-flex">
          <div className="conatiner notFoundPage vhContainer">
            <div className="">
              <h1>NotFound</h1>
              <NavLink to="/">回首頁</NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotFound