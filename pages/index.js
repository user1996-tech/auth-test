import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useUser } from "@auth0/nextjs-auth0/client";
import NavBar from "../components/NavBar";
import { useEffect } from "react";
import { db } from "../firebase/clientApp";
import { doc, addDoc, collection } from "firebase/firestore";
import moment from "moment-timezone";

const generateRandomIP = () => {
  const ip =
    Math.floor(Math.random() * 255) +
    1 +
    "." +
    Math.floor(Math.random() * 255) +
    "." +
    Math.floor(Math.random() * 255) +
    "." +
    Math.floor(Math.random() * 255);

  return ip;
};

export const getServerSideProps = async () => {
  let data = {};
  const dbRef = collection(db, "visitors");
  // get ip from headers here
  const ip = generateRandomIP();
  const currentTime = moment().utc().format();
  const currentTimeStamp = Date.now();
  data = {
    createdAt: currentTimeStamp,
    ip: ip,
    dateTime: currentTime,
    // region: "region"
    // device: "device"
  };
  const res = await addDoc(dbRef, data);

  return { props: { data: data, res: currentTime } };
};

export default function Home({ data, res }) {
  // const { user, error, isLoading } = useUser();
  // const testDate = moment().utc().format();
  // console.log("current Timezone");
  // console.log(moment(testDate).tz("Australia/Melbourne").format("LLLL"));
  // console.log("change Timezone");
  // const newTimezone = moment(testDate).tz("Atlantic/Reykjavik").format("LLLL");
  // console.log(newTimezone);
  console.log(res);

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <NavBar />
        <main className={styles.main}>
          <h1 className={styles.title}>
            Welcome to <a href="https://nextjs.org">Next.js!</a>
          </h1>

          <p className={styles.description}>
            Get started by editing{" "}
            <code className={styles.code}>pages/index.js</code>
          </p>

          <div className={styles.grid}>
            <a href="https://nextjs.org/docs" className={styles.card}>
              <h2>Documentation &rarr;</h2>
              <p>Find in-depth information about Next.js features and API.</p>
            </a>

            <a href="https://nextjs.org/learn" className={styles.card}>
              <h2>Learn &rarr;</h2>
              <p>Learn about Next.js in an interactive course with quizzes!</p>
            </a>

            <a
              href="https://github.com/vercel/next.js/tree/canary/examples"
              className={styles.card}
            >
              <h2>Examples &rarr;</h2>
              <p>Discover and deploy boilerplate example Next.js projects.</p>
            </a>

            <a
              href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              className={styles.card}
            >
              <h2>Deploy &rarr;</h2>
              <p>
                Instantly deploy your Next.js site to a public URL with Vercel.
              </p>
            </a>
          </div>
        </main>

        <footer className={styles.footer}>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{" "}
            <span className={styles.logo}>
              <Image
                src="/vercel.svg"
                alt="Vercel Logo"
                width={72}
                height={16}
              />
            </span>
          </a>
        </footer>
      </div>
    </div>
  );
}
