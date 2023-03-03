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
import { generateRegion, timezones } from "../../global";

export const getServerSideProps = withPageAuthRequired();

const index = ({ headers, jsonData }) => {
  const count = 50;
  const { user, error, isLoading } = UseUser();
  const [selected, setSelected] = useState(0);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const result = [];
      const q = query(
        collection(db, "visitors"),
        orderBy("createdAt", "desc"),
        limit(count)
      );
      const data = await getDocs(q);
      data.forEach((doc) => {
        result.push(doc.data());
      });
      setRows(result);
      setLoading(false);
    };
    run();
  }, []);

  return (
    <div>
      <Head>
        <title>Home</title>
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
                      <td className="tableBodyData">{index + 1}</td>
                      <td className="tableBodyData">{doc.ip}</td>
                      <td className="tableBodyData">
                        {moment(doc.dateTime)
                          .tz(timezones[selected].timezone)
                          .format("Do MMM YYYY HH:mm:ss")}
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
        </div>
      </div>
    </div>
  );
};

export default index;
