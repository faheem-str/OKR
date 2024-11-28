import React, { useEffect, useState, useRef } from "react";
import "./CompanyOkr.css";
import apiService from "../../ApiService/service";
function CompanyOKR({ dropdownValue }) {
  const [backgroundColor, setBackgroundColor] = useState("");
  const [keyBackgroundColor, setKeyBackgroundColor] = useState("");

  const [percentage, setPercentage] = useState(90);
  const [keypercentage, setKeypPercentage] = useState(50);
  const [parsedData, setParsedData] = useState({});
  const [companyOKRList, setcompanyOKRList] = useState([]);
  const [isObj, setIsobj] = useState(false);
  const [isKey, setIsKey] = useState(false);
  const [isKeybtn, setIsKeybtn] = useState(true);
  const [isObjbtn, setIsObjbtn] = useState(false);
  const [logs] = useState([]);
  const [activeCommentIndex, setActiveCommentIndex] = useState(null);
  const [keyParent, setKeyParent] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [progress, setProgress] = useState(0);
  const [updates, setUpdates] = useState([]);
  const [progressKey, setProgressKey] = useState({ progress: 0 });
  const [previousProgress, setPreviousProgress] = useState(0);
  const firstInputRef = useRef(null);
  const [isObjEdit, setIsObjEdit] = useState(false);
  const [isLoader, setIsLoader] = useState(false);

  const [showFullComments, setShowFullComments] = useState({});
  const [oldProgress, setOldProgress] = useState(0);

  const toggleComments = (index) => {
    setShowFullComments((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle specific log's comment visibility
    }));
  };

  const handleViewMoreClick = (comments, index) => {
    return showFullComments[index] ? comments : comments.slice(0, 1);
  };

  useEffect(() => {
    if (isObj && firstInputRef.current) {
      firstInputRef.current.focus();
    }
    if (isKey && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [isObj, isKey]);

  useEffect(() => {
    KeyPercentFn();
    const userData = sessionStorage.getItem("userData");
    if (userData) {
      setParsedData(JSON.parse(userData));
    }
  }, []);
  useEffect(() => {
    console.log(dropdownValue);
  }, [dropdownValue]);

  useEffect(() => {
    if (parsedData && parsedData.user_id) {
      console.log("parsedData", parsedData.user_id);
      getCompanyOKRList(parsedData.user_id);
    }
    if (parsedData && parsedData.user_id) {
      setFormData((prevData) => ({
        ...prevData,
        user_id: parsedData.user_id,
        assigned_to_id: parsedData.user_id,
        who_map_id: parsedData.user_id,
        whom_map_id: parsedData.user_id,
      }));
    }
    if (parsedData && parsedData.user_id) {
      setKeyFormData((prevData) => ({
        ...prevData,
        user_id: parsedData.user_id,
        assigned_to_id: parsedData.user_id,
        who_map_id: parsedData.user_id,
        whom_map_id: parsedData.user_id,
      }));
    }
  }, [parsedData]);
  const objPercentFn = (val) => {
    if (val < 40) {
      return "rgb(255 166 166 / 50%)";
    } else if (val < 70) {
      return "rgb(255 215 134 / 50%)";
    } else {
      return "#CBFFD7";
    }
  };
  const KeyPercentFn = () => {
    if (keypercentage < 40) {
      setKeyBackgroundColor("rgb(255 166 166 / 50%)");
    } else if (keypercentage < 70) {
      setKeyBackgroundColor("rgb(255 215 134 / 50%)");
    } else {
      setKeyBackgroundColor("#CBFFD7");
    }
  };
  const [showInput, setShowInput] = useState(false);
  const [commentText, setCommentText] = useState({});
  const [comments, setComments] = useState([]);
  const [viewMore, setViewMore] = useState(false);

  const handleAddCommentClick = (index) => {
    console.log("Clicked comment index:", index);
    // setShowInput(true);
    // setActiveCommentIndex(activeCommentIndex === index ? null : index);
    setActiveCommentIndex(index);
    // setActiveCommentIndex((prevIndex) => {
    //   const newIndex = prevIndex === index ? null : index;
    //   console.log("Updated activeCommentIndex:", newIndex);
    //   return newIndex;
    // });
  };

  const handleCommentSubmit = async ({ subItem }) => {
    if (activeCommentIndex === null || !subItem || !subItem.logs) return;

    const log = subItem.logs[activeCommentIndex];
    const displayName = log?.display_name || "Unknown User";

    const newComments = [...comments];
    if (!newComments[activeCommentIndex]) {
      newComments[activeCommentIndex] = [];
    }

    const text = commentText[activeCommentIndex]?.trim();
    if (!text) {
      console.error("Comment text is empty.");
      return;
    }
    const newComment = {
      text,
      modifiedOn: formatDate(log.created_at),
      commentedBy: displayName,
    };
    newComments[activeCommentIndex].push(newComment);
    setComments(newComments);

    const payload = {
      message: text,
      objective_log_id: log.log_id,
      user_id: log.user_id,
    };

    try {
      const postResponse = await apiService.post(
        "objectives/comments",
        payload
      );
      console.log("POST response---->", postResponse);

      const getResponse = await apiService.get(
        `objectives/objectives_with_key_results?user_id=${log.user_id}`
      );
      console.log("GET response---->", getResponse);

      // Update the state with the new objectives data
      setcompanyOKRList(getResponse.data);
    } catch (error) {
      console.log("Error occurred:", error);
    }

    // Reset the comment text and active comment index
    setCommentText("");
    setActiveCommentIndex(null);
  };

  const handleChangeCommentText = (index, text) => {
    setCommentText((prev) => ({ ...prev, [index]: text }));
  };

  const getCompanyOKRList = async (id) => {
    setIsLoader(true);
    try {
      const response = await apiService.get(
        `objectives/objectives_with_key_results?user_id=${id}`
      );
      console.log(response);
      setcompanyOKRList(response.data);
      setIsLoader(false);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const objectiveWithKeyResult = async (id) => {
    try {
      const response = await apiService.get(
        `objectives/objectives_with_key_results_parent?user_id=${id.user_id}&parent_id=${id.id}&tName=${parsedData.department}`
      );
      console.log(response);
      setKeyParent(response.data);
      setProgress(response.data.progress || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckIn = async (subItem, progressKey, comments) => {
    try {
      const log = subItem.logs[0]; 
      const objectiveId = log.objective_id;   
      const team = subItem.team || "Company OKR";
      console.log('objectiveId---', objectiveId)


      const payload = {
        user_id: parsedData.user_id,
        objective_id: objectiveId, 
        progress: progressKey.progress,
        notes_checkin: comments || "No comment",
        progress_type: "percentage",
        team: team 
      }
      const response = await apiService.put("objectives/update_progress", payload);
      // setUpdates(response)
      console.log("response", response);
      const update = {
        message: `Moved from 0 to ${progressKey.progress}%`,
        modifiedOn: new Date().toLocaleString(),
        comment: comments || "No Comment",
      };
      setUpdates((prevUpdates) => [...prevUpdates, update]); 
      setOldProgress(progressKey.progress);
      setComments("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleCheckIn();
  }, [progressKey, comments]);

  const updateProgress = (newProgress) => {
    setPreviousProgress(progressKey.progress);
    setProgressKey({ progress: Number(newProgress) }); // Update the current progress
  };

  const [markedRows, setMarkedRows] = useState({});
  const handleMarkAsClick = async (index, id) => {
    setcompanyOKRList((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, important: !item.important } : item
      )
    );
    try {
      const response = await apiService.post(
        `objectives/update-objective-important/?objective_id=${id}`
      );
      console.log("Successfully updated in backend");
    } catch (error) {
      console.error("API call failed:", error);
    }
  };
  const handleMarkAsClickKey = async (index, id) => {
    setcompanyOKRList((prevItems) =>
      prevItems.map((item) => ({
        ...item, // Keep the parent item intact
        key_results: item.key_results.map((subItem) =>
          subItem.id === id
            ? { ...subItem, important: !subItem.important } // Toggle the important flag of the subItem
            : subItem
        ),
      }))
    );
    try {
      const response = await apiService.post(
        `objectives/update-objective-important/?objective_id=${id}`
      );
      console.log("Successfully updated in backend");
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  // create from
  const [formData, setFormData] = useState({
    objective_name: "",
    objective_details: "",
    obj_period_type: "",
    objective_type: "",
    user_id: parsedData.user_id ? parsedData.user_id : "",
    assigned_to_id: parsedData.user_id ? parsedData.user_id : "",
    year: 2024,
    period: "Annual",
    type: "Objective",
    username: "",
    progress: 0,
    team: "Company OKR",
    key_results: [],
    who_map_id: parsedData.user_id ? parsedData.user_id : "",
    whom_map_id: parsedData.user_id ? parsedData.user_id : "",
    progress_type: "",
    progress_description: "",
    start_value: "",
    parent_id: null,
    end_value: "",
    milestone_data: "",
    assessment_freq: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "obj_period_type") {
      console.log(value);
      setFormData((prevFormData) => ({
        ...prevFormData,
        objective_type:
          value === "L - Learning"
            ? "1"
            : value === "C - Committed"
            ? "2"
            : value === "A - Aspirational"
            ? "3"
            : "",
      }));
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};
    if (!formData.objective_name) {
      validationErrors.objective_name = "Please fill the input";
    }
    if (!formData.obj_period_type) {
      validationErrors.obj_period_type = "Please select an option";
    }
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await apiService.post(
          `objectives/objectives?user_id=${parsedData.user_id}`,
          [formData]
        );
        if (response) {
          setIsobj(false);
          getCompanyOKRList(parsedData.user_id);
        }
      } catch (error) {
        console.error("failed:", error);
      }
      console.log("Form submitted successfully", formData);
    }
  };
  const openFrom = () => {
    setIsobj((prev) => !prev);
    setFormData({
      objective_name: "",
      objective_details: "",
      obj_period_type: "",
      objective_type: "",
      user_id: parsedData.user_id ? parsedData.user_id : "",
      assigned_to_id: parsedData.user_id ? parsedData.user_id : "",
      year: 2024,
      period: "Annual",
      type: "Objective",
      username: "",
      progress: 0,
      team: "Company OKR",
      key_results: [],
      who_map_id: parsedData.user_id ? parsedData.user_id : "",
      whom_map_id: parsedData.user_id ? parsedData.user_id : "",
      progress_type: "",
      progress_description: "",
      start_value: "",
      parent_id: null,
      end_value: "",
      milestone_data: "",
      assessment_freq: "",
    });
  };

  // key form
  const [keyformData, setKeyFormData] = useState({
    objective_name: "",
    objective_details: "",
    obj_period_type: "L - Learning",
    objective_type: "",
    user_id: parsedData.user_id ? parsedData.user_id : "",
    assigned_to_id: parsedData.user_id ? parsedData.user_id : "",
    year: 2024,
    period: "Annual",
    type: "Key",
    username: "",
    progress: 0,
    team: "Company OKR",
    key_results: [],
    who_map_id: parsedData.user_id ? parsedData.user_id : "",
    whom_map_id: parsedData.user_id ? parsedData.user_id : "",
    progress_type: "",
    progress_description: "",
    start_value: "",
    parent_id: 0,
    end_value: "",
    milestone_data: "",
    assessment_freq: "",
  });

  const getParentObj = (val) => {
    setKeyFormData((prevFormData) => ({
      ...prevFormData,
      parent_id: val,
    }));
    setIsKeybtn(false);
    setIsObjbtn(true);
  };
  const [keyerrors, setKeyErrors] = useState({});

  const keyhandleChange = (e) => {
    const { name, value } = e.target;

    if (name === "obj_period_type") {
      console.log(value);
      setKeyFormData((prevFormData) => ({
        ...prevFormData,
        objective_type:
          value === "L - Learning"
            ? "1"
            : value === "C - Committed"
            ? "2"
            : value === "A - Aspirational"
            ? "3"
            : "",
      }));
    }
    setKeyFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  const keyhandleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};
    if (!keyformData.objective_name) {
      validationErrors.objective_name = "Please fill the input";
    }
    if (!keyformData.obj_period_type) {
      validationErrors.obj_period_type = "Please select an option";
    }
    setKeyErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await apiService.post(
          `objectives/objectives?user_id=${parsedData.user_id}`,
          [keyformData]
        );
        if (response) {
          setIsKey(false);
          getCompanyOKRList(parsedData.user_id);
        }
      } catch (error) {
        console.error("failed:", error);
      }
      console.log("Form submitted successfully", formData);
    }
  };
  const keyFrom = () => {
    setIsKey((prev) => !prev);
    setFormData((prevData) => ({
      ...prevData,
      objective_name: "",
      objective_details: "",
      obj_period_type: "",
    }));
  };
  function formatDate(dateString) {
    const date = new Date(dateString);

    // Extract date components
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Format day with suffix
    const daySuffix = (day) => {
      if (day > 3 && day < 21) return "th"; // for 4th-20th
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    // Convert 24-hour time to 12-hour format
    const formattedHours = hours % 12 || 12;
    const ampm = hours >= 12 ? "PM" : "AM";

    // Pad minutes with leading zero if needed
    const formattedMinutes = minutes.toString().padStart(2, "0");

    return `${day}${daySuffix(
      day
    )} ${month}, ${year}, ${formattedHours}:${formattedMinutes} ${ampm}`;
  }
  const objectiveDelete = async (id) => {
    const formData = new FormData();
    formData.append("user_id", parsedData.user_id);
    console.log(id, formData);
    try {
      const response = await apiService.delete(
        `objectives/objectives_delete/${id}?user_id=${parsedData.user_id}`,
        formData
      );
      if (response) {
        // const modalElement = document.getElementById("exampleModal");
        // const modalInstance = new window.bootstrap.Modal(modalElement);
        // modalInstance.hide();
        getCompanyOKRList(parsedData.user_id);
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  const objectiveEdit = (data, event) => {
    // setIsobj((prev) => !prev);
    event.stopPropagation();

    console.log(data);
    setFormData((prevData) => ({
      ...prevData,
      id: data.id,
      objective_name: data.objective_name,
      objective_details: data.objective_details,
      obj_period_type: data.obj_period_type,
      objective_type:
        data.obj_period_type === "L - Learning"
          ? "1"
          : data.obj_period_type === "C - Committed"
          ? "2"
          : data.obj_period_type === "A - Aspirational"
          ? "3"
          : "",
    }));
    setIsObjEdit(true);
    setIsobj(true);
  };
  const handleEdit = async (e) => {
    e.preventDefault();
    let validationErrors = {};
    if (!formData.objective_name) {
      validationErrors.objective_name = "Please fill the input";
    }
    if (!formData.obj_period_type) {
      validationErrors.obj_period_type = "Please select an option";
    }
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await apiService.put(
          `objectives/objectives_update?user_id=${parsedData.user_id}`,
          [formData]
        );
        if (response) {
          setIsobj(false);
          getCompanyOKRList(parsedData.user_id);
        }
      } catch (error) {
        console.error("failed:", error);
      }
      console.log("Form submitted successfully", formData);
    }
  };
  return (
    <div className="companyDiv">
      <>
        {!isLoader ? (
          <>
            {companyOKRList &&
              companyOKRList.map(
                (items, i) =>
                  items.type === "Objective" && (
                    <div
                      key={i}
                      className="w-100 d-inline-block mb-1 mt-1"
                      onClick={() => getParentObj(items.id)}
                    >
                      <div className="accordion" id="accordionExample">
                        <div className="accordion-item mb-2" tabIndex={i}>
                          <div
                            tabIndex={i}
                            className="collapsed ObjectDiv d-flex"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#accordionExample-${i}`}
                            aria-expanded="false"
                            aria-controls="collapseOne"
                            style={{
                              borderRadius:
                                dropdownValue === "Detailed" &&
                                "6px 6px 0px 0px",
                            }}
                          >
                            <div
                              className="ComObjpercent d-flex justify-content-center align-items-center"
                              style={{
                                borderRadius:
                                  dropdownValue === "Detailed" &&
                                  "6px 0px 0px 0px",
                              }}
                            >
                              <p>{items.progress}%</p>
                            </div>
                            <div className="ComObjpercentTracker w-100 position-relative">
                              <div
                                className="progress-fill"
                                style={{
                                  width: `${items.progress}%`,
                                  backgroundColor: objPercentFn(items.progress),
                                  height: "100%",
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  borderRadius: "0px 6px 6px 0px",
                                  zIndex: 1,
                                }}
                              ></div>

                              <div
                                className="content-wrapper d-flex justify-content-between align-items-center w-100"
                                style={{ position: "relative", zIndex: 2 }}
                              >
                                <p className="ComObjName">
                                  {items.objective_name}
                                </p>
                                <div className="ComObjIndicato d-flex justify-content-center align-items-center gap-3">
                                  {dropdownValue !== "Detailed" && (
                                    <div
                                      className="ComTeamName d-flex justify-content-center align-items-center"
                                      title="Company OKR"
                                    >
                                      <p>CO</p>
                                    </div>
                                  )}
                                  {dropdownValue !== "Detailed" && (
                                    <div
                                      className="objtype-tag d-flex justify-content-center align-items-center"
                                      title={items.obj_period_type}
                                    >
                                      <p>
                                        {items.obj_period_type ===
                                        "A - Aspirational"
                                          ? "A"
                                          : items.obj_period_type ===
                                            "L - Learning"
                                          ? "L"
                                          : items.obj_period_type ===
                                            "C - Committed"
                                          ? "C"
                                          : null}
                                      </p>
                                    </div>
                                  )}

                                  <div
                                    className="mark-as"
                                    onClick={() =>
                                      handleMarkAsClick(i, items.id)
                                    }
                                    style={{
                                      backgroundColor: items.important
                                        ? "red"
                                        : "#d9d9d9",
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                           
                          </div>
                          {dropdownValue === "Detailed" && (
                              <div className="w-100 detailDiv">
                                <div className="w-100 d-flex justify-content-between align-items-center">
                                  <p className="detailTitle">
                                    {items.objective_name}
                                  </p>
                                  <div>
                                    <i
                                      class="fa fa-pencil detailIcon"
                                      aria-hidden="true"
                                      onClick={(e) => objectiveEdit(items, e)}
                                    ></i>
                                    <i
                                      class="fa fa-trash detailIcon cursor-pointer"
                                      aria-hidden="true"
                                      data-bs-toggle="modal"
                                      data-bs-target={`#exampleModal${i}`}
                                    ></i>
                                    <div
                                      class="modal fade"
                                      id={`exampleModal${i}`}
                                      tabindex="-1"
                                      aria-labelledby="exampleModalLabel"
                                      aria-hidden="true"
                                    >
                                      <div class="modal-dialog">
                                        <div class="modal-content">
                                          <div class="modal-header">
                                            <h1
                                              class="modal-title fs-5"
                                              id="exampleModalLabel"
                                            >
                                              Confirmation
                                            </h1>
                                            <button
                                              type="button"
                                              class="btn-close"
                                              data-bs-dismiss="modal"
                                              aria-label="Close"
                                            ></button>
                                          </div>
                                          <div class="modal-body">
                                            Are you sure you want to delete this
                                            objective?
                                          </div>
                                          <div class="modal-footer">
                                            <button
                                              type="button"
                                              class="subBtn"
                                              data-bs-dismiss="modal"
                                            >
                                              No
                                            </button>
                                            <button
                                              onClick={() =>
                                                objectiveDelete(items.id)
                                              }
                                              data-bs-dismiss="modal"
                                              type="button"
                                              class="subBtn"
                                            >
                                              Yes
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="w-100 d-flex justify-content-between align-items-center mt-3">
                                  <p className="detailTitle">
                                    {formatDate(items.created_at)}{" "}
                                    <i class="fas fa-clock"></i>
                                  </p>
                                  <div className="ComObjIndicato d-flex justify-content-center align-items-center gap-3">
                                    <div
                                      className="ComTeamName d-flex justify-content-center align-items-center"
                                      title="Tooltip on top"
                                    >
                                      <p>CO</p>
                                    </div>
                                    <div className="objtype-tag d-flex justify-content-center align-items-center">
                                      <p>
                                        {items.obj_period_type ===
                                        "A - Aspirational"
                                          ? "A"
                                          : items.obj_period_type ===
                                            "L - Learning"
                                          ? "L"
                                          : items.obj_period_type ===
                                            "C - Committed"
                                          ? "C"
                                          : null}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                        </div>
                        {items.key_results &&
                          items.key_results.map((subItem, subIndex) => (
                            console.log('subitem--->',subItem),
                            <div
                              key={subIndex}
                              id={`accordionExample-${i}`}
                              className={`accordion-collapse collapse ${
                                i === 0 && "show"
                              } ${dropdownValue === "Detailed" && "show"}`}
                              aria-labelledby="headingOne"
                              data-bs-parent="#accordionExample"
                            >
                              <div
                                className="accordion-body p0 m0 accordion-button mb-2"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#collapseIn${subIndex}`}
                                aria-expanded="false"
                                aria-controls="collapseOne"
                                onClick={() => objectiveWithKeyResult(subItem)}
                              >
                                <div
                                  className="kr ComKeypercentTracker position-relative"
                                  style={{
                                    borderRadius:
                                      dropdownValue === "Detailed" &&
                                      "6px 6px 0px 0px",
                                  }}
                                >
                                  <div
                                    className="progress-fill"
                                    style={{
                                      width: `${subItem.progress}%`,
                                      backgroundColor: objPercentFn(
                                        subItem.progress
                                      ),
                                      height: "100%",
                                      position: "absolute",
                                      top: 0,
                                      left: 0,
                                      borderRadius: "0px 6px 6px 0px",
                                      zIndex: 1,
                                    }}
                                  ></div>

                                  <div
                                    className="content-wrapper d-flex justify-content-between align-items-center w-100"
                                    style={{ position: "relative", zIndex: 2 }}
                                  >
                                    <p className="ComObjName m25">
                                      {subItem.progress + "% "}
                                      {subItem.objective_name}
                                    </p>
                                    <div className="ComObjIndicato d-flex justify-content-center align-items-center gap-3">
                                      <div
                                        className="ComTeamName d-flex justify-content-center align-items-center"
                                        title="Company OKR"
                                      >
                                        <p>CO</p>
                                      </div>
                                      <div className="objtype-tag d-flex justify-content-center align-items-center">
                                        <p>
                                          {subItem.obj_period_type ===
                                          "A - Aspirational"
                                            ? "A"
                                            : subItem.obj_period_type ===
                                              "L - Learning"
                                            ? "L"
                                            : subItem.obj_period_type ===
                                              "C - Committed"
                                            ? "C"
                                            : null}
                                        </p>
                                      </div>
                                      <div
                                        className="mark-as"
                                        onClick={() =>
                                          handleMarkAsClickKey(i, subItem.id)
                                        }
                                        style={{
                                          backgroundColor: subItem.important
                                            ? "red"
                                            : "#d9d9d9",
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {dropdownValue === "Detailed" && (
                                <div className="keyDetailDiv">
                                  <div className="w-100 d-flex justify-content-between align-items-center">
                                    <p className="detailTitle">
                                      {subItem.objective_name}
                                    </p>
                                    <div>
                                      <i
                                        class="fa fa-pencil detailIcon"
                                        aria-hidden="true"
                                      ></i>
                                      <i
                                        class="fa fa-trash detailIcon"
                                        aria-hidden="true"
                                        data-bs-toggle="modal"
                                        data-bs-target={`#exampleModalkey${i}`}
                                      ></i>
                                    </div>
                                    <div
                                      class="modal fade"
                                      id={`exampleModalkey${i}`}
                                      tabindex="-1"
                                      aria-labelledby="exampleModalLabel"
                                      aria-hidden="true"
                                    >
                                      <div class="modal-dialog">
                                        <div class="modal-content">
                                          <div class="modal-header">
                                            <h1
                                              class="modal-title fs-5"
                                              id="exampleModalLabel"
                                            >
                                              Confirmation
                                            </h1>
                                            <button
                                              type="button"
                                              class="btn-close"
                                              data-bs-dismiss="modal"
                                              aria-label="Close"
                                            ></button>
                                          </div>
                                          <div class="modal-body">
                                            Are you sure you want to delete this
                                            Key result?
                                          </div>
                                          <div class="modal-footer">
                                            <button
                                              type="button"
                                              class="subBtn"
                                              data-bs-dismiss="modal"
                                            >
                                              No
                                            </button>
                                            <button
                                              onClick={() =>
                                                objectiveDelete(subItem.id)
                                              }
                                              data-bs-dismiss="modal"
                                              type="button"
                                              class="subBtn"
                                            >
                                              Yes
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="w-100 d-flex justify-content-between align-items-center mt-3">
                                    <p className="detailTitle">
                                      {formatDate(subItem.created_at)}{" "}
                                      <i class="fas fa-clock"></i>
                                    </p>
                                    <div className="ComObjIndicato d-flex justify-content-center align-items-center gap-3">
                                      <div
                                        className="ComTeamName d-flex justify-content-center align-items-center"
                                        title="Tooltip on top"
                                      >
                                        <p>CO</p>
                                      </div>
                                      <div className="objtype-tag d-flex justify-content-center align-items-center">
                                        <p>
                                          {subItem.obj_period_type ===
                                          "A - Aspirational"
                                            ? "A"
                                            : subItem.obj_period_type ===
                                              "L - Learning"
                                            ? "L"
                                            : subItem.obj_period_type ===
                                              "C - Committed"
                                            ? "C"
                                            : null}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              <div
                                id={`collapseIn${subIndex}`}
                                className="accordion-collapse collapse disIn text-start kr-dtl-title"
                              >
                                <p>{items.objective_name}</p>
                                <div className="readmore-content">
                                  {items.objective_details}
                                </div>
                                <div className="p-3">
                                  <div className="d-flex align-items-center mb-3">
                                    <input
                                      type="range"
                                      min="0"
                                      max="100"
                                      value={progressKey.progress}
                                      onChange={(e) =>
                                        updateProgress(e.target.value)
                                      }
                                      className="form-range flex-grow-1"
                                      style={{
                                        height: "6px",
                                        marginRight: "10px",
                                        background: `linear-gradient(to right, #15E1A4 ${progressKey.progress}%, #fff ${progressKey.progress}%)`,
                                      }}
                                    />
                                    <div
                                      className="font-weight-bold"
                                      style={{
                                        minWidth: "25px",
                                        marginLeft: "10px",
                                      }}
                                    >
                                      {progressKey.progress}%
                                    </div>
                                  </div>
                                 
                                  <div className="comment-section user">
                                    <textarea
                                      className="comment-textarea"
                                      placeholder="Add Check-in comment"
                                      value={comments}
                                      onChange={(e) =>
                                        setComments(e.target.value)
                                      }
                                    ></textarea>
                                    <button
                                      className="check-in-button user"
                                      onClick={() => handleCheckIn(subItem, progressKey, comments)}
                                    >
                                      Check-in
                                    </button>
                                  </div>

                                  <div className="comments-section">
                                    {subItem.logs.map((log, index) => {
                                      // Handle expanded comments
                                      const isExpanded =
                                        showFullComments[index];
                                      const displayedComments = isExpanded
                                        ? log.comments
                                        : log.comments.slice(0, 1);
                                        console.log('displayedComments----',displayedComments)

                                      return (
                                        <div
                                          key={index}
                                          className="comment-item"
                                        >
                                          <div className="line-dot-wrapper">
                                            <div className="dot"></div>
                                            <div
                                              className="line"
                                              // style={{
                                              //   height: `${
                                              //     log.comments.length * 50 + 50
                                              //   }px`,
                                              // }}
                                            ></div>{" "}
                                            {/* Adjust height dynamically */}
                                          </div>

                                          <div className="p-3 border rounded bg-light mb-3">
                                            {/* Update Info */}
                                              <p className="mb-1">
                                                <strong>Update:</strong>{" "}
                                                {`Moved from ${
                                                  log.old_progress || 0
                                                }% to ${log.progress}%`}
                                              </p>
                                              <p className="mb-1">
                                                <strong>Modified on:</strong>{" "}
                                                {formatDate(log.created_at)}
                                              </p>
                                              <p className="mb-0">
                                                <strong>comments:</strong>{" "}
                                                {log.notes_checkin ||
                                                  "No comments"}
                                              </p>

                                            {/* Add Comment Section */}
                                            <div>
                                              <a
                                                className="text-primary"
                                                onClick={() =>
                                                  handleAddCommentClick(index)
                                                }
                                                style={{
                                                  cursor: "pointer",
                                                  textDecoration: "underline",
                                                }}
                                              >
                                                Add Comment
                                              </a>
                                              {activeCommentIndex === index && (
                                                <div className="mt-2">
                                                  <textarea
                                                    className="form-control"
                                                    rows="3"
                                                    placeholder="Add comments"
                                                    value={
                                                      commentText[index] || ""
                                                    }
                                                    onChange={(e) =>
                                                      handleChangeCommentText(
                                                        index,
                                                        e.target.value
                                                      )
                                                    }
                                                  ></textarea>
                                                  <button
                                                    className="btn btn-primary mt-2"
                                                    onClick={() =>
                                                      handleCommentSubmit({
                                                        subItem,
                                                        commentText,
                                                        index,
                                                      })
                                                    }
                                                    disabled={
                                                      !commentText[
                                                        index
                                                      ]?.trim()
                                                    }
                                                  >
                                                    Submit
                                                  </button>
                                                </div>
                                              )}
                                            </div>

                                            {/* Comments Section - Display all comments in a single container */}
                                            <div className="comments-container">
                                              {displayedComments.map(
                                                (comment, commentIndex) => (
                                                  <div
                                                    key={commentIndex}
                                                    className="comment"
                                                    style={{
                                                      backgroundColor:
                                                        "#3366ff",
                                                      color: "#fff",
                                                      marginBottom: "10px",
                                                      padding: "10px",
                                                      borderRadius: "5px",
                                                    }}
                                                  >
                                                    <p className="mb-1">
                                                      <strong>Comment:</strong>{" "}
                                                      {comment.message}
                                                    </p>
                                                    <p className="mb-1">
                                                      <strong>
                                                        Modified on:
                                                      </strong>{" "}
                                                      {formatDate(
                                                        comment.created_at
                                                      )}
                                                    </p>
                                                    <p className="mb-0">
                                                      <strong>
                                                        Commented By:
                                                      </strong>{" "}
                                                      {
                                                        comment.user_display_name
                                                      }
                                                    </p>
                                                  </div>
                                                )
                                              )}
                                            </div>

                                            {/* View More/Less Toggle */}
                                           
                                          </div>
                                          {log.comments.length > 1 && (
                                              <button
                                                onClick={() =>
                                                  toggleComments(index)
                                                }
                                                className="view-toggle-btn mt-2"
                                              >
                                                {isExpanded
                                                  ? "View Less"
                                                  : "View More"}
                                              </button>
                                            )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )
              )}
          </>
        ) : (
          <>
            <div className="w-100 loaderDiv">
              <div className="loader"></div>
            </div>
          </>
        )}
      </>

      <div className="btnDiv d-flex justify-content-between align-items-center w-100">
        <button
          disabled={isObjbtn}
          style={{ opacity: isObjbtn ? 0.6 : 1 }}
          onClick={openFrom}
        >
          Create Objective
        </button>
        <button
          onClick={keyFrom}
          disabled={isKeybtn}
          style={{ opacity: isKeybtn ? 0.6 : 1 }}
        >
          Create Key Result
        </button>
      </div>

      {isObj && (
        <div className="mt-4">
          <form className="p-2 border rounded">
            <div className="mb-3 text-start">
              <label
                htmlFor="objective"
                className="form-label fw-bold createFormLabel"
              >
                Objective
              </label>
              <input
                type="text"
                id="objective_name"
                name="objective_name"
                className="form-control"
                placeholder="Please Provide Your Objective"
                ref={firstInputRef}
                value={formData.objective_name}
                onChange={handleChange}
              />
              {errors.objective_name && (
                <div className="text-danger mt-1">{errors.objective_name}</div>
              )}
            </div>

            <div className="mb-3 text-start">
              <label
                htmlFor="description"
                className="form-label fw-bold createFormLabel"
              >
                Description
              </label>
              <textarea
                id="description"
                name="objective_details"
                className="form-control"
                placeholder="Objective description"
                value={formData.objective_details}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="mb-3 text-start">
              <label
                htmlFor="objectiveType"
                className="form-label fw-bold createFormLabel"
              >
                Objective Type
              </label>
              <select
                id="obj_period_type"
                name="obj_period_type"
                className="form-select"
                value={formData.obj_period_type}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Select Type
                </option>
                <option value="L - Learning">L - Learning</option>
                <option value="C - Committed">C - Committed</option>
                <option value="A - Aspirational">A - Aspirational</option>
              </select>
              {errors.obj_period_type && (
                <div className="text-danger mt-1">{errors.obj_period_type}</div>
              )}
            </div>

            <div className="mb-3 text-start">
              <label
                htmlFor="period"
                className="form-label fw-bold createFormLabel"
              >
                Period
              </label>
              <select
                id="period"
                name="period"
                className="form-select"
                value={formData.period}
              >
                <option value="Annual" disabled>
                  Annual
                </option>
              </select>
            </div>

            <div className="d-flex justify-content-between gap-3">
              <button onClick={openFrom} type="button" className="subBtn">
                Cancel
              </button>
              <button
                type="submit"
                className="subBtn"
                onClick={isObjEdit ? handleEdit : handleSubmit}
              >
                {isObjEdit ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      )}

      {isKey && (
        <div className="mt-4">
          <form className="p-2 border rounded">
            <div className="mb-3 text-start">
              <label
                htmlFor="objective"
                className="form-label fw-bold createFormLabel"
              >
                Key Result
              </label>
              <input
                type="text"
                id="objective_name"
                name="objective_name"
                className="form-control"
                placeholder="Please Provide Your Key Result"
                ref={firstInputRef}
                value={keyformData.objective_name}
                onChange={keyhandleChange}
              />
              {keyerrors.objective_name && (
                <div className="text-danger mt-1">
                  {keyerrors.objective_name}
                </div>
              )}
            </div>

            <div className="mb-3 text-start">
              <label
                htmlFor="description"
                className="form-label fw-bold createFormLabel"
              >
                Description
              </label>
              <textarea
                id="description"
                name="objective_details"
                className="form-control"
                placeholder="Key description"
                value={keyformData.objective_details}
                onChange={keyhandleChange}
              ></textarea>
            </div>

            <div className="mb-3 text-start">
              <label
                htmlFor="objectiveType"
                className="form-label fw-bold createFormLabel"
              >
                KR Type
              </label>
              <select
                id="obj_period_type"
                name="obj_period_type"
                className="form-select"
                value={keyformData.obj_period_type}
                onChange={keyhandleChange}
              >
                <option value="" disabled>
                  Select Type
                </option>
                <option value="L - Learning">L - Learning</option>
                <option value="C - Committed">C - Committed</option>
                <option value="A - Aspirational">A - Aspirational</option>
              </select>
              {keyerrors.obj_period_type && (
                <div className="text-danger mt-1">
                  {keyerrors.obj_period_type}
                </div>
              )}
            </div>

            <div className="mb-3 text-start">
              <label
                htmlFor="period"
                className="form-label fw-bold createFormLabel"
              >
                Period
              </label>
              <select
                id="period"
                name="period"
                className="form-select"
                value={keyformData.period}
              >
                <option value="Annual" disabled>
                  Annual
                </option>
              </select>
            </div>

            <div className="d-flex justify-content-between gap-3">
              <button onClick={keyFrom} type="button" className="subBtn">
                Cancel
              </button>
              <button
                type="submit"
                className="subBtn"
                onClick={keyhandleSubmit}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default CompanyOKR;
