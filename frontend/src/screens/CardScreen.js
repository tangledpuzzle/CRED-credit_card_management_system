import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Card, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { LinkContainer } from 'react-router-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';

import { useSelector, useDispatch } from 'react-redux';
import Loader from 'react-spinners/PuffLoader';
import { getCardById } from '../actions/cardActions';
import { getRecentStatements } from '../actions/statementActions';
import AlertMessage from '../components/AlertMessage';
import CreditCard2 from '../components/CreditCard2';
import ModalForm from '../components/ModalForm';
import Dropdown from '../components/Dropdown';
import TransactionTable from '../components/TransactionTable';

const getMonthsArr = (year) => {
  let d = new Date();
  let monthsArr = [];
  if (year === d.getFullYear().toString()) {
    const l = d.getMonth() + 1;
    monthsArr = Array.from({ length: l }, (x, i) => {
      const month = i + 1;
      return month <= 9 ? '0' + month : month;
    });
  } else if (!year) {
    monthsArr = [];
  } else {
    monthsArr = Array.from({ length: 12 }, (x, i) => {
      const month = i + 1;
      return month <= 9 ? '0' + month : month;
    });
  }
  return monthsArr;
};

const getYearsArr = () => {
  const currentYear = new Date().getFullYear();
  const yearsArr = Array.from({ length: 20 }, (_x, i) => currentYear - i);
  return yearsArr;
};

const CardScreen = (props) => {
  const { match, history } = props;

  const cardId = match.params.id;
  // console.log(cardId);

  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');

  const recentStatements = useSelector((state) => state.recentStatements);
  const { statements, loading: loadingStatements } = recentStatements;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const cardDetails = useSelector((state) => state.cardDetails);
  const { card, error, loading } = cardDetails;

  // console.log(userLogin);
  // console.log(card);

  useEffect(() => {
    if (!userInfo) {
      // console.log('Not Logged In');
      history.push('/login');
    } else {
      // console.log('Dispatch');
      if (card.cardNumber) {
        dispatch(getRecentStatements(card.cardNumber, 3));
      } else {
        dispatch(getCardById(cardId));
      }
    }
  }, [userInfo, history, cardId, dispatch, card]);

  const parseAmount = (amount) => {
    if (amount || amount === 0) {
      let temp = amount.toString();
      if (temp.indexOf('.') === -1) {
        // no precision
        temp += '.00';
      }
      return temp;
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      {loading ? (
        <Loader color={'#333940'} />
      ) : error ? (
        <AlertMessage variant="danger">{error}</AlertMessage>
      ) : (
        <Row>
          <Col className="responsive-col-1">
            <h2 className="text-center" style={{ marginTop: '2rem' }}>
              Card Details
            </h2>
            <div className="checking" style={{ marginTop: '2rem' }}>
              <CreditCard2 card={card} />
            </div>
            <Card
              bg="dark"
              text="white"
              className="mx-auto text-center responsive-card"
            >
              <Card.Body>
                <Card.Title> Outstanding Amount </Card.Title>
                <Card.Text className="responsive-text">
                  {`₹ ${parseAmount(card.outstandingAmount)}`}
                </Card.Text>
                <Button
                  className="btn btn-outline-success"
                  style={
                    card.outstandingAmount === 0
                      ? { cursor: 'not-allowed' }
                      : {}
                  }
                  disabled={card.outstandingAmount === 0}
                  onClick={handleShowModal}
                >
                  Pay Now
                </Button>
                <ModalForm
                  handleClose={handleCloseModal}
                  show={showModal}
                  card={card}
                  cardId={cardId}
                ></ModalForm>
              </Card.Body>
            </Card>
          </Col>
          <Col className="responsive-col-2">
            <div
              style={{ marginLeft: '1rem', marginRight: '1rem' }}
              className="text-center"
            >
              <h2 style={{ marginTop: '2rem' }}>Recent Transactions</h2>
              {loadingStatements ? (
                <Loader color={'#333940'} />
              ) : (
                <>
                  <TransactionTable transactions={statements} />
                </>
              )}
              <h2 style={{ marginTop: '2rem' }}>Statement By Month</h2>
              <Row style={{ width: '70%', margin: '1rem auto' }}>
                <Col md={4}>
                  <Dropdown
                    value={year}
                    handleChange={(e) => setYear(e.target.value)}
                    label="Year"
                    data={getYearsArr()}
                  />
                </Col>
                <Col md={4}>
                  <Dropdown
                    value={month}
                    handleChange={(e) => setMonth(e.target.value)}
                    label="Month"
                    data={getMonthsArr(year)}
                  />
                </Col>

                <Col md={4}>
                  <LinkContainer
                    to={`/cards/${cardId}/statements/${parseInt(
                      year
                    )}/${parseInt(month)}`}
                  >
                    <Button
                      className="btn btn-outline-info"
                      disabled={!month || !year ? true : false}
                    >
                      Get
                    </Button>
                  </LinkContainer>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      )}
    </>
  );
};

export default CardScreen;
