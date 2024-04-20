

export function Balance({balance}) {

  return(
    <div className="shadow h-14 flex justify-between">
        <div className="flex">
            <div className="flex flex-col justify-center h-full font-bold mr-1 ml-6"> Your Balance is</div>
            <div className="flex flex-col justify-center h-full font-bold mr-4"> ₹{balance}</div>
        </div>
    </div>
  )  
}