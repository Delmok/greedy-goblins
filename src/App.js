import './App.css';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Tab from './comps/tab';
import axios from 'axios';
const tabContent = [{
  title:"test",
  content: "testtesttesttesttesttesttesttesttesttest1"

},{
  title:"test2",
  content: "testtesttesttesttesttesttesttesttesttest2"

},{
  title:"test3",
  content: "testtesttesttesttesttesttesttesttesttest3"

},{
  title:"test4",
  content: "testtesttesttesttesttesttesttesttesttest3"

},{
  title:"test5",
  content: "testtesttesttesttesttesttesttesttesttest3"

},{
  title:"test6",
  content: "testtesttesttesttesttesttesttesttesttest3"

},
]
let templogin = null;
let toggle = false;

function generateRandomID(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const App = () =>{
  const [globalCoords, setGlobalCoords] = useState({x: 0, y: 0});
  const [offset, setoffset] = useState({x: 0, y: 0});
  const [trueoffset, settrueoffset] = useState({x: 0, y: 0});
  const [tempoffset, settempoffset] = useState({x: 0, y: 0});
  const [loggedin, setloggedin] = useState(null);


  async function connect() {
    if (!window.ethereum) return;
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const randomString = generateRandomID(32);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const signature = await signer.signMessage(`${randomString}`);
    const address = await signer.getAddress();

    await axios({
      method: 'post',
      url: 'http://127.0.0.1:6767/Authenticate',
      data: {"nonce": randomString, "signature": signature, "address": address},
      config: { headers: {'Content-Type': 'multipart/form-data' }}
    })
    .then(function (response) {
      templogin = response.data.token;
      if(!templogin) return;
      setloggedin(true);
    })
    .catch(function (response) {
        //handle error
    });
  }
  async function verifyCreds(){
    await axios({
      method: 'post',
      url: 'http://127.0.0.1:6767/GenerateUser',
      data: {"token": templogin},
      config: { headers: {'Content-Type': 'multipart/form-data'}}
    })
    .then(function (response) {
    })
    .catch(function (response) {
        //handle error
    });
  }
  useEffect( () => {
    const handleWindowMouseMove = event => {
      setGlobalCoords({
        x: event.screenX,
        y: event.screenY,
      });
      if(toggle === true){
        settrueoffset({
          x: tempoffset.x - (offset.x - globalCoords.x)/ 1.5,
          y: tempoffset.y - (offset.y - globalCoords.y)/ 1.5,
        });

      }
    };
    const handleWindowTouchMove = event => {
      console.log(toggle);
      setGlobalCoords({
        x: event.touches[0].screenX,
        y: event.touches[0].screenY,
      });
      if(toggle === true){
        settrueoffset({
          x: tempoffset.x - (offset.x - globalCoords.x)/ 1.5,
          y: tempoffset.y - (offset.y - globalCoords.y)/ 1.5,
        });
        console.log(trueoffset);
      }
    };
    
    const handlemousedown = event => {
      setoffset({
        x: event.screenX,
        y: event.screenY,
      });
      toggle = true;
    };
    const handletouchdown = event => {
      setoffset({
        x: event.touches[0].screenX,
        y: event.touches[0].screenY,
      });
      toggle = true;
    };
    const handlemouseup = event => {
      
      toggle = false;
      settempoffset({
        x: trueoffset.x,
        y: trueoffset.y,
      });
      //console.log(toggle);
    };

    
    // window.addEventListener('mousemove', handleWindowMouseMove);
    // window.addEventListener('touchmove', handleWindowTouchMove);
    // window.addEventListener('mousedown', handlemousedown);
    // window.addEventListener('touchstart', handletouchdown);
    // window.addEventListener('mouseup', handlemouseup);
    // window.addEventListener('touchend', handlemouseup);

    return () => {
      // window.removeEventListener('mousemove', handleWindowMouseMove);
      // window.removeEventListener('touchmove', handleWindowTouchMove);
      // window.removeEventListener('mousedown', handlemousedown);
      // window.removeEventListener('touchstart', handletouchdown);
      // window.removeEventListener('mouseup', handlemouseup);
      // window.removeEventListener('touchend', handlemouseup);

    };
    
  }, [offset, globalCoords, trueoffset, tempoffset]);

  return (
    <div className=' bg-gray-900 w-screen min-h-screen grid place-items-center'>
      <div className='p-4 max-w-5xl grid gap-4'>

        <h1 className='text-4xl font-extrabold text-center text-white drop-shadow-2xl'> Greedy Goblins</h1>
        <div className="w-full bg-white rounded-lg border border-gray-200 shadow-md dark:bg-gray-800 dark:border-gray-700">
          <div className="flex justify-end px-4 pt-4">

          {loggedin === null && <button  onClick={async () => { await connect() }}className="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Connect</button>}
          {loggedin !== null && <button  onClick={async () => { await verifyCreds() }}className="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Verify</button>}
                        
            <div id="dropdown" className="hidden z-10 w-44 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700">
              <ul className="py-1" aria-labelledby="dropdownButton">
                <li>
                  <a href="./" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Edit</a>
                </li>
                <li>
                  <a href="./" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Export Data</a>
                </li>
                <li>
                  <a href="./" className="block py-2 px-4 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Delete</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col items-center pb-10">
            <img className="mb-3 w-24 h-24 rounded-full shadow-lg" src="https://www.meeplemountain.com/wp-content/uploads/2019/06/dimble.jpg" alt="goglim"/>
            <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">Goblin King</h5>
            <span className="text-sm text-gray-500 dark:text-gray-400">Gold Owned: <b>10</b></span>
            <div className="flex mt-4 space-x-3 md:mt-6">
              <a href="./" className="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add friend</a>
              <a href="./" className="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-gray-900 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700">Message</a>
            </div>
          </div>
        </div>
        <Tab active={1}>
        {tabContent.map((tab, idx) => (
        <Tab.TabPane key={`Tab-${idx}`} tab={tab.title}>
          <div className='p-4 bg-white rounded-lg md:p-8 dark:bg-gray-800'>
            {tab.content}
          </div>
        </Tab.TabPane>))}
      </Tab>
      </div>
    </div>
  );
}


export default App;
