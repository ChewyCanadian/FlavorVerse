import React, { useState } from "react";
import "./Category.css";
import { IconContext } from "react-icons";
import { GiCupcake } from "react-icons/gi";
import { LuSalad } from "react-icons/lu";
import { GiMeat } from "react-icons/gi";
import { LuSoup } from "react-icons/lu";
import { IoPizzaOutline } from "react-icons/io5";
import { IoFishOutline } from "react-icons/io5";
import { MdOutlineFreeBreakfast } from "react-icons/md";
import { MdOutlineLunchDining } from "react-icons/md";
import { MdDinnerDining } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { FilterQuery } from "./routePaths";

// eslint-disable-next-line react/prop-types
function Category({ updateFilter }) {
    const navigate = useNavigate();
    const location = useLocation();

    const filters = [
        { button: <GiMeat />, name: 'Meat' },
        { button: <IoFishOutline />, name: 'Seafood' },
        { button: <IoPizzaOutline />, name: 'Pasta' },
        { button: <LuSoup />, name: 'Soup' },
        { button: <LuSalad />, name: 'Salad' },
        { button: <MdOutlineFreeBreakfast />, name: 'Breakfast' },
        { button: <MdOutlineLunchDining />, name: 'Lunch' },
        { button: <MdDinnerDining />, name: 'Dinner' },
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

    function clearFilter() {
        updateFilter('');
        navigate(location.pathname + FilterQuery);
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
            <a onClick={clearFilter}>Clear Filter</a>
        </div>
    );
}

export default Category;

