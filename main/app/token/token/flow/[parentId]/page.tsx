import Flow from "@/components/Flow";
import { Button } from "@mui/material";
import { ethers } from "ethers";
import { useState } from "react"
import DatePicker from "react-datepicker";

export default function Flow0(params: {parentId: number}) {
    return Flow({...params, childId: undefined});
}
