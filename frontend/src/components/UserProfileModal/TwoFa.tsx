import React, {useEffect, useState } from "react";

// CSS
import "src/styles/playerCardTable.css";
import Button from "../shared/Button";
import { authContentHeader } from "src/functions/utils";
import  QRCode from 'react-qr-code';
import  {useNavigate}  from 'react-router-dom';

interface TwoFaProps {
    twoFaProps: boolean;
}

function TwoFa() {
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [securityCode, setSecurityCode] = useState('');
    const [twoFa, set2fa] = useState(false);

    const navigate = useNavigate();

    const handle2FaButtonClick = () => {
        const apiUrl = process.env.REACT_APP_BACKEND_URL + "/auth/42/2fa";
        fetch(apiUrl, {
            method: "POST",
            headers: authContentHeader(),
        }).then(response => {
            if (!response.ok)
                throw new Error("Failed to enable/disable 2Fa");
            return response.json();})
            .then(data=>{
                if (!twoFa) {
                    const qrURL = data.url;
                    if (!qrURL)
                        throw new Error("Failed to get qrURL");
                    setQrCodeUrl(qrURL);
                }
            }).catch(error => {
            console.log("Error in handle2FaButtonClick", error);

        })
    }


    const handleSubmitCode = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        twoFa ===false ? submitEnable() : submitDisable();
    }

    const submitEnable = () => {
        const code = securityCode;
        const apiUrl = process.env.REACT_APP_BACKEND_URL + "/auth/42/verify2fa";
        fetch(apiUrl, {
            method: "POST",
            headers: authContentHeader(),
            body: JSON.stringify({code})
        }).then(response => {
            if (!response.ok)
                throw new Error("Failed to enable 2Fa");
            return response.json();})
            .then(data=>{
                if (data.success === true){
                    setQrCodeUrl('');
                }
            }).then(() => {
            navigate(`/message/${"success"}/${"2FA is successfully enabled."}`);
        }).catch(error => {
            console.log("Error in handleSubmitCode", error);
        })
    }

    const handleCodeChaneg = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSecurityCode(event.target.value);
    }

    const submitDisable = () => {
        console.log("submitDisable");
    }


    useEffect(() => {
        fetch2FaStateFromDatabase();
    }, [qrCodeUrl]);

    const fetch2FaStateFromDatabase = () => {
        fetch(process.env.REACT_APP_BACKEND_URL + "/auth/42/2fa/state",
            {
                method: "GET",
                headers: authContentHeader()})
            .then(response => response.json())
            .then(data => {
                set2fa(data.twoFa);
            })
            .catch(error => {
                console.error('Error fetching 2FA state:', error);
            });
    };


    return ( <>
            {/*{!qrCodeUrl && <div>*/}
            {!qrCodeUrl && <Button name={twoFa === true? "Disable" : "Enable"} onClick={() => {handle2FaButtonClick()}} />}
            {qrCodeUrl && !twoFa && <form onSubmit={handleSubmitCode}>
                    <p>Please enter security code.</p>
                    <label htmlFor="securityCode"></label>
                    {qrCodeUrl && <QRCode value={qrCodeUrl} size={150} />}
                    <input type="text" id="securityCode" name="securityCode" style={{width:"80px", marginRight: "50px", marginLeft: "57px", marginTop: "50px"}} onChange={handleCodeChaneg} />
                    <button className="btn-dark" type="submit" value={securityCode} style={{width: "80", marginTop: "10px", marginRight: "70px"}}>Submit</button>
            </form>}
   </> );
}




export default TwoFa;
