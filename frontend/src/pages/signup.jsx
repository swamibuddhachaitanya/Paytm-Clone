import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { Button } from "../components/Button";
import axios from "axios";
import { BottomWarning } from "../components/BottomWarning";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup(){
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    return (
        <div className="bg-slate-300 h-screen flex justify-center"> 
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                
                    <Heading label={"Sign up"}/>
                    <SubHeading label={"Enter your Information to create an account"}/>
                    <InputBox onChange={(e)=>{
                        setFirstName(e.target.value);
                    }}
                    label={"First Name"} placeholder={"Himanshu"}/>

                    <InputBox onChange={(e)=>{
                        setLastName(e.target.value);
                    }}
                     label={"Last Name"} placeholder={"Shukla"}/>
                    
                    
                    <InputBox onChange={(e)=>{
                        setUsername(e.target.value);
                    }} 
                    label={"Email"} placeholder={"shukla.sanatani@gmail.com"}/>
                    
                    <InputBox onChange={(e)=>{
                        setPassword(e.target.value);
                    }}
                    label={"Password"} placeholder={"J@iShreeRam"}/>
                    <div className="pt-4">

                    <Button onClick={async function(){
                        axios.post("http://localhost:3000/api/v1/user/signup",{
                            username: username,
                            firstName: firstName,
                            lastName: lastName,
                            password: password
                        }).then((res)=>{
                            localStorage.setItem("token",res.data.token);
                        navigate("/dashboard");
                        })
                        
                    }} 
                    label={"Sign up"} />
                    </div>
                    <BottomWarning label={"Already have an account?"} buttonText={"Sign in"} to={"/signin"}/>
                    
                </div>
            </div>
            </div>
    )
}