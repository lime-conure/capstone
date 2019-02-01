import React, {Component} from 'react'

// Material UI
import {withStyles} from '@material-ui/core/styles'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    marginTop: theme.spacing.unit * 2
  },
  gridList: {
    width: 660,
    height: 350
  }
})

class BookList extends Component {
  render() {
    const {books, classes} = this.props
    if (books.length) {
      return (
        <div>
          <div className={classes.root}>
            <GridList cellHeight={240} cols={4} className={classes.gridList}>
              {books.map(bookResult => (
                <GridListTile cols={1} key={bookResult.best_book.id}>
                  <img
                    src={bookResult.best_book.image_url}
                    alt={bookResult.best_book.title}
                  />
                  <GridListTileBar
                    title={bookResult.best_book.title}
                    subtitle={
                      <span>by: {bookResult.best_book.author.name}</span>
                    }
                    actionIcon={
                      <IconButton
                        onClick={e => this.props.addBook(e, bookResult)}
                      >
                        <Icon>add_circle</Icon>
                      </IconButton>
                    }
                  />
                </GridListTile>
              ))}
            </GridList>
          </div>
        </div>
      )
    } else {
      return <div />
    }
  }
}

export default withStyles(styles)(BookList)