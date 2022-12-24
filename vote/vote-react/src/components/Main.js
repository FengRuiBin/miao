
import { NavLink, Route, Redirect } from "react-router-dom";
import Create from "./Create"
import MyVotes from "./MyVotes"

export default function Main() {
  return (
    <div>
      <Route path="/main" exact>
        <Redirect to="/main/create" />
      </Route>
      <Route path="/main/create" component={Create} />
      <Route path="/main/myvotes" component={MyVotes} />
      <nav>
        <NavLink to="/main/create">新建</NavLink>
        {" | "}
        <NavLink to="/main/myvotes">我的</NavLink>
      </nav>
    </div>
  )
}