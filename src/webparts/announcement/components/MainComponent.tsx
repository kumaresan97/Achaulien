import { sp } from "@pnp/sp/presets/all";
import * as React from "react";
import "./Style.css"
import styles from "./Announcement.module.scss";
import { useEffect, useState } from "react";
const MainComponent = () => {

    const [announcements, setAnnouncements] = useState([]);

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



const imageArray = [
    {
      url: "https://images.unsplash.com/photo-1623930180584-1b14bc584169?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", title: "Beautiful Sunset",
      description: "A breathtaking view of the sunset over the mountains.",
      photographer: "John Doe",
      date: "2023-05-21"
    },
    {
      url: "https://images.unsplash.com/photo-1623930180584-1b14bc584169?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",      title: "City Skyline",
      description: "The city skyline at night, illuminated by thousands of lights.",
      photographer: "Jane Smith",
      date: "2023-06-10"
    },
    {
      url:"https://images.unsplash.com/photo-1623930180584-1b14bc584169?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",   title: "Forest Trail",
      description: "A peaceful trail winding through a dense forest.",
      photographer: "Michael Brown",
      date: "2023-07-15"
    },
    {
      url: "https://images.unsplash.com/photo-1623930180584-1b14bc584169?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",  title: "Ocean Waves",
      description: "Waves crashing against the rocky shoreline on a sunny day.",
      photographer: "Emily White",
      date: "2023-08-05"
    },
    {
      url: "https://images.unsplash.com/photo-1623930180584-1b14bc584169?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        title: "Desert Dunes",
      description: "Golden sand dunes under a clear blue sky.",
      photographer: "Daniel Green",
      date: "2023-09-12"
    },
      {
      url: "https://images.unsplash.com/photo-1623930180584-1b14bc584169?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Desert Dunes",
      description: "Golden sand dunes under a clear blue sky.",
      photographer: "Daniel Green",
      date: "2023-09-12"
    }
  ];









  async function getAnnouncement() {
    try {
      const items = await sp.web.lists
        .getByTitle("Announcement")
        .items.select("Id", "FileRef", "Details")
        .get();
        console.log(items,"items");
        
      const announcements = items.map((item) => ({
        Id: item.Id,
        FileRef: item.FileRef,
        Details: item.Details,
      }));
    //  return announcements;
      setAnnouncements(announcements);
      ;
    } catch (error) {
      console.error("Error fetching announcements:", error);
      return [];
    }
  }

  useEffect(() => {
    getAnnouncement();
  }, []);

  return (
    <div>
  <div className={styles.container}>
    {imageArray.map((rec, i) => (
      <div className={styles.link}>
        <div className={styles.ImgContainer}>
        <img src={rec.url}></img>
        </div>
        <p>{rec.photographer}</p>
      </div>
    ))}
  </div>
  </div>
/* <div>
<div className={styles.container}>
  {announcements.map((rec, i) => (
    <div className={styles.link}>
      <div className={styles.ImgContainer}>
      <img src={rec.FileRef}></img>
      </div>
      <p>{rec.Details}</p>
    </div>
  ))}
</div>
</div> */

  )
  
  
  
  
  

};
export default MainComponent;
