express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));







//------change the databse information
//---table name "stud"
var mysql = require('mysql');
var con = mysql.createConnection({
	host : "localhost",
	user : "root",
	password : "sparkle1#",
	database :"stud"
});



//--------------------------Login--------------------
	app.post('/api/login',function(req,res){
	 	 var selectq =  "select * from stud where s_email = '"+req.body.s_email+"' AND s_password ='"+req.body.s_password+"'";
	 		
	 		con.query(selectq,function(err,result,field){
 				if(err){
 					console.log(err);
 				}else{
 					if(result.length > 0){
 						console.log("user  found");
 						res.send({data:true});
 					}
 					else{
 						console.log("user not found");
	 					res.send({data:false});
	 				}
 				}
	 				
	 		});
	});



//-----select data with pagination
app.post('/api/select', function(req, res) {
		var col = [];
		col.push('s_id','s_name','s_email','s_gender');
		var columnData = (req.body.order != undefined && req.body.order != '') ? req.body.order[0].column : '';
		var columntype = (req.body.order != undefined && req.body.order != '') ? req.body.order[0].dir : '';
		
		var searchData = req.body.search.value;
		if(searchData.length == 0){
			console.log("data note found");
			var q = "select * from stud ORDER BY  "+ col[columnData]+" "+columntype+" limit  "+req.body.length+"  OFFSET "+req.body.start   ;
		}
		else{
			console.log(req.body.search.value);
			var q = "select * from stud where s_name like '%"+ req.body.search.value +"%' OR s_email like '%"+req.body.search.value+"%' ORDER BY  "+ col[columnData]+" "+columntype+" limit  "+req.body.length+"  OFFSET "+req.body.start;
		}
		con.query(q ,function(err,result,field){
		if(err) {
			console.log(err);
		}		
		console.log("data post method call Selected");
	
		var qcount ="SELECT COUNT(*) as co FROM stud";
			con.query(qcount,function(err,c,field){
				console.log(c[0].co);
				var data = {"draw":0,
						"recordsTotal":c[0].co,
						"recordsFiltered":c[0].co,
						"data" :result};
		res.json(data);
			});
		
	});
		
	});

//-------select all data
app.get('/api/select', function(req, res) {
		var q = "select * from student_mst ";		
		console.log(q);
		con.query(q ,function(err,result,field){
		if(err) {
			console.log(err);
		}
		console.log("data post method call Selected");
		res.json(result);
	});
		
});



	//---------------Insert and Edit API For  Project 
app.post('/api/insert', function(req, res) {
		username = req.body.s_name;
		email= req.body.s_email;
		password = req.body.s_password;
		console.log(password);
		gen = req.body.s_gender;
		//Angular5 
		if(req.body.mode == "Save"){
			var sqlinsert = "insert into stud (s_name,s_email,s_password,s_gender) values('"+username+"', '"+email+"', '"+password+"' , '"+gen+"') ";
			con.query(sqlinsert,function(err,info){
				if (err) {
					res.status(400).send({data:"Not insert"});
					console.log(err);
				}
				console.log("Data insert...!!");
				res.status(200).send({data:"Record has been Inserted..!!"});
			});
	
		}else{
			id = req.body.s_id;
			var sqlupdate = "update stud set s_name= '"+username+"' , s_email = '"+email+"' , s_password = '"+password+"' , s_gender = '"+ gen+"' where s_id =  "+id;
		
			con.query(sqlupdate,function(err,info){
				if (err) 
				console.log(err);
				console.log("Data update...!!");
				res.send({data:"Record has been Updated..!!"});
			});
		}; 
});

//------delete API
app.post('/api/delete',function(req,res){
 		var id =req.body.s_id;
		var sqldelete = "delete from stud  where s_id =  "+id;
		con.query(sqldelete,function(err,info){
		if (err){
			res.send('Error');}
		console.log("Data delete ..!!!");
		res.send({data:"Record has been Delete..!!"});
	});
});

//--------------data search from database 
app.post('/api/search',function(req,res){
		var q = req.body.s_search;
		console.log(q);
		var likeq = "select * from stud where s_name like '%"+q+"%'  or s_email like '"+q+"'";
		console.log(likeq);
		con.query(likeq,function(err,result,field){
			if (err){
			res.send('Error');}
			console.log("Data delete ..!!!");
			res.send(result);
		});

});

app.listen('1437', function(){
	console.log('Example server Listening on port 1437');
});
