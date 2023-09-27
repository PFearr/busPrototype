import * as React from "react";
import { Routes, Route, Outlet, Link, useLocation } from "react-router-dom";
import "./components/busPreview"
import BusPreview from "./components/busPreview";
import AdminPreview from "./components/busAdmin";
import BusStatus from "./components/busstatus";
import "./css/android.css"
import HelpPage from "./components/helpPage";
export default function App() {
  const [helpPageHTML, setHelpPageHTML] = React.useState(`
  <div style="padding-left: 25px; padding-bottom: 10px; height: 100%;">
  <h1>Loading</h1>
  <div class="loader"></div>
  </div>
  `);
  React.useEffect(() => {
    fetch("/help", {
      method: "POST",
      credentials: "include"
    }).then((res) => {
      // check if json
      res.json().then((data) => {
        setHelpPageHTML(data.html)
      }).catch(()=>{
        console.log("Failed")
      })
    })
  },[])
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<BusPreview />} />
        <Route path="*" element={<BusPreview />} />
      </Route>
      <Route path="/status" element={<Layout />}>
        <Route index element={<BusStatus />} />
        <Route path="*" element={<BusStatus />} />
      </Route>
      <Route path="/help" element={<Layout />}>
        <Route index element={<HelpPage html={helpPageHTML} />} />
        <Route path="*" element={<HelpPage html={helpPageHTML} />} />
      </Route>
      <Route path="/admin/setbus" element={<Layout />}>
        <Route index element={<AdminPreview />} />
        <Route path="*" element={<BusPreview />} />
      </Route>
    </Routes>
  );
}

function Layout() {
  const [drawer, setDrawer] = React.useState(false);
  const [drawerRef, setDrawerRef] = React.useState(null);
  const [isStaff, setIsStaff] = React.useState(false);
  const location = useLocation(); 
  React.useEffect(() => {
    fetch("/isStaff",{
      method: "GET",
      credentials: "include"
    }).then((res) => {
      res.json().then((data) => {
        setIsStaff(data.isStaff)
      })
    })
  },[])
  React.useEffect(() => {
    if (drawerRef) {
      if (drawer) {
        drawerRef.classList.add('open')
      } else {
        drawerRef.classList.remove('open')
      }
    }
  }, [drawer])
  React.useEffect(() => {
    if (drawerRef) {
      setTimeout(() => {
        drawerRef.classList.remove("start")
      }, 500);
    }

  }, [drawerRef])
  React.useEffect(() => {
    setDrawer(false)
  }, [location])

  
  return (
    <div>
      <div className="app-bar">
        <button className="menu" onClick={
          () => {
            setDrawer(!drawer)
          }
        }>
          <svg
            version="1.1"
            id="svg"
            className="group"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 80 50"
            xmlSpace="preserve"
          >
            <rect id="line1" x={0} y={0} rx={3} ry={3} width={80} height={10} />
            <rect x={0} y={20} rx={3} ry={3} width={80} height={10} />
            <rect id="line3" x={0} y={40} rx={3} ry={3} width={80} height={10} />
          </svg>
        </button>
        <div className="app-title">Bus List</div>
      </div>

      <aside style={{
        zIndex: 99999
      }} className="start" ref={
        (el) => {
          setDrawerRef(el)
        }
      }>
        <div className="drawer-header">
          {/* <div className="img-container">
                        <img src="https://pbs.twimg.com/profile_images/853274726734610432/lLOgQznc_400x400.jpg" />
                    </div> */}
          <div className="user-detail">
            {/* <span className="email">ekoputrapratama@gmail.com</span> */}
            <span className="displayName">ATHS Bus List</span>
          </div>
        </div>
        <Link to="/">
          Bus List
        </Link>
        <Link to="/status">
          Bus Status
        </Link>
        {
          import.meta.env.VITE_EnableHelpPage == "true" || import.meta.env.VITE_EnableHelpPage == true ? <Link to="/help">
            Help Page
          </Link> : null
        }
        {
          isStaff ? <Link to="/admin/setbus">
            Admin Page
          </Link> : null

        }
      </aside>

      <Outlet />
    </div>
  );
}


function NoMatch() {
  return (
    <div style={{
      padding: "10px",
    }}>
      <Link to="/" style={{
        color: "black",
        textDecoration: "underline",
      }}><h2>Looks like you went a little to far! How about we go back?</h2></Link>
    </div>
  );
}
