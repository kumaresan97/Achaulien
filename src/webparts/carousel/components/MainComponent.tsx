import * as React from "react";
import { Carousel } from "primereact/carousel";
import "../../Global/Style.css";
import { sp } from "@pnp/sp/presets/all";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { isCurrentUserIsadmin } from "../../Global/Admin";

// import "primeicons/primeicons.css";
let Pencil = require("../../Global/Images/pencil.png");

const MainComponent = () => {
  const [images, setImages] = React.useState([]);
  const [isadmin, setIsadmin] = useState(false);

  const responsiveOptions = [
    {
      breakpoint: "1400px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "1199px",
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: "767px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "575px",
      numVisible: 1,
      numScroll: 1,
    },
  ];
  const products = [
    {
      id: 1,
      imageurl:
        "https://static.toiimg.com/thumb/msid-108681057,width-1280,height-720,resizemode-4/108681057.jpg",
    },
    {
      id: 2,
      imageurl: "https://p.imgci.com/db/PICTURES/CMS/357400/357408.jpg",
    },
    {
      id: 3,
      imageurl:
        "https://akm-img-a-in.tosshub.com/indiatoday/images/photo_gallery/202403/msdhoniipl2024csk.jpg?VersionId=L777652GITlP31pBxZJtrhSDOIA3XwW1&size=686:*",
    },
  ];

  // const productTemplate = (product) => {
  //   return (
  //     <div className="product-item">
  //       <div className="product-item-content">
  //         <div
  //           className="p-mb-3"
  //           // style={{ width: "100% !important", height: "400px !important" }}
  //         >
  //           <img
  //             src={product.imgUrl}
  //             alt={`Product ${product.ID}`}
  //             style={{
  //               width: "100%",
  //               // height: "600px",
  //               objectFit: "cover",
  //             }}
  //           />
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  const productTemplate = (product) => {
    return (
      <div className="product-item">
        <div className="product-item-content">
          <div
            className="image-container"
            style={{
              width: "100%",
              height: "500px",
              position: "relative",
            }}
          >
            <img
              src={product.imgUrl}
              alt={`Product ${product.ID}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            {isadmin && (
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  right: "12px",
                  background: "#fff",
                  borderRadius: "50%",
                  // padding: "5px",
                  cursor: "pointer",
                  width: 35,
                  height: 35,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                }}
                onClick={() => {
                  window.open(
                    "https://chandrudemo.sharepoint.com/sites/Achaulien/Carousel/Forms/AllItems.aspx"
                  );
                }}
              >
                <img
                  src={`${Pencil}`}
                  alt=""
                  style={{
                    width: "16px",
                    height: "16px",
                  }}
                />
                {/* <i className="pi pi-pencil" style={{ fontSize: "2rem" }}></i> */}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  useEffect(() => {
    const fetchFiles = async () => {
      await sp.web
        .getFolderByServerRelativePath("Carousel")
        .files.select("*,ListItemAllFields")
        .expand("ListItemAllFields")
        .orderBy("TimeCreated", false)
        .get()
        .then(async (res) => {
          let img = [];
          img = res.map((val: any) => ({
            imgUrl: val.ServerRelativeUrl,
            ID: val.ListItemAllFields.ID,
          }));

          setImages([...img]);

          let _isAdmin = await isCurrentUserIsadmin("Achaulien Owners");
          setIsadmin(_isAdmin);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchFiles();
  }, []);

  return (
    <div>
      {images.length ? (
        <div className="card" style={{ height: "200px !important" }}>
          <Carousel
            className="custom-carousel"
            value={images}
            numVisible={1}
            numScroll={1}
            verticalViewPortHeight="320px"
            showNavigators={false}
            showIndicators={true}
            circular
            //   circular={hasMultipleProducts}
            //   responsiveOptions={responsiveOptions}
            autoplayInterval={images.length > 1 ? 3000 : 8.64e7}
            itemTemplate={productTemplate}
          />
        </div>
      ) : (
        <div
          style={{
            minHeight: "250px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            fontWeight: 600,
          }}
        >
          no data found !!!
        </div>
      )}
    </div>
  );
};

export default MainComponent;
