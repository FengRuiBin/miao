import '../styles/Create.css'

import { Link } from "react-router-dom"

export default function Create() {
  return (
    <div>
      <div className="card">
        <Link to="/create-vote">
          <img alt="" className="card-img" />创建单选
        </Link>
      </div>
      <div className="card">
        <Link to="/create-vote?multiple=1">
          <img alt="" className="card-img" />
          创建多选
        </Link>
      </div>
    </div>
  )
}