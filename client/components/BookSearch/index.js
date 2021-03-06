import React, {Component} from 'react'
import BookList from './BookList'
import Search from './Search'
import BookResults from './BookResults'

class BookSearch extends Component {
  constructor() {
    super()
    this.state = {
      results: []
    }
    this.setResults = this.setResults.bind(this)
  }

  setResults = results => {
    this.setState({results})
  }

  render() {
    const {
      type,
      bookList,
      addBook,
      removeBook,
      hideBookActions,
      hideSearch
    } = this.props

    return (
      <div>
        <BookList
          type={type}
          bookList={bookList}
          removeBook={removeBook}
          addBook={addBook}
          hideBookActions={hideBookActions}
        />
        {!hideSearch && <Search setResults={this.setResults} />}
        <BookResults
          type={type}
          results={this.state.results}
          addBook={addBook}
          setResults={this.setResults}
        />
      </div>
    )
  }
}

export default BookSearch
