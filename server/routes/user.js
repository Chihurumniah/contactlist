const express = require("express");
const router = express.Router();
var couchbase = require("couchbase");
//couchbases://cb.oxn2z63zskjkyuh1.cloud.couchbase.com

/**
 * 	String endpoint = "couchbases://cb.oxn2z63zskjkyuh1.cloud.couchbase.com"; // Replace this with Connection String
		String username = "admin"; // Replace this with username from cluster access credentials
		String password = "Admin123@"; // Replace this with password from cluster access credentials
		// Connecting to the cluster
		Cluster cluster = Cluster.connect(endpoint, ClusterOptions.clusterOptions(username, password)
		// Use the pre-configured profile below to avoid latency issues with your connection.
						.environment(env -> env.applyProfile("wan-development"))
		);
	
 */
const endpoint = "couchbases://cb.oxn2z63zskjkyuh1.cloud.couchbase.com";
const username = "admin";
const password = "Admin123@";
const bucketName = "travel-sample";



//create new single student profile
router.get("/", async (req, res) => {
  //req.body.name
  try {
    const cluster = await couchbase.connect(endpoint, {
      username: username,
      password: password,
      configProfile: "wanDevelopment",
    });
    
    //bucket initialization
    const bucket = cluster.bucket(bucketName);
    
    //scop initialization note change this
    const collection = bucket.scope("inventry").collection("airport");
    // const data = {
    //   name: req.body.name,
    // };
    // const docId = crypto.randomUUID();
    // await collection.upsert(docId, data);
    res.json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "an internal error" });
  }
});

//add new single student profile
router.post("/add", async (req, res) => {
  //req.body.name
  try {
    const data = {
      name: req.body.name,
    };
    // const docId = crypto.randomUUID();
    // await collection.upsert(docId, data);
    res.json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "an internal error" });
  }
});

//get single student profile
router.get("/:id", async (req, res) => {
  //req.params.id
  try {
    // let result = await collection.get(req.params.id);
    //result.content.name
    res.json({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "an internal error" });
  }
});

//update student
router.put("/:id", async (req, res) => {
  //req.params.id
  const newJson = {
    name:req.body.name
  }
  const docId = req.params.id;
  try {
    // const replaceOpts = {
    //   expiry: 10,
    //   durabilityLevel: couchbase.DurabilityLevel.Majority,
    // };
    // await collection.replace(docId, newJson, replaceOpts)
    res.json({ message: "success" });
  } catch (err) {
    res.status(500).json({ message: "an internal error" });
  }
});
