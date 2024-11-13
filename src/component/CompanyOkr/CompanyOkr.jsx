import React, { useEffect, useState } from "react";
import "./CompanyOkr.css";
import apiService from "../../ApiService/service";
function CompanyOKR() {
  const [backgroundColor, setBackgroundColor] = useState("");
  const [keyBackgroundColor, setKeyBackgroundColor] = useState("");

  const [percentage, setPercentage] = useState(90);
  const [keypercentage, setKeypPercentage] = useState(50);
  const [parsedData, setParsedData] = useState({});
  const [companyOKRList, setcompanyOKRList] = useState([]);

  useEffect(() => {
    KeyPercentFn();
    const userData = sessionStorage.getItem("userData");
    if (userData) {
      setParsedData(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (parsedData && parsedData.user_id) {
      console.log(parsedData.user_id);
      getCompanyOKRList(parsedData.user_id);
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

  const handleAddCommentClick = () => {
    setShowInput(true);
  };

  const handleViewMoreClick = () => {
    setViewMore(!viewMore);
    if (!viewMore) {
      setShowInput(false);
    }
  };

  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      setComments([
        ...comments,
        {
          text: commentText,
          modifiedOn: new Date().toLocaleString(),
          commentedBy: "Your Name Here",
        },
      ]);
      setCommentText("");
      setShowInput(false);
    }
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

  const [markedRows, setMarkedRows] = useState({});
  const handleMarkAsClick = (index) => {
    setMarkedRows((prevMarkedRows) => ({
      ...prevMarkedRows,
      [index]: !prevMarkedRows[index],
    }));
  };

  return (
    <div className="companyDiv">
       {companyOKRList &&
        companyOKRList.map(
          (items, i) =>
            items.type === "Objective" && (
              <div key={i} className="w-100 d-inline-block mb-1 mt-1">
                <div class="accordion" id="accordionExample">
                  <div class="accordion-item">
                    <div
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
                            <div
                              className="ComTeamName d-flex justify-content-center align-items-center"
                              title="Company OKR"
                            >
                              <p>CO</p>
                            </div>
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
                            <div
                              className="mark-as"
                              onClick={() => handleMarkAsClick(i)}
                              style={{
                                backgroundColor: markedRows[i]
                                  ? "red"
                                  : "#d9d9d9",
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {items.key_results &&
                      items.key_results.map((subItem, subIndex) => (
                        <div
                          id={`accordionExample-${i}`}
                          className={`accordion-collapse collapse ${
                            i === 0 && "show"
                          }`}
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
                          >
                            <div className="ComKeypercentTracker position-relative">
                              {/* Progress bar fill */}
                              <div
                                className="progress-fill"
                                style={{
                                  width: `${keypercentage}%`, // Dynamic width
                                  backgroundColor: keyBackgroundColor, // Dynamic color
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
                                <p className="ComObjName">US Business</p>
                                <div className="ComObjIndicato d-flex justify-content-center align-items-center gap-3">
                                  <div
                                    className="ComTeamName d-flex justify-content-center align-items-center"
                                    title="Tooltip on top"
                                  >
                                    <p>CO</p>
                                  </div>
                                  <div className="objtype-tag d-flex justify-content-center align-items-center">
                                    <p>A</p>
                                  </div>
                                  <div className="mark-as"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            id={`collapseIn${subIndex}`}
                            class="accordion-collapse collapse disIn text-start kr-dtl-title"
                          >
                            <p>US Business update</p>

                            <div className="readmore-content">
                              US Business update
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
                                    style={{ width: "66%" }}
                                    aria-valuenow="66"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                  ></div>
                                </div>
                                <div
                                  className="font-weight-bold"
                                  style={{ minWidth: "25px" }}
                                >
                                  66%
                                </div>
                              </div>

                              {/* Timeline Content */}
                              <div className="comments-section">
                                <div className="p-3 border rounded bg-light">
                                  <p className="mb-1">
                                    <strong>Update:</strong> Moved from 0 to 26%
                                  </p>
                                  <p className="mb-1">
                                    <strong>Modified on:</strong> 1st Oct, 2024,
                                    3:58 PM
                                  </p>
                                  <p className="mb-0">
                                    <strong>Comments:</strong> checkin
                                  </p>
                                  <div className="mt-2">
                                    <a
                                      className="text-primary"
                                      onClick={handleAddCommentClick}
                                      href="/"
                                    >
                                      Add Comment
                                    </a>
                                  </div>
                                  {showInput && (
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
                                        onClick={handleCommentSubmit}
                                        disabled={!commentText.trim()}
                                      >
                                        Submit
                                      </button>
                                    </div>
                                  )}

                                  {viewMore && (
                                    <div className="mt-3">
                                      {comments.map((comment, index) => (
                                        <div
                                          key={index}
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
                                      ))}
                                    </div>
                                  )}
                                  {/* Display Comments */}
                                  {comments.map((comment, index) => (
                                    <div
                                      key={index}
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
                                  ))}
                                </div>
                              </div>

                              <div className="mt-2">
                                <a
                                  href="/"
                                  className="text-primary"
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
              </div>
            )
        )}
     <div className="btnDiv d-flex justify-content-between align-items-center w-100">
      <button>Create Objective</button>
      <button>Create Key Result</button>
     </div>
    </div>
  );
}

export default CompanyOKR;
