import '../styles/style.css'
import Header from "./Header";
import React from "react";

function ErrorPage() {
    return (
        <div className="sections-container">
          <Header />
            <div className="section" id="right-bar">Right Bar</div>
            <div className="section" id="center">
                <div>Error 404: Page not found</div>
            </div>
            <div className="section" id="left-bar">Left Bar</div>
            <div className="section" id="footer">Footer</div>
        </div>
    );
}

export default ErrorPage;