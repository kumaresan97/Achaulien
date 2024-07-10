import * as React from "react";
import "../../Global/Style.css";
import "primereact/resources/themes/saga-blue/theme.css";
import styles from "./Shipments.module.scss";
import * as moment from "moment";
import { Dialog } from "primereact/dialog";
import { ConfirmDialog } from "primereact/confirmdialog";

import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Search, sp } from "@pnp/sp/presets/all";
import { Config } from "../../Global/Config";
import ProgressBar from "./Progressbar";
import Loader from "../../Loader/Loader";
import TimelineComponent from "./TimelineComponent";

import { Calendar } from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import bootstrap5Plugin from "@fullcalendar/bootstrap5";
import { useEffect, useRef, useState } from "react";

import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import MapComponent from "./MapComponent";

let EditImg: any = require("../../Global/Images/Edit.png");
let DeleteImg: any = require("../../Global/Images/Delete.png");
let RefreshImg: any = require("../../Global/Images/Refresh.png");
let shipImg: any = require("../../Global/Images/Ship.png");
let ApiCallImg: any = require("../../Global/Images/Apicall.svg");
let dotImg: any = require("../../Global/Images/dot.png");
const Maincomponent = () => {
  const [values, setValues] = useState([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isAPI, setIsApi] = useState<boolean>(false);
  const [lastModified, setLastModified] = useState(null);
  const [masterValue, setMasterValue] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedvalue, setSelectedvalue] = useState(null);
  const [isPopup, setIsPopup] = useState<boolean>(false);
  const [Id, setID] = useState(null);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const toast = useRef(null);

  const [Shipments, setShipments] = useState({
    ID: null,
    Containername: "",
    TrackingNumber: "",
  });

  const [step, setStep] = useState(0);

  const nextStep = () => setStep((prevStep) => Math.min(prevStep + 1, 1));
  const prevStep = () => setStep((prevStep) => Math.max(prevStep - 1, 0));
  const getNewListData = async (listName: string) => {
    let _curData: any[] = [];
    try {
      await sp.web.lists
        .getByTitle(listName)

        .items.select("*, AttachmentFiles")
        .filter("isDelete ne 1 and isDelivered ne 1")
        .expand("AttachmentFiles")
        .get()
        .then(async (res: any) => {
          console.log(res);
          _curData = await res.map((val) => ({
            ID: val.ID || null,
            ContainerNumber: val.Title || "",
            ContainerName: val.ContainerName || "",
            ETA: moment(val?.ETA) || null,
            AttachmentFiles: val?.AttachmentFiles[0].FileName || "",
            Modified: val.Modified ? calculateTimeDifference(val.Modified) : "",
            LastModified: val.Modified || "",
          }));
        })
        .catch((err) => {
          console.log(err);
        });
    } catch {}

    return _curData;
  };

  const calculateTimeDifference = (modifiedDate: any) => {
    const now: any = new Date();
    const modified: any = new Date(modifiedDate);
    const difference = Math.abs(now - modified);
    const minutesDifference = Math.floor(difference / (1000 * 60));

    if (minutesDifference < 60) {
      return `${minutesDifference} minute${
        minutesDifference !== 1 ? "s" : ""
      } ago`;
    }

    const hoursDifference = Math.floor(minutesDifference / 60);
    if (hoursDifference < 24) {
      return `${hoursDifference} hour${hoursDifference !== 1 ? "s" : ""} ago`;
    }

    const daysDifference = Math.floor(hoursDifference / 24);
    return `${daysDifference} day${daysDifference !== 1 ? "s" : ""} ago`;
  };

  // const calculateTimeDifference = (modifiedDate) => {
  //   const now: any = new Date();
  //   const modified: any = new Date(modifiedDate);
  //   const difference = Math.abs(now - modified);
  //   const minutesDifference = Math.floor(difference / (1000 * 60));

  //   if (minutesDifference < 60) {
  //     return `${minutesDifference} minute${
  //       minutesDifference !== 1 ? "s" : ""
  //     } ago`;
  //   }

  //   const hoursDifference = Math.floor(minutesDifference / 60);
  //   return `${hoursDifference} hour${hoursDifference !== 1 ? "s" : ""} ago`;
  // };

  const getAttachmentUrls = async (listName, itemIds) => {
    let array = [];
    for (let i = 0; i < itemIds.length; i++) {
      try {
        const res = await sp.web.lists
          .getByTitle(listName)
          .items.getById(itemIds[i].ID)
          .attachmentFiles.getByName(itemIds[i].AttachmentFiles)
          .getText();

        let parsedData = JSON.parse(res);

        // Push the result into the array
        array.push({
          ContainerNo: itemIds[i].ContainerNumber,
          ID: itemIds[i].ID,
          ETA: new Date(itemIds[i].ETA) || null,
          start: new Date(itemIds[i].ETA) || null,
          end: new Date(itemIds[i].ETA) || null,
          Containername: itemIds[i].ContainerName,
          AttachmentFiles: parsedData,
          Modified: itemIds[i].Modified,
          LastModified: itemIds[i].LastModified,
        });
      } catch (err) {
        setLoader(false);

        console.log("err: ", err);
      }
    }
    BindCalender(array);

    const latestModifiedItem = array.reduce((latest: any, item: any) => {
      return new Date(item.LastModified) > new Date(latest.LastModified)
        ? item
        : latest;
    }, array[0]);

    setLastModified(latestModifiedItem);

    console.log("Latest Modified Item:", latestModifiedItem);

    console.log(array, "array");
    setLoader(false);
    setVisible(false);
    setShipments({
      ID: null,
      Containername: "",
      TrackingNumber: "",
    });
    setValues(array);
    setMasterValue(array);

    return array;
  };

  const findLocationNameById = (id, locations) => {
    const location = locations.find((loc) => loc.id === id);
    return location ? location.name : "Unknown Location";
  };

  function calculatePercentage(container) {
    const totalEvents = container.events.length;
    const actualEvents = container.events.filter(
      (event) => event.actual
    ).length;
    return (actualEvents / totalEvents) * 100;
  }

  const getApiData = async (action, number, ID) => {
    setLoader(true);
    setVisible(false);

    let apiKey = "K-8A209FCB-A578-455E-84FC-257A5F427128";
    try {
      const response = await fetch(
        `https://tracking.searates.com/tracking?api_key=${apiKey}&number=${number}&route=true&force_update=true`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();

      // if (!response.ok ||data.status === "error") {
      //   throw new Error("Network response was not ok");
      // }

      if (!response.ok || data.status === "error") {
        const errorMessage = data.message || "Network response was not ok";
        throw new Error(errorMessage);
      }
      if (data) {
        if (isEdit) {
          updateItem(action, number, data, ID);
        } else if (action == "refresh") {
          updateItem(action, number, data, ID);
        } else {
          addItem(number, data, ID);
        }
      }
    } catch (error) {
      setLoader(false);
      toast.current.show({
        severity: "error",
        summary: "API Error",
        detail: error.message,
        life: 3000,
      });
      setShipments({
        ID: null,
        TrackingNumber: "",
        Containername: "",
      });

      console.log(error.message);
    } finally {
      setLoader(false);
    }
  };

  const updateItem = async (action, number, description, itemId) => {
    const jsonData = description;
    const fileName = `${number}.txt`;
    const listName = Config.ListNames.Shipment;

    // Data to update the item
    const itemData = {
      Title: number,
      ContainerName: Shipments.Containername,
      ETA: new Date(),
    };

    try {
      // Update item in the list
      action !== "refresh" &&
        (await sp.web.lists
          .getByTitle(listName)
          .items.getById(itemId)
          .update(itemData));

      // Create file from JSON data
      const file = _handleRichText(jsonData, fileName);

      // Update the attachment
      await updateAttachmentToListItem(listName, itemId, file);

      const _listData = await getNewListData(listName);
      await getAttachmentUrls(listName, _listData);

      console.log("Item and attachment updated successfully!");
    } catch (error) {
      console.error("Error updating item:", error);
    } finally {
      setLoader(false);
    }
  };
  const updateAttachmentToListItem = async (listName, itemId, file) => {
    try {
      // Delete existing attachments
      const attachments = await sp.web.lists
        .getByTitle(listName)
        .items.getById(itemId)
        .attachmentFiles();
      for (let attachment of attachments) {
        await sp.web.lists
          .getByTitle(listName)
          .items.getById(itemId)
          .attachmentFiles.getByName(attachment.FileName)
          .delete();
      }

      // Add the new attachment
      await sp.web.lists
        .getByTitle(listName)
        .items.getById(itemId)
        .attachmentFiles.add(file.name, file);

      console.log("Attachment updated successfully!");
    } catch (error) {
      setLoader(false);
      console.error("Error updating attachment:", error);
      throw error;
    }
  };

  const addItem = async (number, description, ID) => {
    const jsonData = description;
    const fileName = `${number}.txt`;
    const listName = Config.ListNames.Shipment;

    // Data for the new item
    const itemData = {
      Title: number,
      ContainerName: Shipments.Containername,
      ETA: new Date(description.data.route.pod.date) || null,
    };

    try {
      // Step 1: Add item to list and get the new item ID
      const itemId = await addItemToList(listName, itemData);

      // Step 2: Create file from JSON data
      const file = _handleRichText(jsonData, fileName);

      // Step 3: Add the attachment to the new item
      await addAttachmentToListItem(listName, itemId.Id, file);

      const _listData: any = await getNewListData(listName);

      await getAttachmentUrls(listName, _listData);

      console.log("Item and attachment added successfully!");
    } catch (error) {
      console.error("Error in the process:", error);
    }
  };

  const _handleRichText = (description, fileName): File => {
    const blob = new Blob([JSON.stringify(description, null, 2)], {
      type: "text/plain",
    });
    const file = new File([blob], fileName, { type: "text/plain" });
    return file;
  };

  const addItemToList = async (listName, itemData) => {
    try {
      const item = await sp.web.lists
        .getByTitle(listName)
        .items.select("*,AttachmentFiles")
        .expand("AttachmentFiles")
        .add(itemData);
      return item.data;
    } catch (error) {
      setLoader(false);

      console.error("Error adding item:", error);
      throw error;
    }
  };

  const addAttachmentToListItem = async (listName, itemId, file) => {
    try {
      await sp.web.lists
        .getByTitle(listName)
        .items.getById(itemId)
        .select("*, AttachmentFiles")
        .expand("AttachmentFiles")
        .attachmentFiles.add(file.name, file)
        .then((res) => {
          console.log(res, "res");
        })
        .catch((err) => {
          setLoader(false);

          err;
        });
      console.log("Attachment added successfully!");
    } catch (error) {
      setLoader(false);

      console.error("Error adding attachment:", error);
      throw error;
    }
  };
  // };

  const getSearchFilter = (val) => {
    let selval = val.trim();
    setSelectedDate(null);
    if (selval != "") {
      const filteredData = masterValue.filter(
        (container) =>
          container.ContainerNo.toLowerCase().includes(selval.toLowerCase()) ||
          container.Containername.toLowerCase().includes(selval.toLowerCase())
      );
      setValues(filteredData);
    } else {
      setValues(masterValue);
    }
  };

  const handleDelete = async () => {
    await sp.web.lists
      .getByTitle(Config.ListNames.Shipment)
      .items.getById(Id)
      .update({
        isDelete: true,
      })
      .then(async (res) => {
        setID(null);
        let del = await getNewListData(Config.ListNames.Shipment);
        await getAttachmentUrls(Config.ListNames.Shipment, del);
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //calender section
  const BindCalender = (data: any) => {
    let calendarEl: any = document.getElementById("myCalendar");
    let _Calendar = new Calendar(calendarEl, {
      plugins: [
        interactionPlugin,
        dayGridPlugin,
        timeGridPlugin,
        listPlugin,
        bootstrap5Plugin,
      ],
      selectable: true,
      buttonText: {
        today: "Today",
        dayGridMonth: "Month",
        dayGridWeek: "Week - ListGrid",
        timeGridWeek: "Week",
        dayGridDay: "Day - ListGrid",
        timeGridDay: "Day",
        listWeek: "List",
      },

      headerToolbar: {
        left: "prev",
        center: "title",
        right: "next",
      },
      initialDate: new Date(),
      events: data,
      height: "auto",
      displayEventTime: true,
      weekends: true,
      dayMaxEventRows: true,
      views: {
        dayGrid: {
          dayMaxEventRows: 4,
        },
      },
      showNonCurrentDates: false,
      fixedWeekCount: false,
      eventDidMount: (event) => {
        console.log("Event mounted:", event);
        event.el.setAttribute("data-bs-target", "event");
      },
      dateClick: function (arg) {
        const allDayNumberElements = document.querySelectorAll(
          ".fc-daygrid-day-number"
        );
        allDayNumberElements.forEach((dayNumber) => {
          (dayNumber as HTMLElement).style.color = "#000";
        });

        const dayNumber = arg.dayEl.querySelector(".fc-daygrid-day-number");
        if (dayNumber) {
          (dayNumber as HTMLElement).style.color = "#000 !important";
        }
        const selectedDateString = moment(arg.dateStr).format("YYYYMMDD");
        setSelectedDate(selectedDateString);

        DateFilter(selectedDateString, data);
        // const filterEvents = data.filter(
        //   (event: any) =>
        //     moment(event.ETA).format("YYYYMMDD") === selectedDateString
        // );
        // setValues(filterEvents);
        // filterEvents.length &&
        //   filterEvents.sort(
        //     (a: any, b: any) =>
        //       moment(a.start).valueOf() - moment(b.start).valueOf()
        //   );

        // setTodayEvent([...filterEvents]);
        // setCurrentEventIndex(0);
      },
    });

    _Calendar.updateSize();
    _Calendar.render();
  };
  const onchangevalues = (key, value) => {
    let obj = { ...Shipments };
    obj[key] = value;
    setShipments({ ...obj });
  };

  const EditHandler = (_val) => {
    setIsEdit(true);
    setVisible(true);
    setShipments((prev) => ({
      ...prev,
      ID: _val.ID,
      Containername: _val.Containername,
      TrackingNumber: _val.ContainerNo,
    }));
  };

  const validateInputs = async () => {
    if (!Shipments.Containername.trim()) {
      toast.current.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Tracking name is required.",
        life: 3000,
      });
      return false;
    }

    if (!Shipments.TrackingNumber.trim()) {
      toast.current.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Tracking number is required.",
        life: 3000,
      });
      return false;
    }

    if (Shipments.TrackingNumber.trim().length < 6) {
      toast.current.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Tracking number must be at least 6 characters long.",
        life: 3000,
      });
      return false;
    }

    // Check for duplicate container name
    // let containerNameDuplicate = values.some(
    //   (item) =>
    //     item.Containername.trim().toLowerCase() ===
    //       Shipments.Containername.trim().toLowerCase() &&
    //     item.ID !== Shipments.ID
    // );
    // if (containerNameDuplicate) {
    //   toast.current.show({
    //     severity: "error",
    //     summary: "Validation Error",
    //     detail: "Tracking name already exists.",
    //     life: 3000,
    //   });
    //   return false;
    // }

    // Check for duplicate tracking number
    let trackingNumberDuplicate = values.some(
      (item) =>
        item.ContainerNo.trim() === Shipments.TrackingNumber.trim() &&
        item.ID !== Shipments.ID
    );
    if (trackingNumberDuplicate) {
      toast.current.show({
        severity: "error",
        summary: "Validation Error",
        detail: "Tracking number already exists.",
        life: 3000,
      });
      return false;
    }

    return true;
  };

  // const validateInputs = async () => {
  //   if (!Shipments.Containername.trim()) {
  //     toast.current.show({
  //       severity: "error",
  //       summary: "Validation Error",
  //       detail: "Tracking name is required.",
  //       life: 3000,
  //     });
  //     return false;
  //   }

  //   if (!Shipments.TrackingNumber.trim()) {
  //     toast.current.show({
  //       severity: "error",
  //       summary: "Validation Error",
  //       detail: "Tracking number is required.",
  //       life: 3000,
  //     });
  //     return false;
  //   }

  //   // Check for duplicates
  //   let duplicate = values.some(
  //     (item) =>
  //       item.ContainerNo.trim() === Shipments.TrackingNumber.trim() &&
  //       item.ID !== Shipments.ID
  //   );
  //   if (duplicate) {
  //     toast.current.show({
  //       severity: "error",
  //       summary: "Validation Error",
  //       detail: "Tracking number already exists.",
  //       life: 3000,
  //     });
  //     return false;
  //   }

  //   return true;
  // };
  const DateFilter = (_value, datas) => {
    let data = datas.filter(
      (val) => moment(val.ETA).format("YYYYMMDD") == _value
    );
    setValues(data);
  };
  const cleaeDateFilter = () => {
    setSelectedDate(null);
    setValues(masterValue);

    const allDayNumberElements = document.querySelectorAll(
      ".fc-daygrid-day-number"
    );
    allDayNumberElements.forEach((dayNumber) => {
      (dayNumber as HTMLElement).style.color = "";
    });
  };

  useEffect(() => {
    setLoader(true);
    const fetchData = async () => {
      try {
        let x = await getNewListData(Config.ListNames.Shipment);
        let y = await getAttachmentUrls(Config.ListNames.Shipment, x);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    getSearchFilter(filter);
  }, [filter]);

  return (
    <div>
      <div className={styles.shipmentContainer}>
        <Toast ref={toast} />

        <div
          className={styles.calenderSection}
          // style={{ width: "40%" }}
        >
          <div className={styles.ETATitle}>ETA</div>
          <div id="myCalendar"></div>
        </div>
        {loader ? (
          <div
            className={styles.loadingStyle}
            // style={{
            //   display: "flex",
            //   alignItems: "center",
            //   justifyContent: "center",
            //   height: "70vh",
            // }}
          >
            <Loader />
          </div>
        ) : (
          <div
            className={styles.shipmentSection}
            // style={{ width: "60%" }}
          >
            <div className={styles.header}>
              <div className={styles.selectShipData}>
                {/* <p>Shipments</p> */}
                <p>
                  {selectedDate
                    ? `Shipments on ${moment(selectedDate).format(
                        "D MMM YYYY"
                      )}`
                    : ` All Shipments  (${values?.length})`}
                </p>
                {selectedDate && (
                  <i className="pi pi-times" onClick={cleaeDateFilter}></i>
                )}
              </div>
              <div className={styles.headerSection}>
                <img
                  src={`${ApiCallImg}`}
                  alt=""
                  onClick={() => setIsApi(true)}
                />
                <IconField iconPosition="left">
                  <InputIcon className="pi pi-search" color="#FF1721">
                    {" "}
                  </InputIcon>
                  <InputText
                    v-model="value1"
                    placeholder="Search"
                    value={filter}
                    onChange={(e) => {
                      const allDayNumberElements = document.querySelectorAll(
                        ".fc-daygrid-day-number"
                      );
                      allDayNumberElements.forEach((dayNumber) => {
                        (dayNumber as HTMLElement).style.color = "";
                      });
                      setFilter(e.target.value);
                      getSearchFilter(e.target.value);
                    }}
                    className={styles.searchField}
                  />
                </IconField>

                <Button
                  label="Add New"
                  className={styles.button}
                  onClick={() => {
                    setID(null);
                    setFilter("");
                    cleaeDateFilter();
                    setIsEdit(false);

                    setVisible(true);
                  }}
                />
              </div>
            </div>

            <>
              <div
                className={styles.contentSection}

                // style={{
                //   margin: "10px 0px 0px 0px",
                //   maxHeight: "386px",
                //   overflowY: "auto",
                // }}
              >
                {values.length > 0 ? (
                  values.map((attachment: any, index: number) => (
                    <div key={index}>
                      {attachment.AttachmentFiles.data.containers.map(
                        (container: any, containerIndex: number) => (
                          <div
                            // onClick={() => {
                            //   setIsPopup(true);
                            //   setSelectedvalue(attachment);
                            // }}
                            key={containerIndex}
                            className={styles.contentBox}
                            // style={{
                            //   boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
                            //   padding: "15px",
                            //   borderLeft: "5px solid red",
                            //   marginBottom: "20px", // Add some spacing between items
                            // }}
                          >
                            <div
                              className={styles.ContentContainer}
                              // style={{ display: "flex" }}
                            >
                              <div
                                className={styles.leftSection}
                                // style={{ width: "40%", cursor: "pointer" }}
                                onClick={() => {
                                  setIsPopup(true);
                                  setSelectedvalue(attachment);
                                }}
                              >
                                <p
                                  className={styles.containerName}
                                  // style={{
                                  //   margin: "0px 0px 5px 0px",
                                  //   color: "#8A8A8A",
                                  //   fontWeight: "600",
                                  //   fontFamily: "interRegular",
                                  //   fontSize: "14px",
                                  //   letterSpacing: 0.59,
                                  // }}
                                >
                                  {attachment?.Containername} -{" "}
                                  <span
                                    className={styles.containerNumber}

                                    // style={{
                                    //   color: "#FF1721",
                                    //   fontFamily: "interRegular",
                                    //   fontWeight: "600",
                                    //   fontSize: "15px",
                                    //   letterSpacing: 0.59,
                                    // }}
                                  >
                                    {container.number}
                                  </span>
                                </p>
                                <div
                                  className={styles.containersizeContainer}

                                  // style={{
                                  //   display: "flex",
                                  //   gap: "10px",
                                  //   alignItems: "center",
                                  // }}
                                >
                                  <p
                                  // style={{
                                  //   margin: 0,
                                  //   color: "#3A3E43",
                                  //   fontWeight: "500",
                                  //   fontFamily: "interRegular",
                                  //   fontSize: "14px",
                                  // }}
                                  >
                                    {container.size_type}{" "}
                                  </p>
                                  <img src={`${shipImg}`} alt="" />
                                </div>
                                <p
                                  className={styles.ETA}
                                  // style={{
                                  //   margin: "10px 0px 0px 0px",

                                  //   color: "#3A3E43",
                                  //   fontWeight: "500",
                                  //   fontFamily: "interRegular",
                                  //   fontSize: "14px",
                                  // }}
                                >
                                  ETA
                                  <span
                                  // style={{
                                  //   color: "#FF1721",
                                  //   marginLeft: "6px",
                                  // }}
                                  >
                                    {moment(attachment.ETA).format(
                                      "D MMM YYYY"
                                    )}
                                  </span>
                                </p>
                              </div>
                              <div className={styles.rightSection}>
                                <>
                                  <ProgressBar
                                    percentageComplete={calculatePercentage(
                                      container
                                    )}
                                    polLocation={findLocationNameById(
                                      attachment.AttachmentFiles.data.route.pol
                                        .location,
                                      attachment.AttachmentFiles.data.locations
                                    )}
                                    podLocation={findLocationNameById(
                                      attachment.AttachmentFiles.data.route.pod
                                        .location,
                                      attachment.AttachmentFiles.data.locations
                                    )}
                                    polActual={
                                      attachment.AttachmentFiles.data.route
                                        .prepol.actual
                                    }
                                    podActual={
                                      attachment.AttachmentFiles.data.route
                                        .postpod.actual
                                    }
                                  />
                                </>
                                {/* <ShippingTimeline
                          polLocation={findLocationNameById(
                            attachment.AttachmentFiles.data.route.pol.location,
                            attachment.AttachmentFiles.data.locations
                          )}
                          podLocation={findLocationNameById(
                            attachment.AttachmentFiles.data.route.pod.location,
                            attachment.AttachmentFiles.data.locations
                          )}
                        /> */}

                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    margin: "15px 0px 0px 0px",
                                  }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "5px",
                                      alignItems: "center",
                                    }}
                                  >
                                    <img
                                      src={`${RefreshImg}`}
                                      alt=""
                                      id="refreshIcon"
                                      style={{
                                        cursor: "pointer",
                                        width: "23px",
                                        height: "23px",
                                      }}
                                      onClick={() => {
                                        cleaeDateFilter();
                                        getApiData(
                                          "refresh",
                                          attachment.ContainerNo,
                                          attachment.ID
                                        );
                                      }}
                                    />

                                    <p
                                      style={{
                                        margin: 0,
                                        color: "#8A8A8A",
                                        fontSize: "11px",
                                        fontWeight: 500,
                                      }}
                                    >{` ( ${attachment?.Modified} )`}</p>
                                    <Tooltip
                                      target="#refreshIcon"
                                      content="Refresh"
                                      position="bottom"
                                    />
                                  </div>

                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                    }}
                                  >
                                    <img src={`${dotImg}`} alt="" />
                                    <p
                                      style={{
                                        margin: 0,
                                        fontSize: "13px",
                                        fontWeight: 400,
                                        color: "#818181",
                                      }}
                                    >
                                      {
                                        attachment?.AttachmentFiles.data
                                          .metadata.status
                                      }
                                    </p>
                                    <img
                                      id="editIcon"
                                      src={`${EditImg}`}
                                      alt=""
                                      onClick={() => {
                                        cleaeDateFilter();
                                        EditHandler(attachment);
                                      }}
                                      style={{
                                        cursor: "pointer",
                                        width: "23px",
                                        height: "23px",
                                      }}
                                    />
                                    <img
                                      onClick={() => {
                                        cleaeDateFilter();
                                        setIsDelete(true);

                                        setID(attachment.ID);
                                      }}
                                      id="deleteIcon"
                                      src={`${DeleteImg}`}
                                      alt=""
                                      style={{
                                        cursor: "pointer",
                                        width: "23px",
                                        height: "23px",
                                      }}
                                    />

                                    <Tooltip
                                      target="#editIcon"
                                      content="Edit"
                                      position="bottom"
                                    />
                                    <Tooltip
                                      target="#deleteIcon"
                                      content="Delete"
                                      position="bottom"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    No Shipments found !!!
                  </div>
                )}
              </div>
            </>
          </div>
        )}
      </div>
      <Dialog
        // className="Shipments"
        className={`Shipments  ${styles.addnewDialog}`}
        visible={visible}
        // style={{ width: "40vw" }}
        onHide={() => {
          setVisible(false);
        }}
      >
        <div className={styles.dialogcontainer}>
          <div
            // style={{
            //   display: "flex",
            //   alignItems: "center",
            //   justifyContent: "center",
            //   flexDirection: "column",
            //   gap: "5px",
            //   margin: "10px 0px 30px 0px",
            // }}
            className={styles.addnewHeader}
          >
            <p
            // style={{
            //   margin: 0,
            //   fontSize: "17px",
            //   fontWeight: 600,
            //   color: "#FF1721",
            // }}
            >
              Add New Shipments
            </p>
            <span
            // style={{ borderBottom: "3px solid #FF1721", width: "35%" }}
            ></span>
          </div>

          <div
            // style={{
            //   width: "100%",
            //   display: "flex",
            //   gap: "10px",
            //   marginBottom: 20,
            // }}
            className={styles.textfieldContainer}
          >
            <div
              // style={{ width: "50%" }}
              className={styles.textBox}
            >
              <label
                htmlFor=""
                // style={{
                //   width: "100%",
                //   color: "#262F39",
                //   fontSize: "15px",
                //   fontWeight: 500,
                //   margin: "0px 0px 4px 0px",
                //   display: "inline-block",
                // }}
              >
                Enter Tracking name
              </label>
              <InputText
                value={Shipments.Containername || ""}
                style={{ width: "100%" }}
                onChange={(e) => {
                  onchangevalues("Containername", e.target.value);
                }}
              />
            </div>
            <div
              // style={{ width: "50%" }}
              className={styles.textBox}
            >
              <label
                htmlFor=""
                // style={{
                //   width: "100%",
                //   color: "#262F39",
                //   fontSize: "15px",
                //   fontWeight: 500,
                //   display: "inline-block",
                //   margin: "0px 0px 4px 0px",
                // }}
              >
                Enter Tracking number
              </label>
              <InputText
                style={{ width: "100%" }}
                value={Shipments.TrackingNumber || ""}
                onChange={(e) => {
                  onchangevalues("TrackingNumber", e.target.value);
                }}
              />
            </div>
          </div>

          <div
            // style={{
            //   display: "flex",
            //   justifyContent: "center",
            //   alignItems: "center",
            //   gap: "20px",
            //   margin: "20px 0px 0px 0px",
            // }}
            className={styles.buttonContainer}
          >
            <Button
              label="Cancel"
              className={styles.cancelButton}
              // style={{
              //   width: "150px",
              //   background: "#B9B9B9",
              //   borderRadius: "8px",
              //   border: "1px solid #B9B9B9",
              // }}
              onClick={() => {
                setVisible(false);
                setShipments({
                  Containername: "",
                  ID: null,
                  TrackingNumber: "",
                });
              }}
            />

            <Button
              label={isEdit ? "Update" : "Submit"}
              className={styles.saveButton}
              // style={{
              //   width: "150px",
              //   background: "#FF1721",
              //   borderRadius: "8px",
              //   border: "1px solid #FF1721",
              // }}
              onClick={async () => {
                const isValid = await validateInputs();
                if (isValid) {
                  getApiData("", Shipments.TrackingNumber, Shipments.ID);
                }
                // getApiData("", Shipments.TrackingNumber, Shipments.ID);
              }}
            />
          </div>
        </div>
      </Dialog>

      {/* //api Dialog */}

      <Dialog
        className={`ApicallDialog ${styles.apiDialog}`}
        visible={isAPI}
        // style={{ width: "35vw" }}
        onHide={() => {
          setIsApi(false);
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              margin: "10px 10px 0px 0px",
            }}
          >
            <i
              className="pi pi-times"
              style={{ cursor: "pointer" }}
              onClick={() => setIsApi(false)}
            ></i>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              margin: "0px 0px 15px 0px",
            }}
          >
            <h4
              style={{
                margin: 0,
                color: "#FF1721",
                fontSize: "16px",
                fontWeight: 600,
                lineHeight: 2,
              }}
            >
              API usage
            </h4>
            <span
              style={{ borderBottom: " 3px solid #FF1721", width: "25%" }}
            ></span>
          </div>

          <div style={{}}>
            <p
              style={{
                color: "#8A8A8A",
                fontSize: "13px",
                fontWeight: "500",
                margin: "8px 0px",
              }}
            >
              The total number of calls for this month :{" "}
              <span style={{ color: "#FF1721" }}>
                {lastModified
                  ? lastModified.AttachmentFiles.data.metadata.api_calls.total
                  : null}
              </span>
            </p>
            <p
              style={{
                color: "#8A8A8A",
                fontSize: "13px",
                fontWeight: "500",
                margin: "8px 0px",
              }}
            >
              The total number of calls completed this month :{" "}
              <span style={{ color: "#FF1721" }}>
                {lastModified
                  ? lastModified.AttachmentFiles.data.metadata.api_calls.used
                  : null}
              </span>
            </p>
            <p
              style={{
                color: "#8A8A8A",
                fontSize: "13px",
                fontWeight: "500",
                margin: "8px 0px",
              }}
            >
              The total number of calls available this month :{" "}
              <span style={{ color: "#FF1721" }}>
                {lastModified
                  ? lastModified.AttachmentFiles.data.metadata.api_calls
                      .remaining
                  : null}
              </span>
            </p>
          </div>
        </div>
      </Dialog>

      {/* // Timeline Dialog */}

      <Dialog
        // className="ApicallDialog"
        className={`ApicallDialog ${styles.timelineDialog}`}
        visible={isPopup}
        // style={{ width: "60vw" }}
        onHide={() => {
          // if (!visible) return;
          setIsPopup(false);
        }}
      >
        <div style={{ position: "relative" }}>
          <i
            className="pi pi-times"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              margin: "10px 0px",
              cursor: "pointer",
            }}
            onClick={() => {
              setStep(0);
              setIsPopup(false);
            }}
          ></i>

          <div style={{ width: "100%" }}>
            {step === 0 ? (
              <TimelineComponent
                Attachment={selectedvalue}
                setIsPopup={setIsPopup}
              />
            ) : (
              <MapComponent routeData={selectedvalue?.AttachmentFiles} />
            )}
          </div>

          {step > 0 && (
            <Button
              icon="pi pi-chevron-left"
              className="p-button-secondary"
              onClick={prevStep}
              style={{
                position: "fixed",
                top: "50%",
                // left: "0px",
                zIndex: 9999,
              }}
            />
          )}
          {step < 1 && (
            <Button
              icon="pi pi-chevron-right"
              className="p-button-secondary"
              onClick={nextStep}
              style={{ position: "absolute", top: "50%", right: "10px" }}
            />
          )}
        </div>
        {/* <div>
          <TimelineComponent
            Attachment={selectedvalue}
            setIsPopup={setIsPopup}
          />
          <MapComponent routeData={selectedvalue} />
        </div> */}
      </Dialog>

      <ConfirmDialog
        className="Deletemodal"
        visible={isDelete}
        onHide={() => setIsDelete(false)}
        message="Are you sure you want to delete?"
        acceptClassName="p-button-danger"
        acceptLabel="Yes"
        header="Confirmation"
        rejectLabel="No"
        accept={handleDelete}
        reject={() => setIsDelete(false)}
      />
    </div>
  );
};
export default Maincomponent;
