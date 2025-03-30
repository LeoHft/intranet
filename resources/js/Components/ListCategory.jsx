import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import ModifyCategoryForm from "@/Components/ModifyCategoryForm";
import Modal from './Modal';

export default function ListCategory() {
    const [categoriesList, setCategoriesList] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showModalModifyCategory, setShowModalModifyCategory] = useState(false);
    const [showModalDeleteCategory, setShowModalDeleteCategory] = useState(false);


    useEffect(() => {
        axios.get('/api/getCategories')
            .then(response => {
                setCategoriesList(response.data);
            })
            .catch(error => {
                console.error("Error fetching categories:", error);
            });
    }, []);

    const ModifyCategory = (category) => {
        setSelectedCategory(category);
        setShowModalModifyCategory(true); 
    }

    const DeleteCategoryShow = (category) => {
        setSelectedCategory(category);
        setShowModalDeleteCategory(true);
    }

    const DeleteCategory = (e) => {
        e.preventDefault();
        axios.delete(`/api/deleteCategory/${selectedCategory.id}`)
            .then(response => {
                console.log("Category deleted successfully:", response.data);
                setCategoriesList(categoriesList.filter(cat => cat.id !== selectedCategory.id));
                setShowModalDeleteCategory(false);
            })
            .catch(error => {
                console.error("Error deleting category:", error);
            });
    }

    return (
        <>
        <table className="table-auto border-collapse border border-gray-400 w-full">
            <thead className="bg-gray-200">
                <tr className="border border-gray-400">
                    <th className="border border-gray-400 px-4">Nom</th>
                    <th className="border border-gray-400 px-4">Description</th>
                    <th className="border border-gray-400 px-4">Date d'ajout</th>
                    <th className="border border-gray-400 px-4">Date de modification</th>
                    <th className="border border-gray-400 px-4">Actions</th>
                </tr>
            </thead>
            <tbody>
                {categoriesList.length > 0 ? (
                    categoriesList.map(category => (
                        <tr key={category.id} className="border border-gray-400">
                            <td className="border border-gray-400 px-4">{category.Name}</td>
                            <td className="border border-gray-400 px-4">{category.Description}</td>
                            <td className="border border-gray-400 px-4">{category.created_at}</td>
                            <td className="border border-gray-400 px-4">{category.updated_at}</td>
                            <td className="flex gap-2 content-center items-center justify-center py-1">
                                <SecondaryButton onClick={() => ModifyCategory(category)}>Modifier</SecondaryButton>
                                <DangerButton onClick={() => DeleteCategoryShow(category)}>Supprimer</DangerButton>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3" className="text-center py-4">
                            Aucune catégorie trouvée.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>

        {showModalModifyCategory && (
            <ModifyCategoryForm
                category={selectedCategory}
                onClose={() => setShowModalModifyCategory(false)}
            />
        )}

        <Modal show={showModalDeleteCategory} onClose={() => setShowModalDeleteCategory(false)}>
            <form onSubmit={DeleteCategory} className="mt-6 p-6 space-y-6">
                <h1 className="text-lg font-medium text-gray-900">
                    Supprimer une catégorie
                </h1>
                <p>Êtes-vous sûr de vouloir supprimer la catégorie "{selectedCategory?.Name}" ?</p>
                <div className="flex gap-2 justify-end">
                    <SecondaryButton onClick={() => setShowModalDeleteCategory(false)}>Annuler</SecondaryButton>
                    <DangerButton type="submit">Supprimer</DangerButton>
                </div>
            </form>
        </Modal>

        </>
    );
}
