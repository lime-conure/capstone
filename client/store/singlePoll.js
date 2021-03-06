import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_SINGLE_POLL = 'GET_SINGLE_POLL'
const UPDATE_VOTES = 'UPDATE_VOTES'

/**
 * INITIAL STATE
 */
const defaultPoll = {
  poll: {},
  // allOptions is an array of option objects:
  // { option: { id: 1,... }, numVotes: 1, votes: [{ userId: 1 }] }
  allOptions: []
}

/**
 * ACTION CREATORS
 */
const getSinglePoll = poll => ({
  type: GET_SINGLE_POLL,
  poll
})

const updateOptionVotes = payload => ({
  type: UPDATE_VOTES,
  payload
})

/**
 * THUNK CREATORS
 */
export const fetchSinglePoll = (clubId, pollId) => async dispatch => {
  try {
    const {data} = await axios.get(`/api/clubs/${clubId}/polls/${pollId}`)
    dispatch(getSinglePoll(data || defaultPoll))
  } catch (err) {
    console.error(err)
  }
}

export const sendVotes = ({
  userId,
  clubId,
  pollId,
  votes
}) => async dispatch => {
  try {
    const {data} = await axios.put(`/api/clubs/${clubId}/polls/${pollId}`, {
      votes
    })
    dispatch(updateOptionVotes({userId, optionIds: data}))
  } catch (err) {
    console.error(err)
  }
}

// optionIds = [3, 6]
const voteForOptions = (state, optionIds, userId) => {
  return state.allOptions.map(optionObj => {
    const voteUserIds = optionObj.votes.map(vote => vote.userId)
    const voting = optionIds.includes(optionObj.option.id)
    const alreadyVoted = voteUserIds.includes(userId)
    if (voting && !alreadyVoted) {
      // add the new vote
      // prevent users from voting multiple times for the same option
      optionObj.numVotes++
      optionObj.votes.push({userId})
    } else if (!voting && alreadyVoted) {
      // remove the vote
      optionObj.numVotes--
      const voteIndex = voteUserIds.indexOf(userId)
      optionObj.votes.splice(voteIndex, 1)
    }
    return optionObj
  })
}

/**
 * REDUCER
 */
export default function(state = defaultPoll, action) {
  switch (action.type) {
    case GET_SINGLE_POLL: {
      return action.poll
    }
    case UPDATE_VOTES: {
      // action.payload.optionIds is an array of optionIds that you voted for
      // e.g. [3, 6]
      const updatedOptions = voteForOptions(
        {...state},
        action.payload.optionIds,
        action.payload.userId
      )
      return {...state, allOptions: updatedOptions}
    }
    default:
      return state
  }
}
