module.exports = function(app, db, jsonParser, urlencodedParser, cors){

    var fields = ["id", "uName", "mTurk", "stanford", "usc", "network", "followers", "totalTweets", "totalTimesRetweeted"];

	app.use(jsonParser);
	app.use(urlencodedParser);
	
	//allow OPTIONS on all resources
	app.options('*', cors())

	console.log("Registering get endpoint: /api/gamergate");
	
	app.get('/api/gamergate', cors(), (req, res) =>{
		var sql = "SELECT " + fields.join(", ") + " FROM gamergate";
		db.all( sql, function(err, rows) {
			if (err) {
				res.status(400).json({"error":err.message});
				return;
			}
			res.json({
				"message": "success",
				"data": rows
			})
		});
	});

	console.log("Registering get endpoint: /api/gamergate/filterStanford");
	
	app.get('/api/gamergate/filterStanford', cors(), (req, res) =>{
		var sql = "SELECT COUNT(*) as Total FROM gamergate WHERE mTurk LIKE stanford";
		db.get( sql, function(err, rows) {
			if (err) {
				res.status(400).json({"error":err.message});
				return;
			}
			res.json({
				"message": "success",
				"data": rows
			})
		});
	});

	console.log("Registering get endpoint: /api/gamergate/filterUSC");
	
	app.get('/api/gamergate/filterUSC', cors(), (req, res) =>{
		var sql = "SELECT COUNT(*) as Total FROM gamergate WHERE mTurk LIKE usc";
		db.get( sql, function(err, rows) {
			if (err) {
				res.status(400).json({"error":err.message});
				return;
			}
			res.json({
				"message": "success",
				"data": rows
			})
		});
	});

	console.log("Registering get endpoint: /api/gamergate/filterNetwork");
	
	app.get('/api/gamergate/filterNetwork', cors(), (req, res) =>{
		var sql = "SELECT COUNT(*) as Total FROM gamergate WHERE mTurk LIKE network";
		db.get( sql, function(err, rows) {
			if (err) {
				res.status(400).json({"error":err.message});
				return;
			}
			res.json({
				"message": "success",
				"data": rows
			})
		});
	});
	

	console.log("Registering post endpoint: /api/gamergate");

	app.post("/api/gamergate/", cors(), (req, res) => {
		var errors=[]
		if (!req.body.uName){
			errors.push("No Name specified");
		}
		if (!req.body.mturk){
			errors.push("No M_Turk label specified");
        }
        if (!req.body.stanford){
			errors.push("No Stanford label specified");
        }
        if (!req.body.usc){
			errors.push("No USC label specified");
        }
        if (!req.body.network){
			errors.push("No Network label specified");
        }
        if (!req.body.followers){
			errors.push("No Followers specified");
        }
        if (!req.body.totalRetweets){
			errors.push("No Total Tweets specified");
		}
        if (!req.body.totalTimesRetweeted){
			errors.push("No totalTimesRetweeted specified");
		}
		if (errors.length){
			res.status(400).json({"error":errors.join(",")});
			return;
		}

		var data = {
			uName: req.body.uName,
			mTurk: req.body.mTurk,
			stanford: req.body.poc,
            usc: req.body.usc,
            network: req.body.network,
            followers: req.body.followers,
            totalRetweets: req.body.totalRetweets,
			totalTimesRetweeted: req.body.totalTimesRetweeted
		}
		var sql ='INSERT INTO gamergate (uName, mTurk, stanford, usc, network, followers, totalTetweets, totalTimesRetweeted) VALUES (?,?,?,?,?,?,?,?)'
		var params =[data.uName, data.mTurk, data.stanford, data.usc, data.network, data.followers, data.totalTweets, data.totalTimesRetweeted];
		db.run(sql, params, function (err, result) {
			if (err){
				res.status(400).json({"error": err.message})
				return;
			}
			res.json({
				"message": "success",
				"data": data,
				"id" : this.lastID
			})
		});
	})

	console.log("Registering patch endpoint: /api/gamergate/{id}");

	app.patch("/api/gamergate/:id", cors(), (req, res) => {
		var data = {
			uName: req.body.uName,
			mTurk: req.body.mTurk,
			stanford: req.body.poc,
            usc: req.body.usc,
            network: req.body.network,
            followers: req.body.followers,
			totalTweets: req.body.totalRetweets,
			totalTimesRetweeted: req.body.totalTimesRetweeted
		}
		var sql ='UPDATE gamergate SET uName = COALESCE(?,uName), mTurk = COALESCE(?,mTurk), '
        +'stanford = COALESCE(?,stanford) , usc = COALESCE(?,usc) , network = COALESCE(?,network), '
        +'followers = COALESCE(?,followers) , totalTweets = COALESCE(?,totalTweets) , totalTimesRetweeted = COALESCE(?,totalTimesRetweeted)'
        +'WHERE id = ?';
		var params =[data.uName, data.mTurk, data.stanford, data.usc, data.network, data.followers, data.totalRetweets, data.totalTimesRetweeted, req.params.id];
		db.run(sql, params, function (err, result) {
			if (err){
				res.status(400).json({"error": res.message})
				return;
			}
			res.json({
				message: "success",
				data: data,
				changes: this.changes
			})
		});
	})

	console.log("Registering delete endpoint: /api/gamergate/{id}");

	app.delete("/api/gamergate/:id", cors(), (req, res, next) => {
		var sql = 'DELETE FROM gamergate WHERE uName = ?';
		var params = [req.params.id];
	    db.run(sql, params, function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({"message":"deleted", changes: this.changes})
	    });
	})
}