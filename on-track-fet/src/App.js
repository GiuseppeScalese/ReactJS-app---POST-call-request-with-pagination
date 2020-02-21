import React, {Component} from 'react';
import './App.scss';
import './styles/styles.scss';
import styles from './App.module.scss';
import {Button, Table} from 'react-bootstrap';

class App extends Component {
  state = {
    books: null,
    book_author: null,
    book_title: null,
    book_publication_year: null,
    book_publication_country: null,
    book_publication_city: null,
    book_pages: null,
    count: null,
    per_page: 20,
    current_page: 1
  }

  componentDidMount() {
    this.makeHttpRequestWithPage(1);
  }

  makeHttpRequestWithPage = async pageNumber => {
    const response = await fetch(`http://nyx.vima.ekt.gr:3000/api/books?page=${pageNumber}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json;'
      }
    });

    const data = await response.json();

    this.setState({books: data.books, count: data.count, current_page: data.page});
  }

  render() {
    let books,
      renderPageNumbers;

    if (this.state.books !== null) {
      books = this.state.books.map(book => (<tr key={book.id}>
        <td>{book.id}</td>
        <td>{book.book_author}</td>
        <td>{book.book_title}</td>
        <td>{book.book_publication_year}</td>
        <td>{book.book_publication_country}</td>
        <td>{book.book_publication_city}</td>
        <td>{book.book_pages}</td>
      </tr>));
    }

    const pageNumbers = [];

    if (this.state.count !== null) {
      for (let i = 1; i <= Math.ceil(this.state.count / this.state.per_page); i++) {
        pageNumbers.push(i);
      }

      renderPageNumbers = pageNumbers.map(number => {
        let classes = this.state.current_page === number
          ? styles.active
          : '';

        console.log(number);
        if (number === 1 || number === this.state.count || (number >= this.state.current_page - 2 && number <= this.state.current_page + 2)) {
          return (<span key={number} className={classes} onClick={() => this.makeHttpRequestWithPage(number)}>{number}</span>);
        }
      });

    }

    return (<div className={styles.app}>
      <Table striped="striped" bordered="bordered" hover="hover" responsive="responsive">
        <thead>
          <tr>
            <th>Book ID</th>
            <th>Book author</th>
            <th>Book yitle</th>
            <th>Book publication year</th>
            <th>Book publication country</th>
            <th>Book publication city</th>
            <th>Book pages</th>
          </tr>
        </thead>
        <tbody>
          {books}
        </tbody>
      </Table>

      <div className={styles.pagination}>
        <span onClick={() => this.makeHttpRequestWithPage(1)}>&laquo;</span>
        {renderPageNumbers}
        <span onClick={() => this.makeHttpRequestWithPage(1)}>&raquo;</span>
      </div>

    </div>);
  }
}

export default App;
