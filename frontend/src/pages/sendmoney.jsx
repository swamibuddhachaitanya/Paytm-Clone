import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
export default function SendMoney() {
    
    const [searchParams] = useSearchParams();
    const id= searchParams.get("id");
    const name = searchParams.get("name");
    const [amount, setAmount] = useState(0);
    const navigate= useNavigate();
    
    return (
        <div className="bg-[rgb(243,244,246)] h-screen flex justify-center">
            <div className="h-full flex flex-col justify-center ">

                <div className="text-card-foreground border h-min max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg ">
                    
                    <div className="flex flex-col space-y-1.5 p-1">
                        <h2 className="text-3xl font-bold text-center">SendMoney</h2>
            
                    </div>

                    <div className="p-6" >

                        <div className="flex items-center space-x-4">

                            <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">

                                <div className="text-2xl text-white">{name[0].toUpperCase()}</div>
                                
                            </div>
                            <h3 className="text-2xl font-semibold">
                                    {name}
                                </h3>    
                        </div>
                        <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:opacity-70 peer-disabled:cursor-not-allowed" htmlFor="amount">Amount(in Rs)
                            </label>

                            <input onChange={(e)=>{
                                setAmount(e.target.value);
                            }} 
                            type="number" id="amount" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Enter Amount" />
                        </div>
                        <button onClick={()=>{
                            axios.post("http://localhost:3000/api/v1/account/transfer",{
                                to: id,
                                amount
                            },{
                                headers:{
                                    Authorization: "Bearer " + localStorage.getItem("token")
                                }
                            })
                            navigate("/success");
                        }} 
                        className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-black text-white">
                            Initiate Transfer 
                        </button>
                    </div>
                    </div>  

                    
                    </div>
                
                </div>
        </div>
    )
}