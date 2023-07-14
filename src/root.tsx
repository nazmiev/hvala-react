import { useLoaderData } from "react-router-dom";
import { useEffect, useState } from "react";
import { getNews } from "./utils";
import Container from "react-bootstrap/Container";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Card from "react-bootstrap/Card";
import InputGroup from "react-bootstrap/InputGroup";
import Form from 'react-bootstrap/Form';
import { ITips } from "./types";
import moment from 'moment';

export async function loader() {
  const tips = await getNews();
  return tips;
}

export default function Root() {
  const tips = useLoaderData() as ITips[];
  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState("2023-07-31");
  const [filteredTips, setFilteredTips] = useState<ITips[]>(tips);
  const [total, setTotal] = useState<number>(0);

  const onChangeStartDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = moment(new Date(e.currentTarget.value)).format('yyyy-MM-DD');
    setStartDate(newDate);
    filterTips();
    console.log('newStartDate: ', newDate);
  };
  
  const onChangeEndDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = moment(new Date(e.currentTarget.value)).format('yyyy-MM-DD');
    setEndDate(newDate);
    filterTips();
    console.log('newEndDate: ', newDate);
  };
  
  const filterTips = () => {
    setFilteredTips(filteredTips.filter(tip => new Date(tip.createdAt) >= new Date(startDate)));
    setFilteredTips(filteredTips.filter(tip => new Date(tip.createdAt) <= new Date(endDate)));
    calcTotal();
    console.log('[ NEW: ]', filteredTips.length);
    filteredTips.map(tip => console.log(tip.createdAt));
  };

  const calcTotal = () => {
    setTotal(filteredTips.reduce((tempSum, tip) => tempSum + tip.summ, 0));
  }

  useEffect(() => {
    calcTotal();
  }, [])

  return (
    <Container fluid="md" className="mb-3 mt-3">
      <ButtonToolbar className="justify-content-between mb-3 mt-3">
        <InputGroup className="mb-3">
          <InputGroup.Text>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"></path>
            </svg>
          </InputGroup.Text>
          <Form.Control type="date" value={startDate} onChange={onChangeStartDate}/>
          <Form.Control type="date" value={endDate} onChange={onChangeEndDate}/>
          <InputGroup.Text>
            Total in period {total}
          </InputGroup.Text>
        </InputGroup>
      </ButtonToolbar>
      {filteredTips.length ? (
        <>
          {filteredTips.map((post: ITips) => (
            <Card className="mb-2" key={post.id}>
              <Card.Body>
                <Card.Title>
                  id: {post.id}
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Summ: {post.summ}
                </Card.Subtitle>
                <Card.Text>
                  Date: {new Date(post.createdAt).toDateString()}<br />
                  Comments: {post.comments ? post.comments : <span>no comments</span>}
                </Card.Text>
              </Card.Body>
            </Card>
          ))}
        </>
      ) : (
        <p>
          <i>No tips</i>
        </p>
      )}
    </Container>
  );
}
