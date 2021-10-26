import React, { useRef } from "react";
import { SORT_BY } from "../../View/Modules/DashBoard/constants";
import Select from "react-select";
import { useDispatch } from "react-redux";
import { sortingOptions } from "../../View/Modules/DashBoard/actions";

const SortTasks = () => {
    let selectOption = Object.values(SORT_BY).map((tag) => ({
        value: tag,
        label: tag,
    }));

    const dispatch = useDispatch();

    const handleChange = (value) => {
        dispatch(sortingOptions(value.value));
    };

    return (
        <div
            style={{
                fontSize: "14px",
                width: "130px",
            }}
        >
            <Select
                className="basic-single"
                classNamePrefix="select"
                name="sortTasks"
                options={selectOption}
                defaultValue={SORT_BY.userTags}
                placeholder={`Sort By`}
                onChange={handleChange}
            />
        </div>
    );
};

export default SortTasks;
