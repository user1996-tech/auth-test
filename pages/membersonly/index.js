import React, { useEffect, useState } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useUser as UseUser } from "@auth0/nextjs-auth0/client";
import Head from "next/head";
import NavBar from "../../components/NavBar";
import { db } from "../../firebase/clientApp";
import {
  collection,
  query,
  startAfter,
  getDocs,
  orderBy,
  limit,
  endAt,
  endBefore,
} from "firebase/firestore";
import moment from "moment-timezone";
import countryCodes from "../../components/countryCodes";

const timezones = [
  { id: 1, title: "Australia", timezone: "Australia/Melbourne" },
  { id: 2, title: "Iceland", timezone: "Atlantic/Reykjavik" },
  { id: 3, title: "Singapore", timezone: "Asia/Singapore" },
];

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    // console.log(context.req.headers);

    return { props: { headers: context.req.headers } };
  },
});

const index = ({ headers, jsonData }) => {
  const count = 10;
  const { user, error, isLoading } = UseUser();
  const [selected, setSelected] = useState(0);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [firstVisible, setFirstVisible] = useState(undefined);
  const [lastVisible, setLastVisible] = useState(undefined);
  const [showingStart, setShowingStart] = useState(undefined);
  const [showingEnd, setShowingEnd] = useState(undefined);
  const [previousEnabled, setPreviousEnabled] = useState(false);
  const [nextEnabled, setNextEnabled] = useState(true);

  const updateData = async (direction) => {
    let q = "";
    let data = undefined;
    let tempStart = 0;
    let tempEnd = 0;
    let tempFirstVisible = firstVisible;
    let tempLastVisible = lastVisible;

    console.log("at the start tempFirstVisible ");
    console.log(tempFirstVisible);
    console.log("at the start tempLastVisible ");
    console.log(tempLastVisible);

    if (direction === "previous") {
      q = query(
        collection(db, "visitors"),
        orderBy("createdAt", "desc"),
        limit(count),
        endBefore(firstVisible)
      );
      console.log("inside previous firstVisible");
      console.log(firstVisible);
    } else if (direction === "next") {
      q = query(
        collection(db, "visitors"),
        orderBy("createdAt", "desc"),
        limit(count),
        startAfter(lastVisible)
      );
    }

    if (q != "") {
      let result = [];
      console.log("query being sent ");
      console.log(q);
      data = await getDocs(q);
      console.log("docs - start");
      console.log(data);
      console.log("docs - end");
      data.forEach((doc) => {
        result.push(doc.data());
      });
      setRows(result);
      tempFirstVisible = data.docs[0];
      tempLastVisible = data.docs[data.docs.length - 1];
    }

    if (data != undefined) {
      tempStart = showingStart;
      tempEnd = showingEnd;
      if (direction === "previous") {
        tempEnd = tempStart - 1;
        tempStart = tempStart - count;
        if (await checkForNext(tempLastVisible)) {
          setNextEnabled(true);
        } else {
          setNextEnabled(false);
        }

        if (tempStart == 0) {
          setPreviousEnabled(false);
        } else {
          setPreviousEnabled(true);
        }
      } else if (direction === "next") {
        tempStart = tempEnd + 1;
        tempEnd = tempStart + data.docs.length - 1;

        if (await checkForNext(tempLastVisible)) {
          setNextEnabled(true);
        } else {
          setNextEnabled(false);
        }

        setPreviousEnabled(true);
      }
      // console.log("at the end");
      // console.log(tempLastVisible);

      setShowingStart(tempStart);
      setShowingEnd(tempEnd);
      setFirstVisible(tempFirstVisible);
      setLastVisible(tempLastVisible);
    }
  };

  const checkForNext = async (checkFor) => {
    const q = query(
      collection(db, "visitors"),
      orderBy("createdAt", "desc"),
      limit(1),
      startAfter(checkFor)
    );
    const data = await getDocs(q);
    if (data.docs.length != 0) {
      return true;
    } else {
      return false;
    }
  };

  const generateRegion = (country, region) => {
    let result = "";
    if (country == "" && region == "") {
      result = "";
    } else if (country != "") {
      if (countryCodes[country]) {
        result += countryCodes[country];

        if (region != "") {
          result += ` / ${region}`;
        }
      } else {
        result = "";
      }
    }

    if (result == "") {
      return "Unknown";
    } else {
      return result;
    }
  };

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const result = [];
      const q = query(
        collection(db, "visitors"),
        orderBy("createdAt", "desc"),
        limit(50)
      );
      const data = await getDocs(q);
      data.forEach((doc) => {
        result.push(doc.data());
      });
      setRows(result);
      setFirstVisible(data.docs[0]);
      setLastVisible(data.docs[data.docs.length - 1]);
      setShowingStart(0);
      setShowingEnd(data.docs.length - 1);
      setLoading(false);
    };
    run();
  }, []);

  console.log(`showing ${showingStart} - ${showingEnd}`);
  console.log("outside-> start");
  console.log(firstVisible);
  console.log(lastVisible);
  console.log("outside-> end");
  return (
    <div>
      <Head>
        <title>User Management Page</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-[#f5f5f5]">
        <NavBar />

        <div className="max-w-6xl mx-auto my-10 px-5 space-y-10">
          <div className="flex space-x-5 flex-col md:flex-row text-center">
            <div
              className={`py-2 cursor-pointer px-3 rounded-lg ${
                selected == 0 ? "bg-blue-200" : ""
              }`}
              onClick={() => {
                if (selected != 0) {
                  setSelected(0);
                }
              }}
            >
              <p className="text-2xl font-semibold">Australia Time</p>
            </div>

            <div
              className={`py-2 cursor-pointer px-3 rounded-lg ${
                selected == 1 ? "bg-blue-200" : ""
              }`}
              onClick={() => {
                if (selected != 1) {
                  setSelected(1);
                }
              }}
            >
              <p className="text-2xl font-semibold">Iceland Time</p>
            </div>

            <div
              className={`py-2 cursor-pointer px-3 rounded-lg ${
                selected == 2 ? "bg-blue-200" : ""
              }`}
              onClick={() => {
                if (selected != 2) {
                  setSelected(2);
                }
              }}
            >
              <p className="text-2xl font-semibold">Singapore Time</p>
            </div>
          </div>

          <table className="table">
            <thead className="tableHeader">
              <tr className="tableHeaderRow">
                <th className="tableHeaderData">No</th>
                <th className="tableHeaderData">IP address</th>
                <th className="tableHeaderData">Time and date</th>
                <th className="tableHeaderData">Region</th>
              </tr>
            </thead>
            {loading ? (
              <div className="">Loading ... </div>
            ) : (
              <tbody className="tableBody">
                {rows.map((doc, index) => {
                  return (
                    <tr className="tableBodyDataRow" key={index}>
                      <td className="tableBodyData">
                        {showingStart + index + 1}
                      </td>
                      <td className="tableBodyData">{doc.ip}</td>
                      <td className="tableBodyData">
                        {moment(doc.dateTime)
                          .tz(timezones[selected].timezone)
                          .format("Do MMM YYYY HH:mm")}
                      </td>
                      <td className="tableBodyData">
                        {generateRegion(doc.country, doc.city)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>

          {/* <div className="flex flex-row justify-center space-x-5">
            <div
              className={`cursor-pointer rounded-lg py-2 px-4 border-2 ${
                previousEnabled
                  ? "hover:bg-blue-200 border-black"
                  : "text-gray-400 border-gray-400 "
              }`}
              onClick={() => {
                if (previousEnabled) {
                  updateData("previous");
                }
              }}
            >
              Previous
            </div>
            <div
              className={`cursor-pointer rounded-lg py-2 px-4 border-2 ${
                nextEnabled
                  ? "hover:bg-blue-200 border-black"
                  : "text-gray-400 border-gray-400 "
              }`}
              onClick={() => {
                if (nextEnabled) {
                  updateData("next");
                }
              }}
            >
              Next
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default index;
