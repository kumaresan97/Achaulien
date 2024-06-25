import * as React from "react";
import "./Style.css"
import { useEffect, useState } from "react";
import styles from "./QuickLinks.module.scss";
let img:any=require("../assets/Pencil.svg")
import { sp } from "@pnp/sp/presets/all";

const MainComponent = (props) => {
    const [data, setData] = useState([]);
    console.log();
    let tempArr = [];
    const getItems = () => {
     sp.web.lists
        .getByTitle("Quick links")
        .items()
        .then(async (res) => {
          tempArr = res.map((val) => ({
            Links: val.Links,
            Title: val.Title,
            Imgurl: JSON.parse(val.Image)?.serverRelativeUrl,
          }));
          await console.log(tempArr);
          await setData([...tempArr]);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    useEffect(() => {
      getItems();
    //   console.log(props);
    }, []);
    return (
      <div>
          <div className={styles.Header}>
           <div className={styles.webPartTitle}>
           Quick links
           </div>
          <img src={`${img}`} alt="" />
           </div>
        <div className={styles.container}>
          {data.map((rec, i) => (
            //     const imageJSON = JSON.parse(rec.Image);
            <div className={styles.link}>
              <img src={rec.Imgurl}></img>
              <a href={rec.Links}>{rec.Title}</a>
            </div>
          ))}
        </div>
      </div>
    )
}
export default MainComponent