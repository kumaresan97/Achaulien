import * as React from "react";
let img1: any = require("../../Global/Images/logo.svg");
let img2: any = require("../../Global/Images/Logo1.svg");
let img3: any = require("../../Global/Images/image1.svg");
let img4: any = require("../../Global/Images/image2.svg");
let img5: any = require("../../Global/Images/logo2.svg");
import styles from "./Footer.module.scss";
const Maincomponent = () => {
  const [ismobile, setIsmobile] = React.useState(false);
  const handleResponsiveChange = () => {
    setIsmobile(window.innerWidth <= 768);
  };
  React.useEffect(() => {
    handleResponsiveChange();
    window.addEventListener("resize", handleResponsiveChange);
    return () => {
      window.removeEventListener("resize", handleResponsiveChange);
    };
  }, []);
  return (
    <div>
      <div
        className={styles.footerContainer}
        // style={{
        //   //   position: "fixed",
        //   //   bottom: 0,
        //   //   left: 0,
        //   width: "100%",
        //   backgroundColor: "#000",
        //   color: "#fff",
        //   textAlign: "center",
        //   padding: "10px",
        //   //   zIndex: 1000,
        // }}
      >
        {!ismobile ? (
          <div
            // style={{
            //   display: "flex",
            //   justifyContent: "space-between",
            //   alignItems: "center",
            // }}
            className={styles.fullviewSection}
          >
            <div>
              <img src={`${img3}`} alt="" />
            </div>
            <div
              className={styles.copyRights}
              // style={{ display: "flex", gap: "5px", alignItems: "center" }}
            >
              {/* <img src={`${img4}`} alt="" /> */}
              <p
              //   style={{ margin: 0, color: "#ffff" }}
              >
                {" "}
                &copy; 2024 A Chau Lien -All rights reserved.
              </p>
            </div>
            <div
              className={styles.socialLinks}
              // style={{ display: "flex", gap: "10px", alignItems: "center" }}
            >
              <img
                src={`${img1}`}
                alt=""
                title={"instagram"}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  window.open("https://www.instagram.com/achau_lien/");
                }}
              />
              <img
                src={`${img2}`}
                alt=""
                style={{ cursor: "pointer" }}
                title={"facebook"}
                onClick={() => {
                  window.open("https://www.facebook.com/achaulien");
                }}
              />
              <img
                src={`${img5}`}
                alt=""
                title={"pinterest"}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  window.open("https://se.pinterest.com/achau_lien/");
                }}
              />
            </div>
          </div>
        ) : (
          <>
            <div
              className={styles.mobileView}

              //   style={{
              //     width: "100%",
              //     // display: "flex",
              //     // justifyContent: "space-between",
              //     // alignItems: "center",
              //   }}
            >
              <div
                className={styles.Logo}

                // style={{
                //   display: "flex",
                //   alignItems: "center",
                //   justifyContent: "center",
                // }}
              >
                <img src={`${img3}`} alt="" />
              </div>

              <div
                className={styles.mbviewsocialLinks}

                // style={{
                //   display: "flex",
                //   gap: "10px",
                //   alignItems: "center",
                //   justifyContent: "flex-start",
                //   margin: "10px 0px",
                // }}
              >
                <img
                  src={`${img1}`}
                  alt=""
                  title={"instagram"}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    window.open("https://www.instagram.com/achau_lien/");
                  }}
                />
                <img
                  src={`${img2}`}
                  alt=""
                  style={{ cursor: "pointer" }}
                  title={"facebook"}
                  onClick={() => {
                    window.open("https://www.facebook.com/achaulien");
                  }}
                />
                <img
                  src={`${img5}`}
                  alt=""
                  title={"pinterest"}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    window.open("https://se.pinterest.com/achau_lien/");
                  }}
                />
              </div>

              <div
                className={styles.mbcopyRights}
                // style={{
                //   display: "flex",
                //   gap: "5px",
                //   alignItems: "center",
                //   justifyContent: "center",
                // }}
              >
                {/* <img src={`${img4}`} alt="" /> */}
                <p style={{ margin: 0, color: "#ffff" }}>
                  {" "}
                  &copy; 2024 A Chau Lien -All rights reserved.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default Maincomponent;
