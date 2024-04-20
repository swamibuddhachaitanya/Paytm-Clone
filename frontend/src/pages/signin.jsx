import { useNavigate } from "react-router-dom"
import { BottomWarning } from "../components/BottomWarning"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import axios from "axios"
import { useState } from "react"

export default function Signin() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");

    return(
        <div className="h-screen bg-slate-300 flex justify-center">

            <div className="flex flex-col justify-center">

            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">

            <Heading label={"Sign In"}/>
            <SubHeading label={"Enter your credentials to access your account"}/>
            <InputBox onChange={(e)=>{
                setUsername(e.target.value);
            }}
             label={"Email"} placeholder={"shukla.sanatani@gmail.com"}/>
            
            <InputBox onChange={(e)=>{
                setPassword(e.target.value);
            }} 
            label={"Password"} placeholder={"********"}/>

            <div className="pt-4">
                <Button onClick={async ()=>{
                    const response = await axios.post("http://localhost:3000/api/v1/user/signin",{
                        username: username,
                        password: password
                    });
                    localStorage.setItem("token",response.data.jwt);
                    navigate("/dashboard");
                }}
                label={"Sign in"}/>
                
            </div>
            <BottomWarning label={"Dont have an account?"} buttonText={"Sign up"} to={"/signup"}/>
            </div>
            </div>
        </div>
    )
}