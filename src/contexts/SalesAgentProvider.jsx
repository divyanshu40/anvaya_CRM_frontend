import { useState, useEffect, createContext } from "react";
import SalesAgentForm from "../components/SalesAgentForm";

const SalesAgentContext = createContext();

const SalesAgentProvider = ({children}) => {
    const [salesAgents, setSalesAgents] = useState(null);
    const [displayAddNewAgentForm, setDisplayAddNewAgentForm] = useState(false);

    useEffect(() => {
        fetch("https://anvaya-crm-backend-mu.vercel.app/salesAgents")
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
        <SalesAgentContext.Provider value={{ salesAgents, setSalesAgents, setDisplayAddNewAgentForm }}>
            {displayAddNewAgentForm ? <SalesAgentForm/> : [children]}
        </SalesAgentContext.Provider>
    )
}

export default SalesAgentProvider;
export { SalesAgentContext };