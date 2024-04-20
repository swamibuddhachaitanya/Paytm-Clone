import { useEffect, useMemo, useState } from "react";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import axios from "axios";

export function Dashboard() {
    const [userBalance, setUserBalance] = useState(0);

    useEffect(() => {
        axios.get("http://localhost:3000/api/v1/account/balance", {
            headers: {
                'Authorization': "Bearer " + localStorage.getItem("token")
            }
        })
        .then((res) => {
            setUserBalance(res.data.balance);
        })
        .catch((error) => {
            console.error("Error fetching balance:", error);
        });
    }, [setUserBalance]);

    return (
        <div>
            <Appbar/>
            <Balance balance={userBalance}/>
            <Users/>
        </div>
    );
}
