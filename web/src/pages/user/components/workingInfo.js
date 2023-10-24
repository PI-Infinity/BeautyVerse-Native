import React from "react";
import { useOutletContext } from "react-router-dom";
import styled from "styled-components";
import { workingDaysOptions } from "../../../datas/registerDatas";

export const WorkingInfo = () => {
  // get outlet props context
  const [targetUser] = useOutletContext();
  let lang = "en";
  return (
    <Container>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {targetUser.workingDays?.length > 0 ? (
          targetUser.workingDays?.map((item, index) => {
            let label = workingDaysOptions.find(
              (i) => i.value.toLowerCase() === item.value.toLowerCase()
            );
            let labelLang;
            if (lang === "en") {
              labelLang = label?.en;
            } else if (lang === "ka") {
              labelLang = label?.ka;
            } else {
              labelLang = label?.ru;
            }

            return (
              <div
                key={item._id}
                style={
                  {
                    // width: "calc(100vw - 40px)",
                  }
                }
              >
                <div
                  style={{
                    // backgroundColor: currentTheme.background2,
                    borderRadius: "50px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      color: "#ccc",
                      background: "rgba(255,255,255,0.05)",
                      borderRadius: "50px",
                      padding: "8px 15px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "10px",
                          backgroundColor: "#f866b1",
                        }}
                      ></div>
                      <p
                        style={{
                          color: "#ccc",
                          letterSpacing: "0.5px",
                          margin: 0,
                          fontSize: "14px",
                        }}
                      >
                        {labelLang}
                      </p>
                    </div>
                    <span style={{ color: "#ccc", margin: 0 }}>
                      {item?.hours}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div>
            <p style={{ color: "#888", letterSpacing: "0.5px" }}>Not found</p>
          </div>
        )}
      </div>
      <div>
        {targetUser?.experience?.length > 0 && (
          <>
            <h3
              style={{
                marginVertical: "15px",
                color: "#ccc",
                fontWeight: "bold",
                marginTop: "25px",
                letterSpacing: "0.5px",
              }}
            >
              Experience
            </h3>

            <div
              style={{
                width: "90%",
                backgroundColor: "#111",
                padding: "10px 15px",
                borderRadius: "5px",
              }}
            >
              <p
                style={{
                  color: "#ccc",
                  lineHeight: "22px",
                  letterSpacing: "0.5px",
                }}
              >
                {targetUser?.experience}
              </p>
            </div>
          </>
        )}
      </div>
    </Container>
  );
};

const Container = styled.div`
  box-sizing: border-box;
  padding: 15px 25px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;
