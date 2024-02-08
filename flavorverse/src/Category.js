import React from "react";
import "./Category.css";
import { GiCupcake } from "react-icons/gi";
import { LuSalad } from "react-icons/lu";
import { GiMeat } from "react-icons/gi";
import { LuSoup } from "react-icons/lu";

function Category() {
    return (
        <div className="category flex-row">
            <button>
                <LuSalad />
                <p>Salad</p>
            </button>
            <button>
                <GiMeat />
                <p>Meat</p>
            </button>
            <button>
                <LuSoup />
                <p>Soup</p>
            </button>
            <button>
                <GiCupcake />
                <p>Dessert</p>
            </button>
        </div>
    );
}

export default Category;

