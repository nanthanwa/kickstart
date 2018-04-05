import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Campaign from '../../../ethereum/campaign';
import Layout from '../../../components/Layout';
import RequestRow from '../../../components/RequestRow';

class RequestIndex extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;
    const campaign = Campaign(address);

    const requestCount = parseInt(await campaign.methods.getRequestsCount().call());
    const approversCount = parseInt(await campaign.methods.approversCount().call());
    const requests = await Promise.all(
      Array(requestCount)
        .fill()
        .map((element, index) => {
        return campaign.methods.requests(index).call();
      })
    );

    return { address, requests, requestCount, approversCount };
  }

  renderRows() {
    return this.props.requests.map((request, index) => {
      return <RequestRow 
        key={index}
        id={index}
        request={request}
        address={this.props.address}
        approversCount={this.props.approversCount}
      />;
    });
  }

  render () {
    const { Header, Row, HeaderCell, Body } = Table;

    return (
      <Layout>
        <Link route={`/campaigns/${this.props.address}`}>
          <a>Back</a>
        </Link>
        <h3>Requests</h3>
        <Link route={`/campaigns/${this.props.address}/requests/new`}>
          <Button primary floated="right" style={{ marginBottom: 10 }}>Add Request</Button>
        </Link>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>
            </Row>
          </Header>
          <Body>
            {this.renderRows()}
          </Body>
        </Table>
        <div>Found {this.props.requestCount} requests.</div>
      </Layout>
    );
  }
}

export default RequestIndex;
