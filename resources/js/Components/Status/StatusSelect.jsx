import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";


export default function StatusSelect({ selectedStatus, setSelectedStatus }) {
    const [status, setStatus] = useState([]);

    useEffect(() => {
        axios.get("/api/getStatus")
        .then((response) => {
            setStatus(response.data.map((status) => ({
                value: status.id,
                label: status.Name,
            })));
        }).catch((error) => {
            console.error("Error fetching status:", error);
        });
    },  []);

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">Statut</label>
            <Select
                options={status}
                className="mt-1 block w-full"
                value={selectedStatus}
                onChange={setSelectedStatus}
                placeholder="Sélectionnez un satut..."
                styles={{
                    menu: base => ({ ...base, maxHeight: "150px", overflowY: "auto" }) // Limite la hauteur et permet le scroll                    
                }}
            />
        </div>

    );

}
