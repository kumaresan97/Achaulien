import * as moment from "moment";
import * as React from "react";
import { Timeline } from "primereact/timeline";
import styles from "./Shipments.module.scss";

const TimelineComponent = ({ Attachment, setIsPopup }) => {
  const [events, setEvents] = React.useState(null);

  const parseData = (data) => {
    let groupedEvents = {};

    let ATD = null;
    let ETA = null;

    // Find the latest actual event for ATD
    data.containers.forEach((container) => {
      container.events.forEach((event) => {
        if (event.actual && (!ATD || new Date(event.date) > new Date(ATD))) {
          ATD = event.date;
        }
      });
    });

    // Find the earliest non-actual event for ETA
    data.containers.forEach((container) => {
      container.events.forEach((event) => {
        if (!event.actual && (!ETA || new Date(event.date) < new Date(ETA))) {
          ETA = event.date;
        }
      });
    });

    // Format dates
    // const formatDate = (dateString) => {
    //   const options = { year: 'numeric', month: 'short', day: 'numeric' };
    //   return new Date(dateString).toLocaleDateString('en-GB', options);
    // };

    // // Format ATD and ETA
    // const formattedATD = ATD ? formatDate(ATD) : "N/A";
    // const formattedETA = ETA ? formatDate(ETA) : "N/A";

    console.log(`ATD: ${ATD}`);
    console.log(`ETA: ${ETA}`);

    data.containers.forEach((container) => {
      container.events.forEach((event) => {
        const location = data.locations.find(
          (loc) => loc.id === event.location
        );
        const locationNameWithCountry = `${location.name}, ${location.country_code}`;

        if (!groupedEvents[locationNameWithCountry]) {
          groupedEvents[locationNameWithCountry] = [];
        }

        // Estimated Time of Arrival

        groupedEvents[locationNameWithCountry].push({
          date: new Date(event.date),
          description: event.description,
          details: `Status: ${event.status}, Type: ${event.type}, Transport: ${event.transport_type}`,
          status: event.status,
          actual: event.actual,
          facility: event.facility,
          vessel: event.vessel,
          voyage: event.voyage,
        });
      });
    });

    // Sort events by date within each location
    for (let location in groupedEvents) {
      groupedEvents[location].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }

    return groupedEvents;
  };
  const customizedMarker = (item) => {
    const events = item[1];

    const reachedEvent = events.find((event) => event.actual);

    if (reachedEvent) {
      return (
        <span
          // className="custom-marker p-shadow-2"

          className={styles.customizedMarkerspan}

          // style={{
          //   width: "16px",
          //   height: "16px",
          //   borderRadius: "50%",
          //   background: "#FF1721",
          //   // backgroundColor: findlatest ? "red" : "inherit", // Change color if actual is true
          //   border: "1px solid #FF1721", // Thicker border if actual is true
          // }}
        ></span>
      );
    } else {
      return (
        <span
          // className="custom-marker p-shadow-2"
          className={styles.customizedMarkerspan1}
          // style={{
          //   width: "16px",
          //   height: "16px",
          //   borderRadius: "50%",
          //   // backgroundColor: findlatest ? "red" : "inherit", // Change color if actual is true
          //   border: "3px solid #FF1721", // Thicker border if actual is true
          // }}
        ></span>
      );
    }
  };

  const customizedContent = (item) => {
    const locationName = item[0]; // Location name
    const events = item[1]; // Array of events for this location

    return (
      <div className="carddesign">
        <h3
          className={"font-montserrat"}
          // style={{ margin: 0, color: "#0088FF" }}
        >
          {locationName}
        </h3>
        {events.map((event, index) => (
          <div key={index}>
            <div
              className={styles.customcontent}
              // style={{
              //   display: "flex",
              //   // flexWrap: "wrap",
              //   // gap: "10px",
              //   // justifyContent: "space-between",
              //   margin: "5px 0px  8px 0px",
              // }}
            >
              <p
                className={`fontFamilymont ${styles.content}`}

                // style={{ width: "70%" }}
              >
                {event.description}
              </p>
              <p
                className={`fontFamilymont ${styles.subcontent}`}

                // style={{ width: "30%" }} className="fontFamilymont"
              >
                {moment(event.date).format("MMM D, YYYY HH:mm")}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };
  React.useEffect(() => {
    const events = parseData(Attachment.AttachmentFiles.data);
    setEvents(events);
  }, [Attachment]);
  return (
    <div>
      <div
        className={styles.timelineContainer}
        // style={{ textAlign: "center", margin: "0px 0px 10px 0px" }}
      >
        <p
        // style={{
        //   margin: 0,
        //   color: "#FF1721",
        //   fontSize: "14px",
        //   fontWeight: 600,
        // }}
        >
          Tracking No :{" "}
          <span style={{ color: "#3A3E43", marginLeft: 5 }}>
            {Attachment?.ContainerNo || ""}
          </span>
        </p>
      </div>
      {events && (
        <Timeline
          value={events ? Object.entries(events) : null}
          content={customizedContent}
          marker={customizedMarker}

          // opposite={(item) => moment(item.date).format("MMM D")}
        />
      )}
    </div>
  );
};
export default TimelineComponent;
