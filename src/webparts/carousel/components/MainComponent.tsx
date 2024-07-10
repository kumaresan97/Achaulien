import * as React from "react";
import { Carousel } from "primereact/carousel";
import "../../Global/Style.css";
import { sp } from "@pnp/sp/presets/all";
import { useEffect } from "react";
import { Button } from "primereact/button";

// import "primeicons/primeicons.css";

const MainComponent = () => {
  const [images, setImages] = React.useState([]);
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
          </div>
        </div>
      </div>
    );
  };
  useEffect(() => {
    const fetchFiles = async () => {
      sp.web
        .getFolderByServerRelativePath("Carousel")
        .files.select("*,ListItemAllFields")
        .expand("ListItemAllFields")
        .orderBy("TimeCreated", false)
        .get()
        .then((res) => {
          let img = [];
          img = res.map((val: any) => ({
            imgUrl: val.ServerRelativeUrl,
            ID: val.ListItemAllFields.ID,
          }));

          setImages([...img]);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    fetchFiles();
  }, []);

  return (
    <div>
      <div className="card" style={{ height: "200px !important" }}>
        <Carousel
          className="custom-carousel"
          value={images}
          numVisible={1}
          numScroll={1}
          verticalViewPortHeight="400px"
          showNavigators={false}
          showIndicators={true}
          circular
          //   circular={hasMultipleProducts}
          //   responsiveOptions={responsiveOptions}
          autoplayInterval={images.length > 1 ? 3000 : 8.64e7}
          itemTemplate={productTemplate}
        />
      </div>
    </div>
  );
};

export default MainComponent;
