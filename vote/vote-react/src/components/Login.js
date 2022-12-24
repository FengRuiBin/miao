
import axios from "axios"
import { useHistory } from "react-router-dom"
import { useInput } from "../hooks/Hook"



export default function Login() {
  var name = useInput()
  var password = useInput()
  var history = useHistory()

  async function login() {
    var info = {
      name: name.value,
      password: password.value
    }
    try {
      var data = (await axios.post('/account/login', info, {
        withCredentials: true
      })).data
      history.goBack()
    } catch (e) {
      alert(data.msg)
    }
    console.log(data.result)
  }
  return (
    <div>
      <div>用户名：</div>
      <input type="text" {...name} />
      <div>密码：</div>
      <input type="password" {...password} />
      <div><button onClick={login}>登录</button></div>
    </div>
  )
}
