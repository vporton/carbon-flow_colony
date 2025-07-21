import Flow2 from "@/components/Flow2";

export default function Flow0(params: {parentId: number}) {
    return Flow2({...params, childId: undefined});
}
