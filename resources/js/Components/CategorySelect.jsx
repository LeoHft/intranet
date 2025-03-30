import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";


export default function CategorySelect({ selectedCategories, setSelectedCategories }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get("/api/getCategories")
        .then((response) => {
            setCategories(response.data.map((category) => ({
                value: category.id,
                label: category.Name,
            })));
        }).catch((error) => {
            console.error("Error fetching categories:", error);
        });
    },  []);

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">Catégorie(s)</label>
            <Select
                options={categories}
                isMulti
                className="mt-1 block w-full"
                value={selectedCategories}
                onChange={setSelectedCategories}
                placeholder="Sélectionnez des catégories..."
                styles={{
                    menu: base => ({ ...base, maxHeight: "150px", overflowY: "auto" }) // Limite la hauteur et permet le scroll                    
                }}
            />
        </div>

    );

}
