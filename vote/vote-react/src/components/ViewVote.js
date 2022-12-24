// 投票查看及交互页面
import axios from "axios"
import { useParams } from "react-router-dom"
import { useAxios } from "../hooks/Hook"
import _ from "lodash"

export default function ViewVote() {
  var { voteId } = useParams()

  var { loading, data, error, update } = useAxios({ url: '/vote/' + voteId })

  // 为某个选项投票或取消投票
  async function voteOption(option) {
    var { optionId } = option
    axios.post(`/vote/${voteId}/option/${optionId}`)
  }

  if (loading) return 'Loading...'
  var groupedVotes = _.groupBy(data.userVotes, 'optionId')
  var uniqueUserCount = _.uniqBy(data.userVotes, 'userId')
  return (
    <div>
      <h1>查看投票</h1>
      <h2>{data.vote.title}</h2>
      <h3>{data.vote.desc}</h3>
      <ul>
        {
          data.options.map(option => {
            var thisOptionVotes = groupedVotes[option.optionId] || []
            return (
              <li onClick={() => voteOption(option)} key={option.optionId}>
                {option.content} [{thisOptionVotes.length}票] [{(thisOptionVotes.length / uniqueUserCount * 100).toFixed(2)}%]
                {
                  thisOptionVotes.map(oneVote => {
                    return <span style={{ display: 'inline-block', border: '2px, solid', margin: '2px' }}>{oneVote.userId}</span>
                  })
                }
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}