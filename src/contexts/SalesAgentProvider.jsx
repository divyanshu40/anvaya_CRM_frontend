import { useState, useEffect, createContext } from "react";
import SalesAgentForm from "../components/SalesAgentForm";

const SalesAgentContext = createContext();

const SalesAgentProvider = ({children}) => {
    const [salesAgents, setSalesAgents] = useState(null);
    const [displayAddNewAgentForm, setDisplayAddNewAgentForm] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetch("https://anvaya-crm-backend-omega.vercel.app/salesAgents")
        .then((response) => {
            if (! response.ok) {
                throw new Error("failed to fetch sales agents");
            }
            return response.json();
        })
        .then((responseData) => {
            setSalesAgents(responseData);
        })
        .catch((error) => {
            console.error('Error: ', error);
        })
    }, []);
    return (
        <SalesAgentContext.Provider value={{ salesAgents, setSalesAgents, setDisplayAddNewAgentForm, message, setMessage}}>
            {displayAddNewAgentForm ? <SalesAgentForm/> : [children]}
        </SalesAgentContext.Provider>
    )
}

export default SalesAgentProvider;
export { SalesAgentContext };