
import {Link} from "react-router-dom"

export function BottomWarning({label, buttonText, to}) {
    return (
        <div className="py-2 font-medium text-sm flex justify-center">
            <div>{label}</div>
            <Link className="pointer underline pl-1 cursor-pointer font-medium" to={to}>{buttonText}</Link>
        </div>
    )
}