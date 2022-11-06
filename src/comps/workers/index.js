import React, { useEffect, useState } from "react"
import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies();


const Workers = ({children, active}) => {
    const [theArray, setTheArray] = useState([0,0]);

    useEffect(() => {
        axios({
            method: 'post',
            url: 'https://node-express-vercel-eight.vercel.app/MyWorkers',
            data: {"token": cookies.get('refreshToken')},
            config: { headers: {"Content-Type": "application/json", 'Access-Control-Allow-Origin': '*'}}
          }).then(function (response) {
            if(!response) return;
            let ownedWorkers = response.data.sendoff;
            let cringe = [];
            for (let i = 0; i < ownedWorkers.length; i++) {
                console.log(i);
                cringe.push(ownedWorkers[i])
                //setTheArray(ownedWorkers[i]);
            }
            setTheArray(cringe);
          }).catch(function (response) {

          });
    }, []);

    return (
        <>
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                      <th scope="col" className="py-3 px-6">
                          Worker ID
                      </th>
                      <th scope="col" className="py-3 px-6">
                          Level
                      </th>
                      <th scope="col" className="py-3 px-6">
                          EXP
                      </th>
                      <th scope="col" className="py-3 px-6">
                          Power
                      </th>
                      <th scope="col" className="py-3 px-6">
                          Action
                      </th>
                  </tr>
              </thead>
              
              {theArray.map(worker => 
                      <tbody>
                      <tr className="bg-gray-50 border-b dark:bg-gray-800 dark:border-gray-700 text-center">
                          <th className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white ">
                          {worker.id}
                          </th>
                          <td className="py-4 px-6">
                          {worker.level}
                          </td>
                          <td className="py-4 px-6">
                          {worker.exp}
                              </td>
                          <td className="py-4 px-6">
                          {worker.power}
                          </td>
                          <td className="py-4 px-6">
                              <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Kill</a>
                          </td>
                      </tr>
                      </tbody>
              )}
          </table>
        </div>
        </>
    )
}

export default Workers