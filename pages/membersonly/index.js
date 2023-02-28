import React from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { useUser } from "@auth0/nextjs-auth0/client";
import Head from "next/head";
import NavBar from "../../components/NavBar";

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    // console.log(context.req.headers);
    return { props: { headers: context.req.headers } };
  },
});

const index = ({ headers }) => {
  console.log(headers);
  const { user, error, isLoading } = useUser();
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
          <table className="table">
            <thead className="tableHeader">
              <tr className="tableHeaderRow">
                <th className="tableHeaderData">No</th>
                <th className="tableHeaderData">IP address</th>
                <th className="tableHeaderData">Time and date</th>
                <th className="tableHeaderData">Region</th>
              </tr>
            </thead>
            <tbody className="tableBody">
              <tr className="tableBodyDataRow">
                <td className="tableBodyData">1</td>
                <td className="tableBodyData">192.168.20.1</td>
                <td className="tableBodyData">13:02 27/02/23</td>
                <td className="tableBodyData">Australia</td>
              </tr>
              <tr className="tableBodyDataRow">
                <td className="tableBodyData">2</td>
                <td className="tableBodyData">192.168.20.1</td>
                <td className="tableBodyData">13:02 27/02/23</td>
                <td className="tableBodyData">Australia</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default index;
