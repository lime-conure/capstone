import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchMeetings, deleteMeeting} from '../store'
import {formatDateDisplay} from '../utils'
import {Link} from 'react-router-dom'

import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    padding: theme.spacing.unit * 4,
    marginTop: theme.spacing.unit * 16,
    marginLeft: theme.spacing.unit * 24,
    marginRight: theme.spacing.unit * 24
  },
  button: {
    marginTop: theme.spacing.unit * 4
  },
  icon: {
    color: '#fff'
  },
  meetingMetadata: {
    display: 'inline',
    paddingLeft: theme.spacing.unit * 2
  }
})

class Meetings extends Component {
  componentDidMount() {
    const clubId = this.props.match.params.clubId
    this.props.fetchMeetings(clubId)
  }
  render() {
    const {classes} = this.props
    const meetings = this.props.meetings
    return (
      <div>
        <Typography variant="h3" component="h3">
          Meetings
        </Typography>
        <Divider />
        <List>
          {meetings.map(meeting => (
            <ListItem button key={meeting.id}>
              <ListItemIcon>
                <Icon className={classes.icon}>event</Icon>
              </ListItemIcon>
              <ListItemText component="div">
                <Typography variant="h5">
                  {meeting.name}
                  {meeting.date ? (
                    <Typography
                      variant="subtitle1"
                      component="span"
                      className={classes.meetingMetadata}
                    >
                      {formatDateDisplay(meeting.date.slice(0, 10), false)} at{' '}
                      {meeting.location}
                    </Typography>
                  ) : (
                    ''
                  )}
                </Typography>
              </ListItemText>
              {this.props.userId === meeting.creatorId && (
                <Tooltip placement="left" title="Delete this Meeting">
                  <ListItemIcon
                    onClick={() =>
                      this.props.deleteMeeting(this.props.clubId, meeting.id)
                    }
                  >
                    <Icon className={classes.icon}>cancel</Icon>
                  </ListItemIcon>
                </Tooltip>
              )}
            </ListItem>
          ))}
        </List>
        <Link to={`/clubs/${this.props.clubId}/createmeeting`}>
          <Button
            type="button"
            variant="contained"
            color="primary"
            size="large"
            className={classes.button}
          >
            Create a New Meeting
          </Button>
        </Link>
      </div>
    )
  }
}

const StyledMeetings = withStyles(styles)(Meetings)

const mapState = state => ({
  meetings: state.meetings,
  userId: state.user.id,
  clubId: state.singleClub.id
})

const mapDispatch = dispatch => ({
  fetchMeetings: clubId => dispatch(fetchMeetings(clubId)),
  deleteMeeting: (clubId, meetingId) =>
    dispatch(deleteMeeting(clubId, meetingId))
})

export default connect(mapState, mapDispatch)(StyledMeetings)
