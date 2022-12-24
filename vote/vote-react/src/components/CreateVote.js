import axios from "axios"
import { useImmer } from "use-immer"
import { useInput, useBooleanInput, useQuery } from "../hooks/Hook"
import { useHistory } from "react-router-dom"

export default function CreateVote() {
  var [options, setOptions] = useImmer(['', ''])
  var title = useInput()
  var desc = useInput()
  var deadline = useInput()
  var anonymous = useBooleanInput()
  var history = useHistory()
  var query = useQuery()

  async function create() {
    var vote = {
      title: title.value,
      desc: desc.value,
      options: options,
      deadline: deadline.value,
      anonymous: anonymous.checked,
      multiple: query.get('multiple') === '1' ? true : false
    }
    try {
      var res = await axios.post('/vote', vote)
      var createdVote = res.data.result
      history.push('/view-vote/' + createdVote.voteId)
    } catch (e) {
      throw e
    }
  }

  function remove(idx) {
    setOptions(options => {
      options.splice(idx, 1)
    })
  }

  function setOption(idx, val) {
    setOptions(options => {
      options[idx] = val
    })
  }

  return (
    <div>
      <h1>创建投票</h1>
      <div><input type="text" placeholder="投票标题" {...title} /></div>
      <div><input type="text" placeholder="补充描述(选填)" {...desc} /></div>
      {
        options.map((option, idx) => {
          return <div key={idx}>
            <input type="text" placeholder="选项" value={option} onChange={e => setOption(idx, e.target.value)} />
            <button onClick={() => remove(idx)}>删除</button>
          </div>
        })
      }
      <div><button onClick={() => setOptions(options => { options.push('') })}>添加选项</button></div>
      <div>截止日期:<input type="date" {...deadline} /></div>
      <div>匿名投票:<input type="checkbox" {...anonymous} /></div>
      <div><button onClick={create}>创建投票</button></div>
    </div>
  )
}