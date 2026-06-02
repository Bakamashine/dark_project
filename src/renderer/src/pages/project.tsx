import { useParams } from "react-router-dom";

export default function Project() {
    const {project} = useParams<{project: string}>();
    return (
        <p>Project page</p>
    )
}