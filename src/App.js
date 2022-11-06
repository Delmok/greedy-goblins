import './App.css';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Tab from './comps/tab';
import axios from 'axios';
import truncateEthAddress from 'truncate-eth-address'
import Cookies from 'universal-cookie';

const randomString = generateRandomID(32);
const cookies = new Cookies();
let templogin = null;



const App = () =>{
  const [loggedin, setloggedin] = useState(null);
  const [Eggs, setEggs] = useState(0);
  const [Workers, setWorkers] = useState(0);
  const [Wood, setWood] = useState(0);
  const [Address, setAddress] = useState('Goblin King');
//SELECT * FROM users WHERE address='0x3258033547e20C6aF4890D8d86B3F81AB672B1F2'
//'Access-Control-Allow-Origin'
if (cookies.get('refreshToken')){
  templogin = cookies.get('refreshToken');
}

const tabContent = [{
  title:"Stats",
  content: 
      <div className="grid grid-cols-1 text-gray-900 dark:text-white text-center">
          <div className="flex flex-col">
              <div className="mb-2 text-3xl font-extrabold">{Eggs}</div>
              <div className="font-light text-gray-500 dark:text-gray-400">Eggs</div>
          </div>
          <div className="flex flex-col">
              <div className="mb-2 text-3xl font-extrabold">{Workers}</div>
              <div className="font-light text-gray-500 dark:text-gray-400">Workers</div>
          </div>
          <div className="flex flex-col">
              <div className="mb-2 text-3xl font-extrabold">{Wood}</div>
              <div className="font-light text-gray-500 dark:text-gray-400">Wood</div>
          </div>
      </div>
},{
  title:"Worker",
  content: //
   
    <div className=' grid gap-4'>        
      <div className="grid grid-cols-1 text-white text-center">
        <div className="flex flex-col w-full bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
          <div className="mb-2 text-3xl font-extrabold">{Workers}</div>
          <div className="font-light text-gray-500 dark:text-gray-400">Available Workers</div>
        </div>      
      </div>
      <div className="grid text-white text-center">
        <div className="flex flex-col w-full bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
          <div className="mb-2 text-3xl font-extrabold">{Workers}</div>
          <div className="font-light text-gray-500 dark:text-gray-400">Collecting Wood</div>
          <a href="#" className=" items-center py-2 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Collect Wood</a>
        </div>
      </div> 
     </div>
}];

  checkCookies();
  useEffect(() => {

    if(templogin) return;

    axios({
      method: 'post',
      url: 'https://node-express-vercel-eight.vercel.app/GenerateUser',
      data: {"nonce": randomString, "signature": "temps", "address": "temp"},
      config: { headers: {"Content-Type": "application/json", 'Access-Control-Allow-Origin': '*'}}
    }).then(function (response) {
      if(!response) return;
      if(!templogin){
        templogin = response.data.token;
        updateStats();
        checkCookies();
      }else{
        updateStats();
        checkCookies();
      };
    }).catch(function (response) {
      console.log(response.data['data']);
    });

  },[]);

  useEffect(() => {
    updateStats();
    setAddress(templogin);
  },[]);

  async function checkCookies(){
    if(!templogin) return;
    if (cookies.get('refreshToken')){
      cookies.set('refreshToken', `${cookies.get('refreshToken')}`, { path: '/' });
    }else{
      cookies.set('refreshToken', `${templogin}`, { path: '/' });
    }
  }
  async function updateCookies(){
    if(!templogin) return;
    cookies.set('refreshToken', `${templogin}`, { path: '/' });
  }
  async function updateStats(){
    axios({
      method: 'post',
      url: 'https://node-express-vercel-eight.vercel.app/getStats',
      data: {"token": templogin},
      config: { headers: {'Content-Type': 'multipart/form-data'}}
    }).then(function (res) {
      setEggs(res.data.sendoff.eggs);
      setWorkers(res.data.sendoff.goblins);
      setWood(res.data.sendoff.wood);
      setAddress(res.data.sendoff.address);
    }).catch(function (res) {
      console.log(res);
    });
  }
  async function connect() {
    if (!window.ethereum) return;
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(`${randomString}`);
    const address = await signer.getAddress();

    await axios({
      method: 'post',
      url: 'https://node-express-vercel-eight.vercel.app/Authenticate',
      data: {"nonce": randomString, "signature": signature, "address": address},
      config: { headers: {'Content-Type': 'multipart/form-data' }}
    })
    .then(function (response) {
      templogin = response.data.token;
      if(!templogin) return;
      updateCookies();
      setloggedin(true);
      updateStats();

    })
    .catch(function (response) {
        //handle error
    });
  }
  async function verifyCreds(){
    await axios({
      method: 'post',
      url: 'https://node-express-vercel-eight.vercel.app/GenerateUser',
      data: {"nonce": randomString, "signature": "temp", "address": "temp"},
      config: { headers: {'Content-Type': 'multipart/form-data'}}
    })
    .then(function (response) {
      //updateStats();
    })
    .catch(function (response) {
        //handle error
    });
  }
  async function collectEggs(){
    await axios({
      method: 'post',
      url: 'https://node-express-vercel-eight.vercel.app/collectEggs',
      data: {"token": templogin},
      config: { headers: {'Content-Type': 'multipart/form-data'}}
    })
    .then(function (response) {
      console.log(response);
      //updateStats();
    })
    .catch(function (response) {
        //handle error
    });
  }
  
  return (

    <div className=' bg-gray-900 w-screen min-h-screen grid place-items-center'>
      <div className='p-4 max-w-5xl grid gap-4'>

        <h1 className='text-4xl font-extrabold text-center text-white drop-shadow-2xl'> Greedy Goblins</h1>
        <div className="w-full bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
          <div className="flex justify-end px-4 pt-4">

          {loggedin === null && <button  onClick={async () => { await connect() }}className="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Connect</button>}
          {loggedin !== null && <button  onClick={async () => { await collectEggs() }}className="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Verify</button>}
          </div>
          <div className="flex flex-col items-center pb-10">
            <img className="mb-3 w-24 h-24 rounded-full shadow-lg" src="https://www.meeplemountain.com/wp-content/uploads/2019/06/dimble.jpg" alt="goglim"/>
            {Address === null && <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{Address}</h5>}
            {Address !== null && <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white overflow-hidden">{truncateEthAddress(Address)}</h5>}
            <span className="text-sm text-gray-500 dark:text-gray-400">Gold Owned: <b>10</b></span>
            <div className="flex mt-4 space-x-3 md:mt-6">
              <a href="#" className="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Crack Egg</a>
              
            </div>
          </div>
        </div>
        <Tab active={0}>
        {tabContent.map((tab, idx) => (
        <Tab.TabPane key={`Tab-${idx}`} tab={tab.title}>
          <div className='p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800 content-center'>
            {tab.content}
          </div>
        </Tab.TabPane>))}
      </Tab>
      </div>
    </div>
  );
}
function generateRandomID(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
export default App;
