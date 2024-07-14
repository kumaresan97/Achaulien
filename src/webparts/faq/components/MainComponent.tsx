import * as React from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import "primereact/resources/themes/saga-blue/theme.css";
import { MultiSelect } from "primereact/multiselect";
import styles from "./Faq.module.scss";

import "../../Global/Style.css";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { sp } from "@pnp/sp/presets/all";
import { Chip } from "primereact/chip";
import { Config } from "../../Global/Config";
import { CustomRenderingStore } from "@fullcalendar/core";
import { isCurrentUserIsadmin } from "../../Global/Admin";

let img: any = require("../../Global/Images/Pencil.svg");
const MainComponent = (props) => {
  const [faqTags, setFaqTags] = useState([]);
  const [faqQuestions, setFaqQuestions] = useState([]);
  const [isadmin, setIsadmin] = useState(false);

  const [filterQues, setFilterQues] = useState([]);
  const [selected, setSelected] = useState([]);
  let values = props.context.pageContext.web.absoluteUrl;
  console.log(values, "values");

  const createDynamicTabs = () => {
    return faqQuestions.map((tab: any, i) => (
      <AccordionTab
        key={i}
        header={<HeaderTemplate title={tab.Title} tag={tab.Tag} />}
      >
        <div dangerouslySetInnerHTML={{ __html: tab.Answers }} />
      </AccordionTab>
    ));
  };
  const getBackground = (value) => {
    let backgroundColor = "";
    let textColor = "";

    // Define styles based on value
    switch (value) {
      case "Apple":
        backgroundColor = "#ffc107";
        textColor = "#fff";
        break;
      case "Google":
        backgroundColor = "#4caf50";
        textColor = "#fff";
        break;
      case "Microsoft":
        backgroundColor = "#e91e63";
        textColor = "#fff";
        break;
      default:
        backgroundColor = "#e0e0e0";
        textColor = "#fff";
    }

    // Return styled div
    return (
      <span
        className="custom-tag"
        style={{
          backgroundColor: backgroundColor,
          color: textColor,
          padding: "5px 10px",
          borderRadius: "20px",
          display: "inline-flex",
          margin: "5px 0px",
          fontSize: "14px",
          fontWeight: 400,
        }}
      >
        {value}
      </span>
    );
  };

  // const createDynamicTabs = () => {
  //   return tabs.map((tab, i) => {
  //     return (
  //       <AccordionTab
  //         key={i}
  //         header={<HeaderTemplate title={tab.Title} tag={tab.Tag} />}
  //         // disabled={tab.disabled}
  //       >
  //         <p>{tab.Details}</p>
  //       </AccordionTab>
  //     );
  //   });
  // };

  const HeaderTemplate = ({ title, tag }) => {
    return (
      <div>
        {getBackground(tag)}
        <div
          // className="custom-header"
          className={styles.customHeader}
        >
          <span> {title}</span>
          {/* <span className="tag">{tag}</span> */}
          <Button
            icon="pi pi-plus"
            rounded
            className={styles.PlusIcon}
            // text
            // raised
            severity="danger"
            aria-label="Cancel"
          />
        </div>
      </div>
    );
  };

  const filterQuestions = (value) => {
    setSelected(value);

    if (value.length === 0) {
      setFaqQuestions(filterQues);
    } else {
      const filtered = filterQues.filter((question) =>
        value.some((tag) => tag.code === question.Tag)
      );
      setFaqQuestions(filtered);
    }
  };

  const removeTag = (tag) => {
    const updatedTags = selected.filter((t) => t.code !== tag.code);
    filterQuestions(updatedTags);
  };

  // const removeTag = (tag) => {
  //   if (tag) {
  //     const updatedTags = faqQuestions.filter((t) => t.Tag !== tag.code);
  //     setFaqQuestions(updatedTags);

  //     const updatedSelected = selected.filter((t) => t.code !== tag.code);
  //     setSelected(updatedSelected);
  //   } else {
  //     setFaqQuestions(faqQuestions);
  //     setSelected([]);
  //   }
  //   // setSelected(updatedTags);
  // };

  useEffect(() => {
    // Fetch FAQ tags
    const fetchFaqTags = async () => {
      const tags = await sp.web.lists.getByTitle("FAQTags").items.get();
      setFaqTags(tags.map((tag) => ({ name: tag.Title, code: tag.Title })));

      let _isAdmin = await isCurrentUserIsadmin("Achaulien Owners");
      setIsadmin(_isAdmin);
    };

    // Fetch FAQ questions
    const fetchFaqQuestions = async () => {
      let ques = [];

      const questions = await sp.web.lists
        .getByTitle("FAQ")
        .items.select("Title", "Answers", "Tag/Title")
        .expand("Tag")
        .get();
      ques = questions.map((val) => ({
        Title: val.Title,
        Answers: val.Answers,
        Tag: val.Tag.Title,
      }));
      setFaqQuestions([...ques]);
      setFilterQues([...ques]);
    };

    fetchFaqTags();
    fetchFaqQuestions();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h5>FAQ</h5>
        <div className={styles.search}>
          <MultiSelect
            value={selected}
            // onChange={(e) => {
            //   if (e.value.length === 0) {
            //     removeTag(null); // Clear all tags
            //   } else {
            //     setSelected(e.value);
            //     filterQuestions(e.value);
            //   }
            // }}
            onChange={(e) => {
              setSelected(e.value);
              filterQuestions(e.value);
            }}
            options={faqTags}
            optionLabel="name"
            display="chip"
            placeholder="Select Cities"
            maxSelectedLabels={3}
            className={styles.muldropdown}
            // className="w-full md:w-20rem"
          />
          {isadmin && (
            <img
              src={`${img}`}
              onClick={() => {
                window.open(`${values}/Lists/${Config.ListNames.FAQ}`);
              }}
            />
          )}
        </div>
      </div>
      <div style={{ margin: "10px 0px" }}>
        {selected.length > 0 && (
          <div className="selected-tags">
            {selected.map((tag, i) => (
              <Chip
                key={i}
                label={tag.name}
                className="p-mr-2"
                removable
                onRemove={() => removeTag(tag)}
              />
            ))}
          </div>
        )}
      </div>

      <div className={styles.card}>
        <Accordion>{createDynamicTabs()}</Accordion>
      </div>
    </div>
  );
};
export default MainComponent;
