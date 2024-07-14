import { sp } from "@pnp/sp/presets/all";
import * as React from "react";
import "../../Global/Style.css";
import styles from "./AnnouncementView.module.scss";
const MainComponent = (props) => {
  const fetchImageDetailsById = async (id) => {
    try {
      const items = await sp.web.lists
        .getByTitle("Announcement")
        .items.getById(id)
        .select("Id", "FileRef", "Details", "Header")
        .get();
      //   await sp.web.lists
      //     .getByTitle("Announcement")
      //     .items.select("Id", "FileRef", "Details,Header")
      //     .orderBy("Created", false)

      //     .get();
      console.log(items, "items");

      const announcements = items.map((item) => ({
        Id: item.Id,
        FileRef: item.FileRef,
        Title: item.Header,
        Details: item.Details,
      }));
      //  return announcements;
      //   setAnnouncements(announcements);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      return [];
    }
  };

  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const imageId = urlParams.get("id");
    debugger;

    if (imageId) {
      const imageDetails = fetchImageDetailsById(imageId);
      console.log(imageDetails, "imgdetails");
    }
  }, []);
  return (
    <div style={{ background: "#fff", width: "100%" }}>
      {/* <div style={{ width: "100%", height: "500px", position: "relative" }}>
        <img
          src="https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?cs=srgb&dl=pexels-bri-schneiter-28802-346529.jpg&fm=jpg"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <p
          style={{
            position: "absolute",
            width: "100%",
            height: "30px",
            top: "0px", // Adjust the position as needed
            background: "white", // Optional: to make the icon stand out
            // borderRadius: "50%", // Optional: to style the icon
            padding: "5px", // Optional: to add some padding around the icon
            cursor: "pointer", //
            bottom: "10px",
          }}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit.{" "}
        </p>
      </div> */}

      <div className={styles.imagetitlecontainer}>
        <div className={styles.title}>
          What is webflow and why is it the best website builder?
        </div>
        <div className={styles.imagecontainer}>
          <img
            src="https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?cs=srgb&dl=pexels-bri-schneiter-28802-346529.jpg&fm=jpg"
            alt=""
          />

          {/* <img src="path-to-your-image.png" alt="Image Description" /> */}
        </div>
      </div>

      <div style={{ width: "60%", margin: "50px auto" }}>
        <div style={{ color: "#5F5F5F", fontWeight: "500", fontSize: "18px" }}>
          Courtallam is a panchayat town situated at a mean elevation of 160 m
          in the foothills of the Western Ghats in Tenkasi district of Tamil
          Nadu, India. The Coutrallam Falls on the Chittar River is a major
          tourist attraction
        </div>
      </div>
    </div>
  );
};
export default MainComponent;
