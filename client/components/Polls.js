import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchPolls} from '../store'
import {NavLink, Link} from 'react-router-dom'

class Polls extends Component {
  // constructor() {
  //   super()
  // }

  componentDidMount() {
    console.log('Polls did mount')
    this.props.fetchPolls(this.props.match.params.clubId)
    console.log(newEl)
  }

  render() {
    const polls = this.props.polls
    console.log('Polls rendered')
    return (
      <div>
        <h2> All Polls:</h2>
        <Link to={`/clubs/${this.props.match.params.clubId}/polls/create`}>
          <button type="button"> Create a New Poll</button>
        </Link>
        <ul>
          {polls.map(poll => (
            <div key={poll.id}>
              <li>
                <Link
                  to={`/clubs/${this.props.match.params.clubId}/polls/${
                    poll.id
                  }`}
                >
                  <p>
                    {poll.title}{' '}
                    {poll.dueDate ? (
                      <span>
                        &ndash; <em>Ends on {poll.dueDate}</em>
                      </span>
                    ) : (
                      ''
                    )}
                  </p>
                </Link>
              </li>
            </div>
          ))}
        </ul>
      </div>
    )
  }
}

const mapState = state => ({
  polls: state.polls
})

const mapDispatch = dispatch => ({
  fetchPolls: clubId => dispatch(fetchPolls(clubId))
})
export default connect(mapState, mapDispatch)(Polls)
