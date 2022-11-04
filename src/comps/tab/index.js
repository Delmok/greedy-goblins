import React, { useEffect, useState } from "react"


const Tab = ({children, active}) => {
    const [ActiveTab, setActiveTab] = useState(active);
    const [TabsData, setTabsData] = useState([])

    useEffect(() => {
        let data = [];
        React.Children.forEach(children, element => {
            if(!React.isValidElement(element)) return;

            const {props: {tab, children}} = element;
            data.push({tab, children})
        });
        setTabsData(data);
    }, [children]);

    return (
        <div className=" w-full bg-white rounded-lg border shadow-md dark:bg-gray-800 dark:border-gray-700">
            <ul className="text-sm font-medium text-center text-gray-500 rounded-lg divide-x divide-gray-200 sm:flex dark:divide-gray-600 dark:text-gray-400">
                {
                    TabsData.map(({tab}, idx) => (
                        <li className=" w-full ">
                            <a className={`inline-block p-4 w-full bg-gray-50 hover:bg-gray-100 focus:outline-none dark:bg-gray-700 dark:hover:bg-gray-600 ${idx === ActiveTab ? "active" : ""}`} href='#' onClick={() => setActiveTab(idx)}>
                                {tab}
                            </a>
                        </li>
                    ))
                }
            </ul>
            {TabsData[ActiveTab] && TabsData[ActiveTab].children}
        </div>
    )
}

const TabPane = ({children}) =>{
    return{children}
}

Tab.TabPane = TabPane;

export default Tab