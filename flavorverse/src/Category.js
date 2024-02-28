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
                <LuSalad size={20} />
                <p>Salad</p>
            </button>
            <button>
                <GiMeat size={20} />
                <p>Meat</p>
            </button>
            <button>
                <LuSoup size={20} />
                <p>Soup</p>
            </button>
            <button>
                <GiCupcake size={20} />
                <p>Dessert</p>
            </button>
        </div>
    );
}

export default Category;

