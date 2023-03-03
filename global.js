import countryCodes from "./components/countryCodes";

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

const timezones = [
  { id: 1, title: "Australia", timezone: "Australia/Melbourne" },
  { id: 2, title: "Iceland", timezone: "Atlantic/Reykjavik" },
  { id: 3, title: "Singapore", timezone: "Asia/Singapore" },
];

const generateRegion = (country, region) => {
  let result = "";
  if (country == "" && region == "") {
    result = "";
  } else if (country != "") {
    if (countryCodes[country]) {
      result += decodeURI(countryCodes[country]);

      if (region != "") {
        result += ` / ${decodeURI(region)}`;
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

export { generateRegion, timezones };
