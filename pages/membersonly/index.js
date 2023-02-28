import React, { useEffect, useState } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useUser as UseUser } from "@auth0/nextjs-auth0/client";
import Head from "next/head";
import NavBar from "../../components/NavBar";
import { db } from "../../firebase/clientApp";
import { collection, query, where, getDocs } from "firebase/firestore";
// import moment from "moment";
import moment from "moment-timezone";

const timezones = [
  { title: "Australia", timezone: "Autralia/Melbourne" },
  { title: "Iceland", timezone: "Atlantic/Reykjavik" },
  { title: "Singapore", timezone: "Asia/Singapore" },
];

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    // console.log(context.req.headers);

    return { props: { headers: context.req.headers } };
  },
});

const index = ({ headers, jsonData }) => {
  const { user, error, isLoading } = UseUser();
  const [selected, setSelected] = useState(0);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // const test = "2023-02-28T21:09:27+11:00";
  // console.log(moment(test).tz("America/Los_Angeles").format());

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      const result = [];
      const q = query(collection(db, "visitors"));
      const data = await getDocs(q);
      // console.log(data.docs);
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
        <title>User Management Page</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-[#f5f5f5]">
        <NavBar />

        <div className="max-w-6xl mx-auto my-10">
          <div
            className="py-2 cursor-pointer"
            onClick={() => {
              setSelected((selected + 1) % 3);
            }}
          >
            <p className="text-2xl font-semibold">
              {timezones[selected].title} Time
            </p>
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
                    <tr className="tableBodyDataRow">
                      <td className="tableBodyData">{index}</td>
                      <td className="tableBodyData">{doc.ip}</td>
                      <td className="tableBodyData">
                        {moment(doc.dateTime)
                          .tz(timezones[selected].timezone)
                          .format("LLLL")}
                      </td>
                      <td className="tableBodyData">Australia</td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </div>

        {/* <div className="max-w-6xl mx-auto my-10">
          <div className="py-2">
            <p className="text-2xl font-semibold">Iceland Time</p>
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
                    <tr className="tableBodyDataRow">
                      <td className="tableBodyData">{index}</td>
                      <td className="tableBodyData">{doc.ip}</td>
                      <td className="tableBodyData">
                        {moment(doc.dateTime)
                          .tz("Atlantic/Reykjavik")
                          .format("LLLL")}
                      </td>
                      <td className="tableBodyData">Iceland</td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </div> */}

        {/* <div className="max-w-6xl mx-auto my-10">
          <div className="py-2">
            <p className="text-2xl font-semibold">Singapore Time</p>
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
                    <tr className="tableBodyDataRow">
                      <td className="tableBodyData">{index}</td>
                      <td className="tableBodyData">{doc.ip}</td>
                      <td className="tableBodyData">
                        {moment(doc.dateTime)
                          .tz("Asia/Singapore")
                          .format("LLLL")}
                      </td>
                      <td className="tableBodyData">Singapore</td>
                    </tr>
                  );
                })}
              </tbody>
            )}
          </table>
        </div> */}
      </div>
    </div>
  );
};

export default index;
