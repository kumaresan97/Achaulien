import { sp } from "@pnp/sp/presets/all";
import * as React from "react";
// import "./Style.css";
import styles from "./AllAnnouncement.module.scss";
import { useEffect, useState } from "react";
import { Tooltip } from "primereact/tooltip";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "../../Global/Style.css";
import { Config } from "../../Global/Config";
import { Dialog } from "primereact/dialog";
import AnnouncementView from "./Announceview";
import { isCurrentUserIsadmin } from "../../Global/Admin";

let img: any = require("../../Global/Images/Pencil.svg");
const MainComponent = (props) => {
  let values = props.context.pageContext.web.absoluteUrl;
  const [ispopup, setIspopup] = useState(false);
  const [isadmin, setIsadmin] = useState(false);

  const [selectItem, setSelectItem] = useState(null);

  const [announcements, setAnnouncements] = useState([]);

  const navigateToDetailsPage = async (val, flag) => {
    setSelectItem(val);
    setIspopup(flag);
    // const detailsPageUrl = `${values}/SitePages/AnnouncementView.aspx?id=${imageId}`;
    // window.location.href = detailsPageUrl;

    // window.open(
    //   `${props.context.pageContext.web.absoluteUrl}/SitePages/AnnouncementView.aspx?id=${imageId}`,
    //   "_self"
    // );
  };

  // function getAnnouncement(){
  //     sp.web.lists.getByTitle('Announcement').items.select('Id,FileRef,Details').get().then((items:any) => {
  //         items.map((item)=>{
  //           console.log(items);
  //         })
  //       })
  //     }

  //   sp.web
  //   .getFolderByServerRelativePath("Announcement")
  //   .files.select(
  //     "*,ListItemAllFields"
  //   )
  //   .expand("ListItemAllFields")
  //   .orderBy("TimeCreated", false)
  //   // .filter("isActive eq '1'")
  //   .get()
  //   .then((files: any) => {
  //     console.log(files, "carouselfiles");

  //     let tempArr: any= [];

  //     files.forEach((val: any, index: number) => {
  //       // if (index == 0) {

  //         // tempArr.push({
  //         //   Title: val.Title ? val.Title : "",
  //         //   Image: val.ServerRelativeUrl ? val.ServerRelativeUrl : "",
  //         //   Date: val.ListItemAllFields.Date
  //         //     ? val.ListItemAllFields.Date
  //         //     : "",
  //         //   Description: val.ListItemAllFields.EventDescription
  //         //     ? val.ListItemAllFields.EventDescription
  //         //     : "",
  //         //   Tag: val.ListItemAllFields.Tag ? val.ListItemAllFields.Tag : "",
  //         // });

  //       // }
  //     });
  //     console.log(tempArr, "tempArr");

  //   })
  //   .catch((err: any) => console.log(err, "err"));

  async function getAnnouncement() {
    try {
      const items = await sp.web.lists
        .getByTitle("Announcement")
        .items.select("Id", "FileRef", "Details,Header")
        .orderBy("Modified", false)

        .get();
      console.log(items, "items");

      const announcements = items.map((item) => ({
        Id: item.Id,
        FileRef: item.FileRef,
        Title: item.Header,
        Details: item.Details,
      }));
      //  return announcements;
      setAnnouncements(announcements);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      return [];
    }
  }
  // const tooltipStyle = {
  //   backgroundColor: "blue",
  //   color: "white",
  //   border: "1px solid black",
  //   borderRadius: "4px",
  //   padding: "8px",
  //   width: "30%",
  //   height: "200px",

  //   // overflowX: "hidden",
  //   // overflowY: "scroll",
  // };

  useEffect(() => {
    // getAnnouncement();

    const checkAdminStatus = async () => {
      await getAnnouncement(); // Assuming getAnnouncement is defined somewhere in your code

      const _isAdmin = await isCurrentUserIsadmin("Achaulien Owners"); // Replace with your admin group name
      setIsadmin(_isAdmin);
    };
    checkAdminStatus();
  }, []);

  return (
    // <div>
    //   <div className={styles.container}>
    //     {imageArray.map((rec, i) => (
    //       <div className={styles.link}>
    //         <div className={styles.ImgContainer}>
    //           <img src={rec.url}></img>
    //         </div>
    //         <p>{rec.photographer}</p>
    //       </div>
    //     ))}
    //   </div>
    // </div>

    //   <div className={styles.container}>
    //     {announcements.map((rec, i) => (
    //       <div className={styles.link}>
    //         <div className={styles.ImgContainer}>
    //           <img src={rec.FileRef}></img>
    //         </div>
    //         <p>{rec.Details}</p>
    //       </div>
    //     ))}
    //   </div>
    // </div>

    //new
    <>
      <div className={styles.Container}>
        <div className={styles.headerContainer}>
          <div className={styles.headerSection}>
            <h5>News & Announcements</h5>
            {isadmin && (
              <img
                src={`${img}`}
                alt=""
                onClick={() => {
                  window.open(`${values}/${Config.ListNames.Announcement}`);
                }}
              />
            )}
          </div>
        </div>

        <div className={styles.imgContainer}>
          <div className={styles.imgwrapper}>
            {announcements.map((val, index) => (
              <div
                className={styles.imgsplit}
                key={index}
                onClick={() => {
                  navigateToDetailsPage(val, true);
                }}
              >
                <div className={styles.imgsection}>
                  <img src={val.FileRef} />
                </div>
                <Tooltip
                  content={val.Details}
                  position="top"
                  className="custom-tooltip "
                  // style={tooltipStyle}
                  target={`#pdesc-${index}`}
                />
                <div className={styles.detail}>
                  <h5>{val.Title}</h5>

                  <p className="pdesc" id={`pdesc-${index}`}>
                    {val.Details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog
        // className="ApicallDialog"
        className={`ApicallDialog ${styles.announceDialog}`}
        visible={ispopup}
        onHide={() => {
          setIspopup(false);
        }}
      >
        <AnnouncementView
          setIspopup={setIspopup}
          selectItem={selectItem}
        ></AnnouncementView>
      </Dialog>
    </>
  );
};
export default MainComponent;
