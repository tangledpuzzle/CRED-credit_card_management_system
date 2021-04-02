import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getStatementsByMonth } from '../actions/statementActions';
import { getCardById } from '../actions/cardActions';
import TransactionTable from '../components/TransactionTable';
import Loader from '../components/Loader';
import Paginate from '../components/Paginate';

const StatementScreen = (props) => {
  const { history, match } = props;

  const dispatch = useDispatch();

  const cardId = match.params.id;
  const year = match.params.year;
  const month = match.params.month;
  const pageNumber = match.params.pageNumber || 1;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const cardDetails = useSelector((state) => state.cardDetails);
  const { card, error, loading } = cardDetails;

  const statementDetails = useSelector((state) => state.statementDetails);
  const {
    statements,
    loading: loadingStatements,
    error: errorStatements,
    pages,
    page,
  } = statementDetails;

  useEffect(() => {
    if (!userInfo) {
      history.push('/login');
    } else {
      if (!card.cardNumber) {
        dispatch(getCardById(cardId));
      } else {
        dispatch(
          getStatementsByMonth(card.cardNumber, year, month, pageNumber)
        );
      }
    }
  }, [history, userInfo, card, cardId, dispatch, year, month, pageNumber]);

  // const paginate = (pageNumber) => {
  //   setCurrentPage(pageNumber);
  // };

  const utils = {
    cardId,
    year,
    month,
  };

  return (
    <>
      <h2 style={{ marginTop: '1.5rem' }}>Statements</h2>
      {loadingStatements ? (
        <Loader color={'#333940'} />
      ) : (
        <>
          <TransactionTable transactions={statements} />
          <Paginate pages={pages} page={page} utils={utils} />
        </>
      )}
    </>
  );
};

export default StatementScreen;
