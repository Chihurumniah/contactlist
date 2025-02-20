const express = require("express");
const router = express.Router();
const redis = require("redis");
const cors = require("cors");
//import { createClient } from 'redis';

//const useRouter = require('./routes/user')

const app = express();
app.use(cors());
app.use(express.json());

const username = ""; // note add username
const password = ""; // add password

//use this ti initialize app
app.get("/", async (req, res) => {
  try {
    const client = redis.createClient({
      username: username,
      password: password,
      socket: {
        host: "redis-14665.c240.us-east-1-3.ec2.redns.redis-cloud.com",
        port: 14665,
      },
    });

    client.on("error", (err) => console.log("Redis Client Error", err));

    await client.connect();
    //note this will be an arrey of users objetcs

     const allContacts = await client.get("contact");
    const convertedContact = allContacts == null ? [] : JSON.parse(allContacts)
  //   console.log(allContacts);
  //  if(allContacts != null) {
  //    res.json({ message: allContacts });
  //  }
  //console.log(convertedContact)
   res.json({ contact: JSON.stringify(convertedContact)});
   
    //res.send({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "an internal error" });
  }
});

//add new single student profile
app.post("/addcontact", async (req, res) => {
  //req.body.contact
  try {
    //NOTE IN PRODUCTION THIS DATA SHOULD BE VALIDATED

    const client = redis.createClient({
      username: username,
      password: password,
      socket: {
        host: "redis-14665.c240.us-east-1-3.ec2.redns.redis-cloud.com",
        port: 14665,
      },
    });

    client.on("error", (err) => console.log("Redis Client Error", err));

    await client.connect();

    let result = await client.get("contact");
    //this cecks if th result is == null if then send and empty array else convert the
    //the string array in to an object array before sending it to convertedResult variable
    let convertedResult = result == null ? [] : JSON.parse(result)
    //convert this back to an arraye of objects
    const allContacts = convertedResult;
    //add the new user to all existing users
    //PLEASE NOTE IN PRODUCTION APP YOU CHECK IF THE USER EMAIL DOSE NOT ALREADY EXISTS
    let updatedContacts = [...allContacts, req.body.contact];
    await client.set("contact", JSON.stringify(updatedContacts));
    console.log(updatedContacts); //gets all users
    console.log(req.body);
    //res.json({ message: "success" });
    res.json({ message: JSON.stringify(updatedContacts) });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "an internal error" });
  }
});

//update student
app.put("/updatecontact/:id", async (req, res) => {
  try {
    //note id here is the users email which we use as our primary key
    //to locate users before updating their data
    let contactId = Number(req.params.id);
    // const newData = {
    //   name: req.body.name,
    //   email: req.body.email,
    //   location: req.body.location,
    //   skills: req.body.skills,
    // };

    const client = redis.createClient({
      username: username,
      password: password,
      socket: {
        host: "redis-14665.c240.us-east-1-3.ec2.redns.redis-cloud.com",
        port: 14665,
      },
    });

    client.on("error", (err) => console.log("Redis Client Error", err));

    await client.connect();

    const result = await client.get("contact");
    //convert this back to an arraye of objects
    const allTodos = JSON.parse(result);
    //add the new user to all existing users
    //PLEASE NOTE IN PRODUCTION APP YOU CHECK IF THE USER EMAIL DOSE NOT ALREADY EXISTS
    let updatedContacts = allTodos.map((contact, index) => {
      if (contactId == index) {
        return req.body.contact;
      } else {
        return contact;
      }
    }); //[...allUsers, data]
    await client.set("contact", JSON.stringify(updatedContacts));
    console.log(updatedContacts); //gets all users
    res.json({ message: JSON.stringify(updatedContacts) });
  } catch (err) {
    res.status(500).json({ message: "an internal error" });
  }
});

//update student
app.delete("/deletecontact/:id", async (req, res) => {
  try {
    //note id here is the users email which we use as our primary key
    //to locate users before updating their data
    let contactId = Number(req.params.id);

    const client = redis.createClient({
      username: username,
      password: password,
      socket: {
        host: "redis-14665.c240.us-east-1-3.ec2.redns.redis-cloud.com",
        port: 14665,
      },
    });

    client.on("error", (err) => console.log("Redis Client Error", err));

    await client.connect();

    const result = await client.get("contact");
    //convert this back to an arraye of objects
    const allTodos = JSON.parse(result);
    //add the new user to all existing users
    //PLEASE NOTE IN PRODUCTION APP YOU CHECK IF THE USER EMAIL DOSE NOT ALREADY EXISTS
    let updatedContact = allTodos.filter((todo, index) => index != contactId);
    await client.set("contact", JSON.stringify(updatedContact));
    console.log(updatedContact); //gets all users
    res.json({ message: JSON.stringify(updatedContact) });
  } catch (err) {
    res.status(500).json({ message: "an internal error" });
  }
});

//app.use('/users', useRouter)

app.listen(3000, () => {
  console.log("Server staeted at port 3000");
});
