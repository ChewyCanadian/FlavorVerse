import React, { useState } from "react";
import "./Category.css";
import { IconContext } from "react-icons";
import { GiCupcake } from "react-icons/gi";
import { LuSalad } from "react-icons/lu";
import { GiMeat } from "react-icons/gi";
import { LuSoup } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";
import { FilterQuery } from "./routePaths";

// eslint-disable-next-line react/prop-types
function Category({ updateFilter }) {
    const navigate = useNavigate();
    const location = useLocation();

    const filters = [
        { button: <LuSalad />, name: 'Salad' },
        { button: <GiMeat />, name: 'Meat' },
        { button: <LuSoup />, name: 'Soup' },
        { button: <GiCupcake />, name: 'Dessert' },
    ]

    // eslint-disable-next-line no-unused-vars
    const [selectedFilter, setSelectedFilter] = useState('');

    function handleClick(e) {
        e.preventDefault;

        updateFilter(e.toLowerCase());
        navigate(location.pathname + FilterQuery + e.toLowerCase());
        //window.history.replaceState("", "", location.pathname + FilterQuery + e.toLowerCase());
    }

    return (
        <div className="category flex-row">
            {filters.map((filter, index) => (
                <button key={index} onClick={() => handleClick(filter.name)}>
                    <IconContext.Provider value={{ size: 20 }}>
                        {filter.button}
                    </IconContext.Provider>
                    <p>{filter.name}</p>
                </button>
            ))}
        </div>
    );
}

export default Category;

