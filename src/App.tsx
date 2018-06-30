import * as React from "react";
import { EthRpc, JsonRpc, HttpTransport } from 'emerald-js';
import { BigNumber } from 'bignumber.js';
var contractJson = require("../build/contracts/MetaCoin.json");
import IMetaCoin from "./contract-interfaces/IMetaCoin";
import Contract from './util/Contract';

const metaCoinContract = new Contract(contractJson.abi);

interface IAppState {
  emerald: EthRpc;
  netVersion: any;
  balance: BigNumber;
  truffleContract: IMetaCoin;
}

const endpoint = "http://localhost:8545";
const emeraldJsonRpc = new JsonRpc(new HttpTransport(endpoint));
const emerald = new EthRpc(emeraldJsonRpc);

class App extends React.Component<{}, IAppState> {
  public state: IAppState;

  constructor(props) {
    super(props);
    this.state = {
      emerald,
      netVersion: null,
      balance: null,
      truffleContract: null,
    };
    this.getInfo = this.getInfo.bind(this);
  }

  public async componentWillMount() {
    this.setState({
      truffleContract: null,
    });
  }

  public async getInfo() {
    const data = metaCoinContract.functionToData('getBalance', {addr: "0x627306090abaB3A6e1400e9345bC60c78a8BEf57"});
    const netVersion = await emerald.net.version();
    const balanceResults = await emerald.eth.call({to: contractJson.networks[netVersion].address, data});

    this.setState({
      netVersion,
      balance: new BigNumber(balanceResults)
    });
  }

  public render() {
    return (
      <div>
        <button onClick={this.getInfo}>Get Info</button>
        {this.state.netVersion}
        {this.state.balance && this.state.balance.toString()}
      </div>
    );
  }
}

export default App;
