import Flow from "@/components/Flow";
import Flow2 from "@/components/Flow2";
import { Button } from "@mui/material";
import { ethers } from "ethers";
import { useState } from "react"
import DatePicker from "react-datepicker";

export default function Flow0(params: {parentId: number}) {
    return Flow2({...params, childId: undefined});
}
