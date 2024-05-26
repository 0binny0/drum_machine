
import {render} from "@testing-library/react";

import {PowerContext} from "../context.jsx"

const PowerContextRender = (ui, {providerProps, ...renderOptions}) => {
    return render(<PowerContext.Provider value={true}>{ui}</PowerContext.Provider>, renderOptions);
}

export {PowerContextRender};