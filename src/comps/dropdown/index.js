/* eslint-disable jsx-a11y/anchor-is-valid */
import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import axios from 'axios';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example(props) {
    
    function callWork(goblinid, job){
        axios({
            method: 'post',
            url: `https://node-express-vercel-eight.vercel.app/work/${goblinid}`,
            data: {"token": cookies.get('refreshToken'), "job": job},
            config: { headers: {"Content-Type": "application/json", 'Access-Control-Allow-Origin': '*'}}
          }).then(function (response) {
            console.log(response);
          }).catch(function (response) {
            console.log(response);
          });
    }

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
          Options
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className=" absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none whitespace-nowrap">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button href="#" onClick={()=>callWork(props.goblinid,"woodcutting")} className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',' block px-4 py-2 text-sm w-full')}>
                  Collect Wood 
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button href="#" className={classNames(active ? 'bg-gray-100 text-gray-900' : 'text-gray-700','block  px-4 py-2 text-sm w-full')}>
                  Kill Goblin
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
