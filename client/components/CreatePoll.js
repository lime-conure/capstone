import React, {Component} from 'react'
import {NavLink, Link} from 'react-router-dom'
import BooksView from './BooksView'
import axios from 'axios'
import Calendar from 'react-input-calendar'
import Popup from 'reactjs-popup'
import Search from './Search'
import apiKey from '../secrets.js'

class CreatePoll extends Component {
  constructor() {
    super()
    this.state = {
      open: false,
      description: 'loading...',
      searchResults: [],
      selectedBooks: [],
      selectedDates: [],
      selectedPlaces: [],
      title: '',
      notes: '',
      dueDate: null,
      searchValue: '',
      date: '',
      time: '',
      place: ''
    }
    this.createPoll = this.createPoll.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.addBook = this.addBook.bind(this)
    this.addDateTime = this.addDateTime.bind(this)
    this.addPlaces = this.addPlaces.bind(this)
    this.onCalendarChange = this.onCalendarChange.bind(this)
    this.setResults = this.setResults.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }
  onCalendarChange(date) {
    const dueDate = new Date(
      Number(date.slice(6, 10)),
      Number(date.slice(0, 2)),
      Number(date.slice(3, 5))
    )
    this.setState({
      dueDate: dueDate
    })
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  setResults = results => {
    this.setState({searchResults: results})
  }

  getDescription = bookId => {
    const requestUri =
      `https://cors-anywhere.herokuapp.com/` +
      `https://www.goodreads.com/book/show/${bookId}?key=${apiKey}`
    axios
      .get(requestUri)
      .then(res => {
        const parser = new DOMParser()
        const XMLResponse = parser.parseFromString(res.data, 'application/xml')

        const parseError = XMLResponse.getElementsByTagName('parsererror')

        if (parseError.length) {
          this.setState({
            error: 'There was an error fetching results.'
          })
        } else {
          let description = XMLResponse.getElementsByTagName('description')[0]
            .innerHTML

          description = description.replace('<![CDATA[', '').replace(']]>', '')

          if (!description) {
            description = 'No description found.'
          }
          this.setState({description})
        }
      })
      .catch(error => {
        this.setState({
          error: error.toString()
        })
      })
  }

  handleClick(e, bookId) {
    e.preventDefault()
    this.getDescription(bookId)
    this.setState({open: true})
  }

  closeModal() {
    this.setState({open: false, description: 'loading...'})
  }

  async createPoll(e) {
    e.preventDefault()
    try {
      const {
        selectedBooks,
        selectedDates,
        selectedPlaces,
        title,
        dueDate,
        notes
      } = this.state
      const newPoll = {
        selectedBooks,
        selectedDates,
        selectedPlaces,
        title,
        dueDate,
        notes
      }
      await axios.post(
        `/api/clubs/${this.props.match.params.clubId}/polls`,
        newPoll
      )
      this.props.history.push(`/clubs/${this.props.match.params.clubId}/polls`)
    } catch (err) {
      console.error(err)
    }
  }

  addDateTime(e) {
    e.preventDefault()
    const {time, date} = this.state
    const dateTime = new Date(
      Number(date.slice(0, 4)),
      Number(date.slice(5, 7)) - 1,
      Number(date.slice(8, 10)),
      Number(time.slice(0, 2)),
      Number(time.slice(3, 5))
    )
    this.setState({
      selectedDates: [...this.state.selectedDates, dateTime],
      date: '',
      time: ''
    })
  }

  addPlaces(e) {
    e.preventDefault()
    this.setState({
      selectedPlaces: [...this.state.selectedPlaces, this.state.place],
      place: ''
    })
  }

  addBook(e, book) {
    e.preventDefault()

    const newBook = {
      author: book.best_book.author,
      goodReadsId: book.best_book.id,
      title: book.best_book.title,
      imageUrl: book.best_book.image_url,
      smallImageUrl: book.best_book.small_image_url,
      pubDate:
        book.original_publication_month +
        '-' +
        book.original_publication_day +
        '-' +
        book.original_publication_year,
      rating: Math.round(book.average_rating * 100)
    }
    this.setState({
      selectedBooks: [...this.state.selectedBooks, newBook]
    })
  }

  deleteOption(idx, method, e) {
    e.preventDefault()
    if (method === 'book') {
      this.setState({
        selectedBooks: this.state.selectedBooks.filter(
          book => book !== this.state.selectedBooks[idx]
        )
      })
    }
    if (method === 'place') {
      this.setState({
        selectedPlaces: this.state.selectedPlaces.filter(
          place => place !== this.state.selectedPlaces[idx]
        )
      })
    }
    if (method === 'date') {
      this.setState({
        selectedDates: this.state.selectedDates.filter(
          date => date !== this.state.selectedDates[idx]
        )
      })
    }
  }

  render() {
    return (
      <div>
        <form>
          <h3>Create a New Poll</h3>
          <div>
            <label htmlFor="title"> Title</label>
            <input name="title" onChange={this.handleChange} required />
          </div>
          <br />
          <div>
            <label htmlFor="notes">Notes</label>
            <input name="notes" onChange={this.handleChange} />
          </div>
          <br />
          {/* select dueDate */}
          <div>
            <label htmlFor="dueDate">Due Date</label>
            <Calendar
              format="MM-DD-YYYY"
              date={this.state.dueDate}
              name="dueDate"
              onChange={this.onCalendarChange}
            />
          </div>
          <br />
          {/* select books */}
          <div>
            <label>Add Book Options</label>
            <Search setResults={this.setResults} />
            <br />

            {this.state.searchResults.length ? (
              <div>
                {this.state.searchResults.map(bookResult => (
                  <div key={bookResult.best_book.id}>
                    <Popup
                      open={this.state.open}
                      closeOnDocumentClick
                      onClose={this.closeModal}
                      position="right center"
                    >
                      <div className="modal">
                        <a className="close" onClick={this.closeModal}>
                          &times;
                        </a>
                        <div className="header">
                          {' '}
                          {bookResult.best_book.title}
                        </div>
                        <p>{this.state.description}</p>
                        <img src={bookResult.best_book.small_image_url} />
                        <div className="actions">
                          <button className="button">
                            <a
                              href={`https://www.goodreads.com/book/show/${
                                bookResult.best_book.id
                              }`}
                              target="_blank"
                            >
                              View more in goodreads.com
                            </a>
                          </button>
                        </div>
                      </div>
                    </Popup>
                    <img
                      onClick={e =>
                        this.handleClick(e, bookResult.best_book.id)
                      }
                      src={bookResult.best_book.small_image_url}
                    />
                    <p>{bookResult.best_book.title}</p>
                    <p>{bookResult.best_book.author.name}</p>
                    <button onClick={e => this.addBook(e, bookResult)}>
                      Add a book
                    </button>
                    <br />
                  </div>
                ))}
                <br />
                <div>
                  {this.state.selectedBooks.length ? (
                    <div>
                      <h4>Added books:</h4>
                      {this.state.selectedBooks.map((book, idx) => (
                        <div key={book.idx}>
                          <img src={book.smallImageUrl} />
                          <p>{book.title}</p>
                          <button
                            onClick={e => this.deleteOption(idx, 'book', e)}
                          >
                            X
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
          <br />
          {/* select dates */}
          <div>
            <label htmlFor="date">Add Date/Time Options</label>
            <input
              name="date"
              placeholder="yyyy/mm/dd"
              value={this.state.date}
              onChange={this.handleChange}
            />
            <input
              name="time"
              placeholder="hh:mm"
              value={this.state.time}
              onChange={this.handleChange}
            />
            <button
              disabled={!this.state.date || !this.state.time}
              onClick={this.addDateTime}
              type="submit"
            >
              Add Date/Time
            </button>

            <br />
            <div>
              {this.state.selectedDates.length
                ? this.state.selectedDates.map((date, idx) => (
                    <div key={idx}>
                      <p>{date.toString()}</p>
                      <button
                        onClick={e => this.deleteOption(idx, 'date', e)}
                        type="submit"
                      >
                        X
                      </button>
                    </div>
                  ))
                : null}
            </div>
          </div>

          <br />
          {/* select location */}
          <div>
            <label htmlFor="place">Add Location Options</label>
            <input
              name="place"
              placeholder="Type a location..."
              value={this.state.place}
              onChange={this.handleChange}
            />
            <button
              disabled={!this.state.place}
              onClick={this.addPlaces}
              type="submit"
            >
              Add Location
            </button>
            <br />
            <div>
              {this.state.selectedPlaces.length
                ? this.state.selectedPlaces.map((place, idx) => (
                    <div key={idx}>
                      <p>{place}</p>
                      <button
                        type="button"
                        onClick={e => this.deleteOption(idx, 'place', e)}
                      >
                        X
                      </button>
                    </div>
                  ))
                : null}
            </div>
          </div>

          <br />
          <button
            type="submit"
            onClick={this.createPoll}
            disabled={!this.state.title}
          >
            Create Poll
          </button>
        </form>
      </div>
    )
  }
}

export default CreatePoll
