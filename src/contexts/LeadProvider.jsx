import { useState, useEffect,  createContext} from "react";
import AddLeadForm from "../components/LeadForm";
import EditLeadForm from "../components/EditLeadForm";

const LeadContext = createContext();

const LeadProvider = ({ children }) => {
    const [leads, setLeads] = useState(null);
    const [filteredLeads, setFilteredLeads] = useState(null);
    const [sortedLeads, setSortedLeads] = useState(null);
    const [updatedLeadData, setUpdatedLeadData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [displayAddNewLeadForm, setDisplayAddNewLeadForm] = useState(false);
    const [displayUpdateLeadForm, setDisplayUpdateLeadForm] = useState(false);
     useEffect(() => {
        setLoading(true);
        fetch("https://anvaya-crm-backend-mu.vercel.app/leads")
        .then((response) => {
            if (! response.ok) {
                throw new Error("Failed to fetch leads");
            }
            return response.json();
        })
        .then((responseData) => {
            setLeads(responseData);
        })
        .catch((error) => {
            console.error('Error: ', error);
        })
        .finally(() => {
            setLoading(false);
        })
     }, []);

     useEffect(() => {
        setLoading(true);
        fetch("https://anvaya-crm-backend-mu.vercel.app/leads/filter")
        .then((response) => {
            if (! response.ok) {
                throw new Error("Failed to fetch leads");
            }
            return response.json();
        })
        .then((responseData) => {
            setFilteredLeads(responseData);
        })
        .catch((error) => {
            console.error('Error: ', error);
        })
        .finally(() => {
            setLoading(false);
        })
     }, []);

     return (
        <LeadContext.Provider value={{ leads, 
        setLeads, 
        loading, 
        setLoading, 
        displayAddNewLeadForm, 
        setDisplayAddNewLeadForm,
        filteredLeads,
        setFilteredLeads,
        sortedLeads,
        setSortedLeads,
        updatedLeadData,
        setUpdatedLeadData,
        displayUpdateLeadForm,
        setDisplayUpdateLeadForm,
        error,
        setError
        }}>
            {displayAddNewLeadForm && <AddLeadForm/>}
            {displayUpdateLeadForm && <EditLeadForm/>}
            {(!displayAddNewLeadForm && !displayUpdateLeadForm) && [children]}
        </LeadContext.Provider>
     )
}

export default LeadProvider;
export { LeadContext };