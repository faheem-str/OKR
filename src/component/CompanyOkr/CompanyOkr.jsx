import React, { useEffect, useState } from "react";
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
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [viewMore, setViewMore] = useState(false);

  const handleAddCommentClick = (index) => {
    // setShowInput(true);
    // setActiveCommentIndex(activeCommentIndex === index ? null : index);
    setActiveCommentIndex(index);
  };

  const handleViewMoreClick = () => {
    setViewMore((prev) => !prev);
    // setViewMore(!viewMore);
    // if (!viewMore) {
    //   setShowInput(false);
    // }
  };

  const handleCommentSubmit = ({ subItem }) => {
    if (activeCommentIndex === null || !subItem || !subItem.logs) return;
    const newComments = [...comments];
    if (!newComments[activeCommentIndex]) {
      newComments[activeCommentIndex] = [];
    }
    const log = subItem.logs[activeCommentIndex];
    const displayName = log?.display_name || "Unknown User";

    newComments[activeCommentIndex].push({
      text: commentText,
      modifiedOn: new Date().toLocaleString(),
      commentedBy: displayName,
    });
    setComments(newComments);
    // setComments([...comments, newComments]);
    // setComments((prev) => ({
    //   ...prev,
    //   [activeCommentIndex]: [...(prev[activeCommentIndex] || []), newComments],
    // }));
    setCommentText("");
    setActiveCommentIndex(null); //
  };

  const getCompanyOKRList = async (id) => {
    try {
      const response = await apiService.get(
        `objectives/objectives_with_key_results?user_id=${id}`
      );
      console.log(response);
      setcompanyOKRList(response.data);
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
    } catch (error) {
      console.log(error);
    }
  };

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
    })
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
    setKeyFormData(
      {
        objective_name: "",
        objective_details: "",
        obj_period_type: "",
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
      }
    )
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
  return (
    <div className="companyDiv">
      {companyOKRList &&
        companyOKRList.map(
          (items, i) =>
            items.type === "Objective" && (
              <div
                key={i}
                className="w-100 d-inline-block mb-1 mt-1"
                onClick={() => getParentObj(items.id)}
              >
                <div class="accordion" id="accordionExample">
                  <div class="accordion-item" tabindex={i}>
                    <div
                      tabindex={i}
                      class="collapsed ObjectDiv d-flex"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#accordionExample-${i}`}
                      aria-expanded="false"
                      aria-controls="collapseOne"
                    >
                      <div className="ComObjpercent d-flex justify-content-center align-items-center">
                        <p>{items.progress}%</p>
                      </div>
                      <div className="ComObjpercentTracker w-100 position-relative">
                        {/* Progress bar fill */}
                        <div
                          className="progress-fill"
                          style={{
                            width: `${items.progress}%`, // Dynamic width
                            backgroundColor: objPercentFn(items.progress), // Dynamic color
                            height: "100%",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            borderRadius: "0px 6px 6px 0px",
                            zIndex: 1,
                          }}
                        ></div>

                        {/* Content inside the progress bar */}
                        <div
                          className="content-wrapper d-flex justify-content-between align-items-center w-100"
                          style={{ position: "relative", zIndex: 2 }}
                        >
                          <p className="ComObjName">{items.objective_name}</p>
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
                                  {items.obj_period_type === "A - Aspirational"
                                    ? "A"
                                    : items.obj_period_type === "L - Learning"
                                    ? "L"
                                    : items.obj_period_type === "C - Committed"
                                    ? "C"
                                    : null}
                                </p>
                              </div>
                            )}

                            <div
                              className="mark-as"
                              onClick={() => handleMarkAsClick(i, items.id)}
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
                          <p className="detailTitle">{items.objective_name}</p>
                          <div>
                            <i
                              class="fa fa-pencil detailIcon"
                              aria-hidden="true"
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
                                      onClick={()=>objectiveDelete(items.id)}
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
                                {items.obj_period_type === "A - Aspirational"
                                  ? "A"
                                  : items.obj_period_type === "L - Learning"
                                  ? "L"
                                  : items.obj_period_type === "C - Committed"
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
                      <div
                        id={`accordionExample-${i}`}
                        className={`accordion-collapse collapse ${
                          i === 0 && "show"
                        } ${dropdownValue === "Detailed" && "show"}`}
                        aria-labelledby="headingOne"
                        data-bs-parent="#accordionExample"
                      >
                        <div
                          class="accordion-body p0 m0 accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapseIn${subIndex}`}
                          aria-expanded="false"
                          aria-controls="collapseOne"
                          onClick={() => objectiveWithKeyResult(subItem)}
                        >
                          <div className="kr ComKeypercentTracker position-relative">
                            {/* Progress bar fill */}
                            <div
                              className="progress-fill"
                              style={{
                                width: `${subItem.progress}%`, // Dynamic width
                                backgroundColor: objPercentFn(subItem.progress), // Dynamic color
                                height: "100%",
                                position: "absolute",
                                top: 0,
                                left: 0,
                                borderRadius: "0px 6px 6px 0px",
                                zIndex: 1,
                              }}
                            ></div>

                            {/* Content inside the progress bar */}
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
                                      onClick={()=>objectiveDelete(subItem.id)}
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
                          class="accordion-collapse collapse disIn text-start kr-dtl-title"
                        >
                          <p>{items.objective_name}</p>

                          <div className="readmore-content">
                            {items.objective_details}
                          </div>
                          <div className="p-3">
                            {/* Progress Bar */}
                            <div className="d-flex align-items-center mb-3">
                              <div
                                className="progress flex-grow-1"
                                style={{ height: "6px", marginRight: "10px" }}
                              >
                                <div
                                  className="progress-bar bg-success"
                                  role="progressbar"
                                  style={{ width: `${items.progress}%` }}
                                  aria-valuenow="66"
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                ></div>
                              </div>
                              <div
                                className="font-weight-bold"
                                style={{ minWidth: "25px" }}
                              >
                                {items.progress}%
                              </div>
                            </div>

                            {/* Timeline Content */}
                            {viewMore && (
                              <div className="comments-section">
                                {subItem.logs.map((log, index) => (
                                  <div
                                    key={index}
                                    className="p-3 border rounded bg-light mb-3"
                                  >
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
                                      <strong>Comments:</strong>{" "}
                                      {log.notes_checkin || "No comments"}
                                    </p>
                                    <div className="mt-2">
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
                                    </div>
                                    {activeCommentIndex === index && (
                                      <div className="mt-2">
                                        <textarea
                                          className="form-control"
                                          rows="3"
                                          placeholder="Add comments"
                                          value={commentText}
                                          onChange={(e) =>
                                            setCommentText(e.target.value)
                                          }
                                        ></textarea>
                                        <button
                                          className="button-kr mt-2"
                                          onClick={() =>
                                            handleCommentSubmit({ subItem })
                                          }
                                          disabled={!commentText.trim()}
                                        >
                                          Submit
                                        </button>
                                      </div>
                                    )}
                                    {/* Display Comments */}
                                    {comments[index] &&
                                      comments[index].map(
                                        (comment, commentIndex) => (
                                          <div
                                            key={commentIndex}
                                            className="p-3 mt-3 rounded"
                                            style={{
                                              backgroundColor: "#3366ff",
                                              color: "#fff",
                                            }}
                                          >
                                            <p className="mb-1">
                                              <strong>Comments:</strong>{" "}
                                              {comment.text}
                                            </p>
                                            <p className="mb-1">
                                              <strong>Modified on:</strong>{" "}
                                              {comment.modifiedOn}
                                            </p>
                                            <p className="mb-0">
                                              <strong>Commented By:</strong>{" "}
                                              {comment.commentedBy}
                                            </p>
                                          </div>
                                        )
                                      )}
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="mt-2">
                              <a
                                className="text-primary"
                                style={{
                                  cursor: "pointer",
                                  textDecoration: "underline",
                                }}
                                onClick={handleViewMoreClick}
                              >
                                {viewMore ? "View Less" : "View More"}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )
        )}
      <div className="btnDiv d-flex justify-content-between align-items-center w-100">
        <button
          disabled={isObjbtn}
          style={{ opacity: isObjbtn && 0.6 }}
          onClick={openFrom}
        >
          Create Objective
        </button>
        <button
          onClick={keyFrom}
          disabled={isKeybtn}
          style={{ opacity: isKeybtn && 0.6 }}
        >
          Create Key Result
        </button>
      </div>
      {/* create form */}
      {isObj && (
        <div className=" mt-4">
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
                <option value="" disabled>Select Type</option>
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
              <button type="submit" className="subBtn" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
      {isKey && (
        <div className=" mt-4">
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
                <option value="" disabled>Select Type</option>
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
